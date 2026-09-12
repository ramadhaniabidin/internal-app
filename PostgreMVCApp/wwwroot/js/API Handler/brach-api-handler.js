
const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';

async function getToken() {
    const loginResponse = await fetch(`${baseUrl}/api/auth/token`, {
        method: postMethod,
        headers: { 'Content-Type': contentType }
    });

    if (!loginResponse.ok) throw new Error('Login failed');
    const authData = await loginResponse.json();
    return authData.token;
};

async function getBranchById(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/branch/id/${encodeURIComponent(id)}`, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch branch with id: ${id}`);
        const branch = await response.json();
        return branch;
    } catch (err) {
        console.error("Error fetching branches:", error);
    }
};

async function createBranch(payload) {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch`, {
            method: postMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!branchesResponse.ok) {
            const errorMessage = await branchesResponse.text();
            return { code: branchesResponse.status, message: errorMessage };
        }
        return { code: 201, message: "Success creating branch" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function updateBranchAsync(payload) {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch`, {
            method: putMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!branchesResponse.ok) {
            const errorMessage = await branchesResponse.text();
            return { code: branchesResponse.status, message: errorMessage };
        }
        return { code: 200, message: "Success updating branch" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function deleteBranchAsync(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/branch/${encodeURIComponent(id)}`, {
            method: deleteMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            showErrorToast(errorMessage);
        }
        showSuccessToast("Success deleting branch");
    } catch (error) {
        showErrorToast(error);
    }
};