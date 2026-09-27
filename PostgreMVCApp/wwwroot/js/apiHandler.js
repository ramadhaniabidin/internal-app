const baseUrl = 'https://api.procurement-app.my.id';

async function getToken() {
    const loginResponse = await fetch(`${baseUrl}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
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