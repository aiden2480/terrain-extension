<template>
    <button @click="onClick">
      <slot>Button</slot>
    </button>
</template>

<script>
export default {
    props: {
        onClick: {
            type: Function,
            required: true
        }
    }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz@6..12&display=swap");

button {
    background: linear-gradient(97.08deg, #071E57, #00348D);
    box-shadow: none;
    color: #fff;
    padding-left: 24px;
    padding-right: 24px;
    transition: all .2s ease;
    border-radius: 28px;
    outline: none;
    padding: 0 16px;
    cursor: pointer;
    justify-content: center;
    text-transform: uppercase;
    border: none;
    font-family: "Nunito Sans", sans-serif;
}

button:hover {
    background: linear-gradient(97.08deg, #00348D 0, #00348D 100%);
}
</style>
