<template>
  <div class="home">
    <Header></Header>
    <!-- value当前选中的value值，activeColor当前选中的激活颜色 -->
    <ly-tabs v-model="value" :activeColor="activeColor">
      <ly-tab-item name="1" title="选项卡1" />
      <ly-tab-item name="2" title="选项卡2" />
      <ly-tab-item name="3" title="选项卡1" />
      <ly-tab-item name="4" title="选项卡2" />
      <ly-tab-item name="5" title="选项卡1" />
      <ly-tab-item name="6" title="选项卡2" />
    </ly-tabs>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from "@/components/home/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";

export default {
  name: "Home",
  data() {
    return {
      value: "1",
      activeColor: "#b0352f",
      // options: {
      //   activeColor: "#b0352f",
      // },
    };
  },

  components: {
    Tabbar,
    Header,
  },
};
</script>

<style scoped>
/* 穿透阴影 */
::v-deep .ly-tabbar {
  box-shadow: none;
}
::v-deep .ly-tabs {
  border-bottom: none;
}
</style>