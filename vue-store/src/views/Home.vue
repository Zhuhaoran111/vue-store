<template>
  <div class="home">
    <div class="headers">
      <div class="headers-main">
        <Header></Header>
        <!-- value当前选中的value值，activeColor当前选中的激活颜色 -->
        <ly-tabs v-model="value" @change="changeTab">
          <ly-tab-item name="1" title="推荐" />
          <ly-tab-item name="2" title="大红袍" />
          <ly-tab-item name="3" title="铁观音" />
          <ly-tab-item name="4" title="绿茶" />
          <ly-tab-item name="5" title="普洱" />
          <ly-tab-item name="6" title="茶具" />
          <ly-tab-item name="7" title="花茶" />
        </ly-tabs>
      </div>
    </div>

    <!-- 可以用ref操作dom节点，与id差不多，通过this.$ref来调用  let wrapperDom= this.$ref.test-->
    <section class="wrapper">
      <!--这里是ref先注释掉 -->
      <div>
        <div v-for="(item, index) in newData" :key="index">
          <Swiper v-if="item.type == 'swiperList'" :swiperList="item.data">
          </Swiper>
          <Icons v-if="item.type == 'iconsList'" :iconsList="item.data">
          </Icons>
          <Recommend
            v-if="item.type == 'recommendList'"
            :recommendList="item.data"
          ></Recommend>
          <Ad v-if="item.type == 'adList'" :adList="item.data"></Ad>
          <Like v-if="item.type == 'likeList'" :likeList="item.data"></Like>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from "@/components/home/Header.vue";
import Swiper from "@/components/home/Swiper.vue";
import Icons from "@/components/home/Icons.vue";
import Recommend from "@/components/home/Recommend.vue";
import Like from "@/components/home/Like.vue";
import Ad from "@/components/home/Ad.vue";
import Tabbar from "@/components/common/Tabbar.vue";
//引入插件
import BetterScroll from "better-scroll";
import axios from "axios";

import http from "@/common/api/request.js";

export default {
  name: "Home",
  data() {
    return {
      value: "1", //当前默认激活的name的数值
      newData: [],
      activeColor: "#b0352f",
      betterScroll: "",
      betterScroll1: "",
    };
  },

  components: {
    Header,
    Swiper,
    Icons,
    Recommend,
    Like,
    Ad,
    Tabbar,
  },
  created() {
    this.getData();
    console.log(this);
  },

  //有节点时挂载滚动条,子元素一定要比父元素高度高
  // mounted() {

  // },
  methods: {
    //请求数据的接口
    async getData() {
      let res = await http.$axios({
        url: "/api/index_list/0/data01",
      });

      this.Tabbar = res.topBar; //这个渲染不了
      this.newData = res.data;

      //nextTick等dom都加载完毕才执行这行代码
      this.$nextTick(() => {
        this.betterScroll = new BetterScroll(".wrapper", {
          movable: true,
          zoom: true,
          click: true,
        });
      });
    },

    //点击请求
    async addData(index) {
      let res = await http.$axios({
        url: "/api/index_list/" + index + "/data01",
      });
      // console.log(res.data);
      // console.log(res.data.data[0]);
      // console.log(res.data.data.data);
      if (res.constructor != Array) {
        //这里判断如果res.data.data不是数组则判断还有一层，里面的data,如果是数组直接取数据即可
        this.newData = res.data;
      } else {
        this.newData = res;
      }

      //nextTick等dom都加载完毕才执行这行代码,滑动默认取消click事件
      this.$nextTick(() => {
        this.betterScroll1 = new BetterScroll(".wrapper", {
          movable: true,
          zoom: true,
          click: true,
        });
      });
    },
    /* 这里面的item就是name的值，index怎么无定义呢 */
    changeTab(item, index) {
      index = item - 1;
      console.log(index);
      this.addData(index);
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.headers {
  width: 100%;
  height: 2.88rem;
}
.headers-main {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
section {
  flex: 1;
  overflow: hidden;
}
::v-deep .ly-tabbar {
  box-shadow: none;
  border-bottom: none;
}
</style>
