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
            IdToken: data.AuthenticationResult.IdToken,
            AccessToken: data.AuthenticationResult.AccessToken,
            AccessTokenExpiresAt: new Date().getTime() + 1000 * data.AuthenticationResult.ExpiresIn
        });
    } else {
        res.message = data.__type + " - " + data.message;
    }

    return res;
}

export async function logout() {
    await chrome.storage.sync.clear();
}

export async function userIsLoggedIn() {
    var { RefreshToken } = await chrome.storage.sync.get([ "RefreshToken" ]);

    return RefreshToken != null;
}

async function getTokens() {
    var {
        IdToken,
        AccessToken,
        AccessTokenExpiresAt
    } = await chrome.storage.sync.get([ "IdToken", "AccessToken", "AccessTokenExpiresAt" ]);
    
    var tokens = { IdToken, AccessToken };
    if ([IdToken, AccessToken, AccessTokenExpiresAt].includes(undefined) || new Date().getTime() >= AccessTokenExpiresAt) {
        tokens = await generateNewTokens();
    }

    return tokens;
}

async function getAccessToken() {
    var { AccessToken } = await getTokens();
    
    return AccessToken;
}

async function getIdToken() {
    var { IdToken } = await getTokens();

    return IdToken;
}

async function generateNewTokens() {
    var { RefreshToken } = await chrome.storage.sync.get([ "RefreshToken" ]);

    if (RefreshToken == null) {
        throw new Error("RefreshToken not set, please login with username and password first");
    }

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
    
    if (!resp.ok) {
        await logout();
        throw new Error(data.__type + " - " + data.message);
    }

    await chrome.storage.sync.set({
        IdToken: data.AuthenticationResult.IdToken,
        AccessToken: data.AuthenticationResult.AccessToken,
        AccessTokenExpiresAt: new Date().getTime() + 1000 * data.AuthenticationResult.ExpiresIn
    });

    return {
        IdToken: data.AuthenticationResult.IdToken,
        AccessToken: data.AuthenticationResult.AccessToken
    }
}

export async function fetchUserData() {
    var body = {
        "AccessToken": await getAccessToken(),
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

export async function fetchUnitList() {
    var resp = await fetch("https://members.terrain.scouts.com.au/profiles", {
        headers: { "Authorization": await getIdToken() }
    });
    
    var data = await resp.json();
    
    return data.profiles.map(groupObj => {
        return groupObj.unit;
    }).filter(x => x != null);
}

export async function fetchPendingApprovals(unitID) {
    var resp = await fetch(`https://achievements.terrain.scouts.com.au/units/${unitID}/submissions?status=pending`, {
        headers: { "Authorization": await getIdToken() }
    });

    return await resp.json();
}
