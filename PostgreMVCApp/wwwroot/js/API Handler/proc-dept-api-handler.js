const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';

async function getUsers() {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/User?pageSize=20`, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch users`);
        return await response.json();
    } catch (err) {
        console.error("Error fetching users:", error);
    }
};

async function createProcDeptAsync(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ProcurementDepartment`, {
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
        return { code: 201, message: "Success creating procurement department" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function getProcDeptById(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ProcurementDepartment/id/${encodeURIComponent(id)}`, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch procurement department with id: ${id}`);
        return await response.json();
    } catch (err) {
        console.error("Error fetching procurement department:", error);
    }
};

async function updateProcDeptAsync(payload) {
    console.log("Payload for update: ", payload);
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ProcurementDepartment`, {
            method: putMethod,
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
        return { code: 201, message: "Success updating procurement department" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function deleteAsync(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ProcurementDepartment/${encodeURIComponent(id)}`, {
            method: deleteMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) throw new Error('Failed to delete procurement department');
        showSuccessToast("Success deleting procurement department");
    } catch (error) {
        console.error("Error deleting procurement department: ", error);
    }
};
