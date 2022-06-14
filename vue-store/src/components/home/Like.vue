<template>
  <div class="like">
    <Card>
      <span>猜你喜欢</span>
    </Card>
    <ul>
      <li v-for="(item, index) in likeList" :key="index" @click="goDetail">
        <!-- <h2><img :src="item.imgUrl" alt="" /></h2>   下面改成懒加载 -->
        <h2><img v-lazy="item.imgUrl" alt="" /></h2>
        <h3>{{ item.name }}</h3>
        <div>
          <span>￥</span>
          <b>{{ item.price }}</b>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from "@/components/home/Card.vue";
//引入懒加载插件
import { Lazyload } from "mint-ui";
export default {
  name: "Like",
  props: {
    likeList: Array,
  },
  data() {
    return {};
  },
  methods: {
    goDetail() {
      //scrool默认取消click事件，所以要在Home.vue里面加click:true
      this.$router.push({
        path: "/detail",
      });
    },
  },
  components: { Card },
};
</script>

<style scoped>
.like ul {
  display: flex;
  flex-wrap: wrap;
  /*默认情况下数据不换行的，会一行挤排列
  flex-wrap: wrap;可以让盒子进行换行
  */
}
.like ul li {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
}
.like h3 {
  padding: 0 0.16rem;

  width: 96%;
  font-size: 0.3733rem;
  font-weight: 300px;
  color: #222;
  overflow: hidden;
  text-overflow: nowrap;
  white-space: nowrap;
}
.like img {
  width: 4.6933rem;
  height: 4.6933rem;
}

.like ul li > div {
  padding: 0.16rem 0.08rem;
  text-align: left;
  color: red;
  font-size: 15px;
}
/* 给符号设置大小 */
.like ul li > div span {
  font-size: 12px;
}

/* 懒加载样式 */
.like img[lazy="loading"] {
  background-color: #f7f7f7;
}
</style>
