<template>
  <div class="recommend">
    <Card></Card>
    <ul>
      <li v-for="(item, index) in recommendList" :key="index">
        <!-- 这是左边的图片 -->
        <h2>
          <img :src="item.imgUrl" alt="" />
        </h2>
        <!-- 这是右边的内容 -->
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.content }}</p>
          <div class="price">
            <span>￥</span>
            <b>{{ item.price }}</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from "@/components/home/Card.vue";

export default {
  components: { Card },
  props: {
    recommendList: Array,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.recommend ul li {
  position: relative;
}
.recommend ul li > div {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 0.533333rem;
  display: flex;
  align-items: center;
}

.recommend ul li > div h3 {
  font-size: 12px;
}

.recommend ul li > div p {
  font-size: 0.426666rem;
}
.recommend ul li img {
  width: 9.6rem;
  height: 3.84rem;
  border-radius: 12px;
}

.price {
  margin-top: 0.666666rem;
  text-align: right;
  color: red;
}
.price span {
  font-size: 0.373333rem;
}
.title {
  padding: 0.2667rem;
  width: 100%;
  text-align: center;
  font-size: 0.4267rem;
}
</style>