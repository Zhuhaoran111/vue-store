<template>
  <div class="search-index">
    <Header></Header>
    <section>
      <div class="search-hsitory" v-if="searchArr.length">
        <h2>
          <i class="iconfont icon-shijian"></i>
          <span>历史搜索</span>
          <span @click="deleteHistory">清空历史记录</span>
        </h2>
        <ul>
          <li
            v-for="(item, index) in searchArr"
            :key="index"
            @click="goSearchList(item)"
          >
            <!-- 上面的点击事件把自己历史搜索中的记录传过去 -->
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-else>暂无搜索记录</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/components/search/Header.vue";
import { MessageBox } from "mint-ui";

export default {
  data() {
    return {
      searchArr: [],
    };
  },
  components: { Tabbar, Header },
  created() {
    this.searchArr = JSON.parse(localStorage.getItem("searchList")) || [];
  },
  methods: {
    deleteHistory() {
      MessageBox({
        title: "Notice",
        message: "Are you sure?",
        showCancelButton: true,
      }).then((res) => {
        if (res == "confirm") {
          //删除本地存储，页面没有删除
          localStorage.removeItem("searchList");
          this.searchArr = [];
        }
      });
    },
    //点击历史搜索，进入搜索结果也页面
    goSearchList(item) {
      //跳转页面
      this.$router.push({
        name: "list",
        //通过路由传参
        query: {
          key: item /* 这里是把要搜索的值传过去，在这里是把item历史搜索记录传过去 */,
        },
      });
      console.log(item);
    },
  },
};
</script>

<style scoped>
.search-index {
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