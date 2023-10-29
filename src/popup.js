import * as api from "./api.js";

async function main() {
    while (!await api.userIsLoggedIn()) {
        var { success, message } = await api.loginWithUsernameAndPassword(prompt("Username"), prompt("Password"));

        if (!success) alert(message);
    }

    document.querySelector("#user-email").textContent = await api.fetchUserData();

    var units = await api.fetchUnitList();
    var unitSelect = document.querySelector("#unit-select");

    units.forEach(unit => {
        unitSelect.appendChild(new Option(unit.name, unit.id));
    });
}

window.api = api;
main();
