using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using PostgreMVCApp.DTO;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Models;
using PostgreMVCApp.Models.Master_Data;
using System.Net;
using System.Net.Http.Headers;

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

        public async Task<PagedResult<VendorNonCommercials>> GetVendors(int pageNumber, int pageSize, string? search)
        {
            try
            {
                Dictionary<string, string?> queryParams = GetQueryParams(pageNumber, pageSize, search);
                string url = QueryHelpers.AddQueryString("/api/Vendor", queryParams);
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<VendorNonCommercials>>();
                    return data ?? new PagedResult<VendorNonCommercials>();
                }
                else if(response.StatusCode == HttpStatusCode.NotFound)
                {
                    return ReturnEmptyItems<VendorNonCommercials>(pageNumber, pageSize, search);
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

        public async Task<PagedResult<ContractType>> GetContractTypes(int pageNumber, int pageSize, string? search)
        {
            try
            {
                Dictionary<string, string?> queryParams = GetQueryParams(pageNumber, pageSize, search);
                string url = QueryHelpers.AddQueryString("/api/ContractType", queryParams);
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
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

        public async Task<PagedResult<UserProcDept>> GetUserProcDepts(int pageNumber, int pageSize, string? search)
        {
            try
            {
                Dictionary<string, string?> queryParams = GetQueryParams(pageNumber, pageSize, search);
                string url = QueryHelpers.AddQueryString("/api/UserProcDept", queryParams);
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<UserProcDept>>();
                    return data ?? new PagedResult<UserProcDept>();
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return ReturnEmptyItems<UserProcDept>(pageNumber, pageSize, search);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Failed to fetch User Procurement Departments: {response.StatusCode} - {error}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching User Procurement Departments data", ex);
            }
        }

        public async Task<PagedResult<GeneralLedgers>> GetGeneralLedgers(int pageNumber, int pageSize, string? search)
        {
            var queryParams = new Dictionary<string, string?>
            {
                ["pageNumber"] = pageNumber.ToString(),
                ["pageSize"] = pageSize.ToString(),
                ["keyword"] = search
            };
            string url = QueryHelpers.AddQueryString("/api/GeneralLedger", queryParams);
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
            using(var response = await _httpClient.SendAsync(request))
            {
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<GeneralLedgers>>();
                    return data ?? new PagedResult<GeneralLedgers>();
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return ReturnEmptyItems<GeneralLedgers>(pageNumber, pageSize, search);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new InvalidOperationException($"Failed to fetch User Procurement Departments: {response.StatusCode} - {error}");
                }
            }
        }

        public async Task<PagedResult<MaterialAnaplanDisplay>> GetMaterialAnaplans(int pageNumber, int pageSize, string? search)
        {
            var queryParams = new Dictionary<string, string?>
            {
                ["pageNumber"] = pageNumber.ToString(),
                ["pageSize"] = pageSize.ToString(),
                ["keyword"] = search
            };
            string url = QueryHelpers.AddQueryString("/api/MaterialAnaplan", queryParams);
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
            using (var response = await _httpClient.SendAsync(request))
            {
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<MaterialAnaplanDisplay>>();
                    return data ?? new PagedResult<MaterialAnaplanDisplay>();
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return ReturnEmptyItems<MaterialAnaplanDisplay>(pageNumber, pageSize, search);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new InvalidOperationException($"Failed to fetch Material Anaplan: {response.StatusCode} - {error}");
                }
            }
        }

        public async Task<MaterialAnaplanDisplay> GetMaterialById(int id)
        {
            string endpoint = $"/api/MaterialAnaplan/id/{id}";
            using var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
            using (var response = await _httpClient.SendAsync(request))
            {
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<MaterialAnaplanDisplay>();
                    return data ?? new ();
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return new();
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new InvalidOperationException($"Failed to fetch Material Anaplan: {response.StatusCode} - {error}");
                }
            }
        }

        public async Task<PagedResult<Branch>> GetBranchesPaged(int pageNumber, int pageSize, string? search)
        {
            try
            {
                Dictionary<string, string?> queryParams = GetQueryParams(pageNumber, pageSize, search);
                string url = QueryHelpers.AddQueryString("/api/Branch", queryParams);
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());
                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<PagedResult<Branch>>();
                    return data ?? new PagedResult<Branch>();
                }
                else if(response.StatusCode == HttpStatusCode.NotFound)
                {
                    return ReturnEmptyItems<Branch>(pageNumber, pageSize, search);
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
