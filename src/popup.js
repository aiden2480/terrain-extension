import * as api from "./api.js";

async function main() {
    while (!await api.userIsLoggedIn()) {
        var { success, message } = await api.loginWithUsernameAndPassword(prompt("Username"), prompt("Password"));

        if (!success) alert(message);
    }

    document.write(await api.fetchUserData());
}

window.api = api;
main();
