<template>
  <div class="detail">
    <!-- 头部区域 -->
    <header>
      <!-- 两个标志区域 -->
      <div class="header-returns" v-show="isShow">
        <div @click="goback">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <i class="iconfont icon-kefu"></i>
      </div>

      <!-- 标志区域 -->
      <div class="hander-bar" v-show="!isShow" :style="styleOption">
        <i class="iconfont icon-fanhui"></i>
        <div>
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <div>
          <i class="iconfont icon-kefu"></i>
        </div>
      </div>
    </header>

    <section ref="wrapper">
      <div>
        <!-- 轮播图 -->
        <div class="swiper-main">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) in swiperList" :key="index">
              <img :src="item.imgUrl" alt="" />
            </swiper-slide>
          </swiper>
          <div class="swiper-pagination"></div>
        </div>

        <!-- 中间的文字区域-->
        <div class="goods_name">
          <h1>{{ goods.name }}</h1>
          <div>性价首选，性价首选，性价首选</div>
        </div>
        <div class="goods_price">
          <div class="oldPrice">
            <span>￥</span>
            <b>{{ goods.price }}</b>
          </div>
          <div class="newPrice">
            <span>价格:</span>
            <del>￥{{ goods.price }}</del>
          </div>
        </div>
        <div>
          <img style="width: 100%; height: 500px" :src="goods.imgUrl" alt="" />
          <img style="width: 100%; height: 500px" :src="goods.imgUrl" alt="" />
        </div>
      </div>
    </section>

    <!-- 底部区域 -->
    <footer>
      <div class="add-cart" @click="addCart">加入购物车</div>
      <div>立即购买</div>
    </footer>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import http from "@/common/api/request.js";
//引入插件
import BetterScroll from "better-scroll";
export default {
  data() {
    return {
      id: 0,
      goods: {},
      styleOption: {},
      BetterScroll: "",
      isShow: true,
      swiperOption: {
        autoplay: 3000,
        speed: 1000,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      },
      swiperList: [
        {
          imgUrl: "./images/goods1.jpg",
        },
        {
          imgUrl: "./images/goods2.jpg",
        },
        {
          imgUrl: "./images/goods3.jpg",
        },
      ],
    };
  },

  created() {
    this.id = this.$route.query.id; //先获取id的值存起来

    console.log(this.$route); //用来接收路由的里面参数的信息
    console.log(this.$route.query.id); //是通过路由的query进行传参的接收
    // console.log(this.$route.params.id); //是通过路由的params进行传参的接收

    this.getData();
  },

  //不走缓存的钩子
  activated() {
    //这个不走缓存,这里接收的id是存储值，this.$route.query.id是动态值
    //先把点击的值存起来3 this.id=3,点击4时,4！=3发起请求，this.id=4
    //点击3,
    //这个只能是判断上一次的请求，隔一轮还是走请求
    if (this.$route.query.id != this.id) {
      this.getData(); //不相等会发送请求
      this.id = this.$route.query.id;
    }
  },

  methods: {
    async getData() {
      //this.$route.query.id知这是点击猜你喜欢页面传过来的id
      let id = this.$route.query.id;
      let res = await http.$axios({
        url: "/api/goods/id",
        //用params传送后端用query接收
        params: {
          id,
        },
      });
      this.goods = res;
      console.log(res);
    },

    goback() {
      this.$router.back(); //返回上一页
    },
    //点击加购物车请求
    addCart() {
      let id = this.$route.query.id;
      http
        .$axios({
          url: "/api/addCart",
          method: "POST",
          data: {
            goodsId: this.id,
          },
          headers: {
            token: true,
          },
        })
        .then((res) => {
          console.log(res);
        });
    },
  },

  mounted() {
    //nextTick等dom都加载完毕才执行这行代码,滑动默认取消click事件
    this.BetterScroll = new BetterScroll(this.$refs.wrapper, {
      /* 取消betterScroll回弹效果 */
      probeType: 3,
      zoom: true,
      click: true,
      bounce: false,
    });

    this.BetterScroll.on("scroll", (pos) => {
      //设置头部弹出来有个渐变透明效果
      let posY = Math.abs(pos.y);
      // console.log(posY);
      let opacity = posY / 180;
      opacity = opacity > 1 ? 1 : opacity;

      this.styleOption = {
        opacity: opacity /* 加个动态样式 */,
      };
      if (posY >= 50) {
        this.isShow = false; //上面不显示，下面显示商品详情和商品简介
      } else {
        this.isShow = true; //上面显示，下面的不显示
      }
    });
  },

  components: {
    swiper,
    swiperSlide,
  },
};
</script>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  flex: 1;
  overflow: hidden;
}
.hander-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  width: 100%;
  height: 1.1733rem;
  font-size: 0.4267rem;
}
.hander-bar span {
  padding: 0 0.2667rem;
}
.hander-bar i {
  font-size: 0.5867rem;
  padding: 0 0.2667rem;
}

header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.1733rem;
  z-index: 999;
}
.header-returns {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 1.1733rem;
  align-items: center;
}
.header-returns i {
  margin: 0 0.2667rem;
  color: #fff;
  width: 0.9067rem;
  height: 0.9067rem;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  text-align: center;
  line-height: 0.9067rem;
}

.swiper-main {
  position: relative;
  width: 100%;
  height: 10rem;
}
.swiper-container {
  width: 100%;
  height: 10rem;
}
.swiper-container img {
  width: 100%;
  height: 10rem;
}

.swiper-pagination {
  width: 100%;
  bottom: 0px;
  text-align: right;
  right: 0.48rem;
  color: #fff;
  font-size: 15px;
}

footer {
  display: flex;
  justify-content: center;
  align-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 1.3067rem;
  width: 100%;
  border-top: 1px solid #cccccc;
  background-color: #fff;
}
footer div {
  width: 50%;
  line-height: 1.3067rem;
  font-size: 16px;
  text-align: center;
  color: #fff;
  background-color: red;
}
.add-cart {
  background-color: #ff9500;
}
.swiper-pagination-fraction {
  left: -0.3467rem;
  bottom: 0.3733rem;
}
.goods_name {
  border-bottom: 1px solid #cccccc;
  padding: 0.2667rem 0.2667rem;
}
.goods_name h1 {
  font-size: 0.5333rem;
  font-weight: 500;
}
.goods_name div {
  padding: 0.08rem;
  font-size: 14px;
  color: #999999;
}
.goods_price {
  padding: 0.2667rem 0.2667rem;
}
.oldPrice {
  color: red;
  font-size: 20px;
}
.newPrice {
  color: #999999;
  font-size: 14px;
}
</style>
