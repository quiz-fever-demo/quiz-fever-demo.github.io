export const settings = {
    host: ''
};

async function request(url, options) {
    try {
        const response = await fetch(url, options);

        if (response.ok === false) {
            const error = await response.json();
            throw new Error(error.message);
        }
        try {
            return await response.json();
        } catch (error) {
            return response;
        }

    } catch (error) {
        alert(error.message);
        throw error;
    }
}

function createOptions(method = 'GET', data) {
    const user = sessionStorage.getItem('user');
    const result = {
        method,
        headers: {
            'X-Parse-Application-Id': 'wEBxP93870VHx6aitjTYhAJxvboHxfZiUaU9Aa3T',
            'X-Parse-REST-API-Key': 'Djdpi8Ag52V6qNYbLf3Ifm0YO72w02Qyc5ZN9yoH'
        }
    };
    if (data) {
        result.headers['Content-Type'] = 'application/json';
        result.body = JSON.stringify(data);
    }
    if (user !== null) {
        result.headers['X-Parse-Session-Token'] = JSON.parse(user).token;
    }
    return result;
}

export async function get(url) {
    return await request(url, createOptions());
}

export async function post(url, data) {
    return await request(url, createOptions('POST', data));
}

export async function put(url, data) {
    return await request(url, createOptions('PUT', data));
}

export async function del(url) {
    return await request(url, createOptions('DELETE'));
}

export async function login(username, password) {
    const result = await post(settings.host + '/login', { username, password });
    const user = {
        token: result.sessionToken,
        id: result.objectId,
        username: username,
    };
    sessionStorage.setItem('user', JSON.stringify(user));
    return result;
}

export async function register(email, username, password) {
    const result = await post(settings.host + '/users', { email, username, password });
    const user = {
        token: result.sessionToken,
        id: result.objectId,
        username: username,
    };
    sessionStorage.setItem('user', JSON.stringify(user));
    return result;
}

export async function logout() {
    const result = await post(settings.host + '/logout', {});
    sessionStorage.removeItem('user');
    return result;
}