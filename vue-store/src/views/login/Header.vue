<template>
  <header>
    <div class="returns" @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div>
      <!-- 默认是登录可以修改为注册  插槽 -->
      <slot> <span>登录</span></slot>
    </div>
    <div class="house">
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style>
header {
  display: flex;
  justify-content: space-between;
  align-items: center; /*垂直居中 */
  width: 100%;
  height: 1.1733rem;
  background-color: #b0352f;
  color: #fff;
}
header div span {
  font-size: 0.48rem;
}
.returns {
  padding: 0 0.4rem;
  font-size: 0.48rem;
}
.house {
  padding: 0 0.4rem;
  font-size: 0.48rem;
}
</style>
