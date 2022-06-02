<template>
  <div class="home">
    <Header></Header>
    <!-- value当前选中的value值，activeColor当前选中的激活颜色 -->
    <ly-tabs v-model="value" :activeColor="activeColor">
      <ly-tab-item name="1" title="推荐" />
      <ly-tab-item name="2" title="大红袍" />
      <ly-tab-item name="3" title="绿茶" />
      <ly-tab-item name="4" title="铁观音" />
      <ly-tab-item name="5" title="普洱" />
      <ly-tab-item name="6" title="茶具" />
      <ly-tab-item name="5" title="花茶" />
    </ly-tabs>
    <section>
      <Swiper></Swiper>
      <Icons></Icons>
      <Recommend></Recommend>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from "@/components/home/Header.vue";
import Swiper from "@/components/home/Swiper.vue";
import Icons from "@/components/home/Icons.vue";
import Recommend from "@/components/home/Recommend.vue";
import Cart from "@/components/home/Cart.vue";
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
    Header,
    Swiper,
    Icons,
    Recommend,
    Tabbar,
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