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
  props: {
    iconsList: Array,
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