<template>
  <div class="home">
    这是首页
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "../components/common/Tabbar.vue";
export default {
  name: "Home",
  components: {
    Tabbar,
  },
};
</script>

<style>
</style>