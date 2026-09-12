const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';

async function createContractTypeAsync(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ContractType`, {
            method: postMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            return { code: response.status, message: errorMessage };
        }
        return { code: 201, message: "Success creating contract type" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function getContractTypeById(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ContractType/id/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch contract type with id: ${id}`);
        return await response.json();
    } catch (err) {
        console.error("Error fetching branches:", error);
    }
};

async function updateContractTypeAsync(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ContractType`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            return { code: response.status, message: errorMessage };
        }
        return { code: 201, message: "Success updating contract type" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function deleteContractTypeAsync(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ContractType/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to delete contract type');
        showSuccessToast("Success deleting contract type");
    } catch (error) {
        console.error("Error deleting contract type: ", error);
    }
};
