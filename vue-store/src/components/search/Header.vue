<template>
  <header>
    <!-- 左中右三部分 -->
    <div class="search-return" @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="search-main">
      <i class="iconfont icon-fangdajing"></i>
      <form action="" onsubmit="return false">
        <input type="text" placeholder="搜索你喜欢的产品" />
      </form>
    </div>
    <div class="search-btn">搜索</div>
  </header>
</template>

<script>
export default {
  methods: {
    //返回首页
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 1.1733rem;
  background-color: red;
  color: #fff;
}
.search-return {
  padding: 0 0.2667rem;
}

.search-return i {
  font-size: 0.5867rem;
}

.search-btn {
  font-size: 0.4267rem;
}

.search-main {
  width: 6.6533rem;
  height: 0.8rem;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20px;
  margin-right: 12px;
}
.search-main i {
  padding: 0 0.2667rem;
  color: #666666;
}

.search-main form {
  width: 100%;
  display: flex;
  /* 设置水平居中和垂直居中 */
  justify-content: center;
  align-items: center;
}
.search-main form input {
  width: 100%;
}
</style>