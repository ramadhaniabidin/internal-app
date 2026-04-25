const baseUrl = 'http://localhost:30001';

async function getToken() {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Username: "admin", // Replace with your actual credentials
            Password: "123"
        })
    });

    if (!loginResponse.ok) throw new Error('Login failed');
    const authData = await loginResponse.json();
    return authData.token;
};

async function getWeatherForecast() {
    try {
        const token = await getToken();
        const weatherResponse = await fetch(`${baseUrl}/api/weatherforecast`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!weatherResponse.ok) throw new Error('Failed to fetch weather');

        const weatherData = await weatherResponse.json();

        console.log("Weather Data received:", weatherData);
        return weatherData;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

async function getBranches() {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!branchesResponse.ok) throw new Error('Failed to fetch branches');
        const branchesData = await branchesResponse.json();
        console.log("Branches Data received:", branchesData);
        return branchesData;
    } catch (error) {
        console.error("Error fetching branches:", error);
    }
};

async function getBranchById(id) {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch/id/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!branchesResponse.ok) throw new Error(`Failed to fetch branch with id: ${id}`);
        const branch = await branchesResponse.json();
        return branch;
    } catch (err) {
        console.error("Error fetching branches:", error);
    }
};

async function createBranch(payload) {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!branchesResponse.ok) throw new Error('Failed to create branch');
        showSuccessToast("Success creating branch");
    } catch (error) {
        console.error("Error creating branch:", error);
    }
};

async function createContractTypeAsync(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/ContractType`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if(!response.ok) throw new Error('Failed to create contract type');
        showSuccessToast('Success creating contract type');
    } catch (error) {
        showErrorToast('Error creating contract type: ' + error);
    }
};

async function updateBranchAsync(payload) {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!branchesResponse.ok) throw new Error('Failed to update branch');
        showSuccessToast("Success updating branch");
    } catch (error) {
        showErrorToast("Error updating branch: " + error);
    }
};

async function deleteBranchAsync(id) {
    try {
        const token = await getToken();
        const branchesResponse = await fetch(`${baseUrl}/api/branch/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!branchesResponse.ok) throw new Error('Failed to delete branch');
        showSuccessToast("Success deleting branch");
    } catch (error) {
        console.error("Error deleting branch: ", error);
    }
};

async function getNonCommercialData() {
    try {
        const token = await getToken();
        const nonCommercialResponse = await fetch(`${baseUrl}/api/noncommercial/index`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!nonCommercialResponse.ok) throw new Error('Failed to fetch non-commercial data');
        const nonCommercialData = await nonCommercialResponse.json();
        console.log("Non-Commercial Data received:", nonCommercialData);
        return nonCommercialData;
    } catch (error) {
        console.error("Error fetching non-commercial data:", error);
    }
};

async function getApproverRoles(moduleID) {
    try {
        const token = await getToken();
        const approverRolesResponse = await fetch(`${baseUrl}/api/noncommercial/approverrole?moduleID=${moduleID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!approverRolesResponse.ok) throw new Error('Failed to fetch approver roles');
        const approverRolesData = await approverRolesResponse.json();
        return approverRolesData;
    } catch (error) {
        console.error("Error fetching approver roles:", error);
    }
};