<template>
    <p id="user-email"></p>

    <select id="unit-select" v-for="unit in units">
        <option value="{{ unit.id }}">{{ unit.name }}</option>
    </select>

    <div id="pending-approvals">
    </div>
</template>

<script>
import * as api from "../api.js";

export default {
    data() {
        return { units: [] }
    },
    created: async function() {
        this.units = await api.fetchUnitList();
        window.api = api;
    }
};
</script>
