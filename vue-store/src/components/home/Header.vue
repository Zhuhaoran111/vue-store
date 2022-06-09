<template>
  <header>
    <h1><img src="../../assets/image/logo.png" alt="" /></h1>
    <div class="search" @click="goSearch">
      <i class="iconfont icon-fangdajing"></i>
      <span>搜索你想要的.....</span>
    </div>
    <div class="kefu">
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    goSearch() {
      //点击事件进入到搜索页面
      this.$router.push("/search");
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* position: fixed;
  top: 0;
  left: 0; */
  width: 100%;
  height: 1.6rem;
  background-color: #b0352f;
}
header h1 {
  padding: 0 0.266666rem;
  width: 3.2rem;
  height: 1.333333rem;
}
header h1 img {
  width: 100%;
  height: 100%;
}

.search {
  display: flex;
  align-items: center; /*默认是row，justify-content是两边的对齐，align-items是垂直的对齐 */
  width: 6.56rem;
  height: 0.8rem;
  background: #fff;
  border-radius: 0.32rem; /* 设置圆角 */
}
.search i {
  padding: 0.16rem;
  color: #ccc;
}

.search span {
  font-size: 0.3733rem;
  color: #ccc;
}

.kefu i {
  font-size: 0.96rem;
  color: #fff;
}
</style>