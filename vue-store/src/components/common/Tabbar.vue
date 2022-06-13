<template>
  <div class="tabbar">
    <ul>
      <li
        v-for="(item, index) in routerList"
        :key="index"
        @click="switchTab(item.path)"
      >
        <!--  点击事件，发送路径-->
        <!-- {{ $route.path.includes(item.path) ? item.selected : item.active }} -->
        <img
          :src="$route.path.includes(item.path) ? item.selected : item.active"
          alt=""
        />
        <!-- <span>{{ item.title }}</span> d点击不同的按钮文字也换颜色-->
        <span :class="$route.path.includes(item.path) ? 'active' : ''">{{
          item.title
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // name: "Tabbar",
  data() {
    return {
      routerList: [
        {
          title: "首页",
          path: "/home",
          active: "/images/home.png",
          selected: "/images/home-select.png",
        },
        {
          title: "分类",
          path: "/list",
          active: "/images/list.png",
          selected: "/images/list-select.png",
        },
        {
          title: "购物车",
          path: "/cart",
          active: "/images/cart.png",
          selected: "/images/cart-select.png",
        },
        {
          title: "我的",
          path: "/my",
          active: "/images/my.png",
          selected: "/images/my-select.png",
        },
      ],
    };
  },

  methods: {
    switchTab(path) {
      //判断的是否点击的是同一个路由
      if (this.$route.path == path) return;
      //下面是对应路由挑战的页面
      this.$router.replace(path);
    },
  },
};
</script>

<style scoped>
.tabbar {
  position: fixed; /* 固定定位 */
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.6rem;
  background-color: #fff;
}
.tabbar ul {
  display: flex; /* flex布局 */
  justify-content: space-around;
  width: 100%;
  height: 100%;
  align-items: center;
  /* 复习：align-items: stretch | flex-start | flex-end | center | baseline;
   flex-start:这一行俄罗斯方块在顶部
   flex-end:这一行俄罗斯方块在底部
   center:这一行俄罗斯方方块在中间
   对比：
   justify-content:是主轴上的就是水平轴上的位置，靠左边，靠右边，两边对齐啊
   align-items：是相当于垂直轴上的:顶部居中啊，水平居中啊，底部居中啊
   space-between 两边贴边对齐   space-arround:左右margin值一样,最左最右有间距

   上面的都要遵循主轴侧轴
   flex-direction: row :主轴为水平起点在左端 justify-content设置水平，align-items设置垂直
   flex-direction: column:主轴为侧轴，justify-content设置水垂直，align-items设置水平
  */
}
.tabbar ul li {
  /* background-color: red; */
  display: flex;
  flex-direction: column; /* 上下排列 */
  /* flex: 1; 平均分配 */
  justify-content: center;
  align-items: center;
}
.tabbar ul li img {
  width: 0.8267rem;
  height: 0.8267rem;
}
.tabbar ul li span {
  font-size: 0.4267rem;
}

.active {
  color: red;
}
</style>