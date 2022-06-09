<template>
  <div class="like">
    <Card>
      <span>猜你喜欢</span>
    </Card>
    <ul>
      <li v-for="(item, index) in likeList" :key="index">
        <h2><img :src="item.imgUrl" alt="" /></h2>
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
export default {
  name: "Like",
  props: {
    likeList: Array,
  },
  data() {
    return {};
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
</style>