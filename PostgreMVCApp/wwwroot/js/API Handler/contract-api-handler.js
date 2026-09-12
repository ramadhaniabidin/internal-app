const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';

const emptyItems = {
    'items': [],
    'pageNumber': null,
    'pageSize': null,
    'searchTerm': '',
    'totalCount': null,
    'totalPages': null
};

async function getToken() {
    const loginResponse = await fetch(`${baseUrl}/api/auth/token`, {
        method: postMethod,
        headers: { 'Content-Type': contentType }
    });

    if (!loginResponse.ok) throw new Error('Login failed');
    const authData = await loginResponse.json();
    return authData.token;
};

function generateEndpoint(pageIndex, searchBy, keyWord, path) {
    const url = new URL(`${baseUrl}${path}`);

    url.searchParams.append('pageNumber', pageIndex);
    url.searchParams.append('pageSize', 5);

    if (keyWord) {
        url.searchParams.append('keyword', keyWord);
    }

    if (searchBy) {
        url.searchParams.append('searchBy', searchBy);
    }

    return url.toString().replace(/\+/g, '%20');
};

async function getVendors(pageIndex, searchBy, keyWord, path) {
    console.log('Search by: ', searchBy);
    console.log('Keyword: ', keyWord);
    try {
        const token = await getToken();
        const endpoint = generateEndpoint(pageIndex, searchBy, keyWord, path);
        console.log('endpoint: ', endpoint);
        const response = await fetch(endpoint, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });

        if (!response.ok) {
            return emptyItems;
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Error fetching vendors:", err);
    }
};