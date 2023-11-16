<template>
    <Popup v-if="isLoggedIn == true"></Popup>
    <div v-else-if="isLoggedIn == false" class="container">
        <select id="branch">
            <option value="act">Australian Capital Territory</option>
            <option value="nsw">New South Wales</option>
            <option value="nt" >Northern Territory</option>
            <option value="qld">Queensland</option>
            <option value="sa" >South Australia</option>
            <option value="tas">Tasmania</option>
            <option value="vic">Victoria</option>
            <option value="wa" >Western Australia</option>
            <option value="aus">National</option>
        </select>

        <input id="username" placeholder="Username" type="text" />
        <input id="password" placeholder="Password" type="password" />

        <Button :onClick="submit">Submit</Button>
    </div>
</template>

<script>
import Button from "./Button.vue";
import Popup from "./Popup.vue";

import * as api from "../api.js";

export default {
    components: {
        Button,
        Popup
    },
    methods: {
        async submit() {
            var branch = document.getElementById("branch").value;
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            var { success, message } = await api.loginWithUsernameAndPassword(`${branch}-${username}`, password);
            
            if (success) {
                this.isLoggedIn = true;
            } else {
                alert(message);
            }
        }
    },
    data() {
        return { isLoggedIn : null }
    },
    created: async function() {
        this.isLoggedIn = await api.userIsLoggedIn();
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz@6..12&display=swap");

.container {
    height: 80vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: cornsilk;

    margin: auto;
    border: 3px solid green;
    padding: 10px;
    border-radius: 25px;
}

body {
    background-image: url("https://terrain.scouts.com.au/images/bg-login.svg") no-repeat center center fixed;
    background-color: #071E57;

}

select, input {
    font-family: "Nunito Sans", sans-serif;
    margin-bottom: 20px;
}

input {
    text-align: start;
    cursor: text;
    border: none;
    outline: none;
    border-bottom: 2px solid #767676; 
}
</style>
