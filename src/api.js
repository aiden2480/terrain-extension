const BASE_URL = "https://cognito-idp.ap-southeast-2.amazonaws.com";
const LOGIN_HEADERS = {
    "Content-Type": "application/x-amz-json-1.1",
    "X-amz-target": "AWSCognitoIdentityProviderService.InitiateAuth"
};

export async function loginWithUsernameAndPassword(username, password) {
    var body = {
        "ClientId": "6v98tbc09aqfvh52fml3usas3c",
        "AuthFlow": "USER_PASSWORD_AUTH",
        "AuthParameters": {
            "USERNAME": username,
            "PASSWORD": password
        }
    }

    var resp = await fetch(BASE_URL, {
        method: "POST",
        headers: LOGIN_HEADERS,
        body: JSON.stringify(body)
    });

    var data = await resp.json();
    var res = { success: resp.ok };

    if (resp.ok) {
        await chrome.storage.sync.set({
            RefreshToken: data.AuthenticationResult.RefreshToken,
            AccessToken: data.AuthenticationResult.AccessToken
        });
    } else {
        res.message = data.__type + ": " + data.message;
    }

    return res;
}

export async function logout() {
    await chrome.storage.sync.remove([ "RefreshToken", "AccessToken", "AccessTokenExpiresAt" ]);
}

export async function userIsLoggedIn() {
    var { RefreshToken } = await chrome.storage.sync.get([ "RefreshToken" ]);

    return RefreshToken != null;
}

async function ensureValidAccessToken() {
    var { AccessTokenExpiresAt } = await chrome.storage.sync.get([ "AccessTokenExpiresAt" ]);
    
    if (new Date().getTime() >= AccessTokenExpiresAt) {
        await generateNewAccessToken();
    }
}

async function generateNewAccessToken() {
    var { RefreshToken } = await chrome.storage.sync.get([ "RefreshToken" ]);

    var body = {
        "ClientId": "6v98tbc09aqfvh52fml3usas3c",
        "AuthFlow": "REFRESH_TOKEN_AUTH",
        "AuthParameters": {
            "REFRESH_TOKEN": RefreshToken,
            "DEVICE_KEY": null
        }
    }

    var resp = await fetch(BASE_URL, {
        method: "POST",
        headers: LOGIN_HEADERS,
        body: JSON.stringify(body)
    });

    var data = await resp.json();
    await chrome.storage.sync.set({
        AccessToken: data.AuthenticationResult.AccessToken,
        AccessTokenExpiresAt: new Date().getTime() + 1000 * data.AuthenticationResult.ExpiresIn
    });
}

export async function fetchUserData() {
    await ensureValidAccessToken();
    var body = {
        "AccessToken": (await chrome.storage.sync.get()).AccessToken,
    }

    var headers = {
        "Content-Type": "application/x-amz-json-1.1",
        "X-amz-target": "AWSCognitoIdentityProviderService.GetUser"
    };

    var resp = await fetch(BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });

    var data = await resp.json();
    return "Hello, " + data.UserAttributes[2].Value;
}
