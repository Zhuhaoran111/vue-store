<template>
  <div>
    <Header></Header>
    <section>
      <div class="search-hsitory">
        <h2>
          <i class="iconfont icon-shijian"></i>
          <span>历史搜索</span>
          <span>清空历史记录</span>
        </h2>
        <ul>
          <li>茶叶</li>
          <li>茶叶</li>
          <li>茶叶</li>
          <li>茶叶</li>
          <li>茶叶</li>
          <li>茶叶</li>
        </ul>
      </div>
      <div></div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/components/search/Header.vue";

export default {
  components: { Tabbar, Header },
};
</script>

<style scoped>
.search {
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  flex: 1;
  background-color: #f5f5f5;
  overflow: hidden;
}
.search-hsitory {
  padding: 0.5333rem;
}
.search-hsitory h2 {
  font-size: 18px;
  font-weight: 400;
}
.search-hsitory h2 span:last-child {
  margin-left: 130px;
}
.search-hsitory h2 i {
  padding-right: 0.08rem;
  color: red;
  font-size: 18px;
}
.search-hsitory ul {
  padding: 0 0.2667rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0.5333rem 0;
}
.search-hsitory ul li {
  margin: 10px;
  padding: 0.08rem 0.16rem;
  font-size: 14px;
  border: 1px solid #ccc;
}
</style>