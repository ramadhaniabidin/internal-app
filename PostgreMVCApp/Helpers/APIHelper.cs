using Microsoft.AspNetCore.WebUtilities;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Models;
using System.Net;

namespace PostgreMVCApp.Helpers
{
    public class APIHelper
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly string _baseUrl;
        private readonly string _username;
        private readonly string _password;

        public APIHelper(IConfiguration configuration)
        {
            _username = configuration.GetValue<string>("AppSettings:APIUsername") ?? string.Empty;
            _password = configuration.GetValue<string>("AppSettings:APIPassword") ?? string.Empty;
            _baseUrl = configuration.GetValue<string>("AppSettings:APIBaseUrl") ?? string.Empty;
            if (!string.IsNullOrEmpty(_baseUrl))
            {
                _httpClient.BaseAddress = new Uri(_baseUrl);
            }
        }

        public async Task<string> GetToken()
        {
            var loginData = new
            {
                Username = _username,
                Password = _password
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync("/api/auth/login", loginData);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                    if (result != null && result.TryGetValue("token", out var token))
                    {
                        Console.WriteLine("token: " + token);
                        return token;
                    }
                }
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Authentication failed: {response.StatusCode} - {errorContent}");
            }
            catch(Exception ex)
            {
                throw new Exception("Error during authentication", ex);
            }
        }

        public async Task<PagedResult<ContractType>> GetContractTypes(int pageNumber, int pageSize, string? search)
        {
            try
            {
                var queryParams = new Dictionary<string, string?>
                {
                    ["pageNumber"] = pageNumber.ToString(),
                    ["pageSize"] = pageSize.ToString(),
                    ["search"] = search
                };
                string url = QueryHelpers.AddQueryString("/api/ContractType", queryParams);
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", await GetToken());
                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<ContractType>>();
                    return data ?? new PagedResult<ContractType>();
                }
                else if(response.StatusCode == HttpStatusCode.NotFound)
                {
                    return ReturnEmptyItems<ContractType>(pageNumber, pageSize, search);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Failed to fetch Contract Types: {response.StatusCode} - {error}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching contract type data", ex);
            }
        }

        public async Task<PagedResult<Branch>> GetBranchesPaged(int pageNumber, int pageSize, string? search)
        {
            try
            {
                var queryParams = new Dictionary<string, string?>
                {
                    ["pageNumber"] = pageNumber.ToString(),
                    ["pageSize"] = pageSize.ToString(),
                    ["search"] = search
                };
                string url = QueryHelpers.AddQueryString("/api/Branch", queryParams);
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", await GetToken());
                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<Branch>>();
                    return data ?? new PagedResult<Branch>();
                }
                else if(response.StatusCode == HttpStatusCode.NotFound)
                {
                    return new PagedResult<Branch>
                    {
                        Items = new List<Branch>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize,
                        SearchTerm = search
                    };
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Failed to fetch data: {response.StatusCode} - {error}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching data", ex);
            }
        }

        private PagedResult<T> ReturnEmptyItems<T>(int pageNumber, int pageSize, string? search)
        {
            return new PagedResult<T>
            {
                Items = new List<T>(),
                TotalCount = 0,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = search
            };
        }

        private Dictionary<string, string?> GetQueryParams(int pageNumber, int pageSize, string? search)
        {
            var queryParams = new Dictionary<string, string?>
            {
                ["pageNumber"] = pageNumber.ToString(),
                ["pageSize"] = pageSize.ToString(),
                ["search"] = search
            };
            return queryParams;
        }

    }
}
