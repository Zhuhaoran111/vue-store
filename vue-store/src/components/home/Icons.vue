<template>
  <ul class="icons">
    <li v-for="(item, index) in iconsList" :key="index">
      <img :src="item.imgUrl" alt="" />
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      iconsList: [
        {
          id: 1,
          title: "自饮茶",
          imgUrl: "./images/icons1.png",
        },
        {
          id: 1,
          title: "茶具",
          imgUrl: "./images/icons2.png",
        },
        {
          id: 1,
          title: "自饮茶",
          imgUrl: "./images/icons3.png",
        },
        {
          id: 1,
          title: "领福利",
          imgUrl: "./images/icons4.png",
        },
        {
          id: 1,
          title: "官方验证",
          imgUrl: "./images/icons5.png",
        },
      ],
    };
  },
};
</script>

<style scoped>
.icons {
  display: flex;
  justify-content: space-around;
  padding: 0.4rem 0;
}
.icons li {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icons img {
  width: 1.0133rem;
  height: 1.0133rem;
}
.icons span {
  font-size: 0.4267rem;
}
</style>