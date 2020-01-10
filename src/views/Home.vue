<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <svg-icon size="3em" icon-class="fangzi"></svg-icon>
        <svg-icon size="3em" icon-class="diannao"></svg-icon>
        <svg-icon size="3em" icon-class="ren"></svg-icon>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import SvgIcon from "../icons/svg-icon";

export default {
    name: "home",
    components: {
        SvgIcon,
        HelloWorld
    },
};
</script>

