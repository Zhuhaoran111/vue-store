<template>
  <div class="cart container">
    <header>
      <div @click="returns">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <span>购物车</span>
      <span>编辑</span>
    </header>
    <section>
      <div class="cart-title">
        <van-checkbox v-model="checked"></van-checkbox> <span>商品</span>
      </div>

      <ul>
        <li>
          <div class="radio1">
            <van-checkbox v-model="checked"></van-checkbox>
          </div>

          <h2><img src="../../public/images/like.jpeg" alt="" /></h2>

          <div class="goods">
            <div class="goods_title">
              <span>茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶</span>
              <i class="iconfont icon-lajitong"></i>
            </div>

            <div class="goods_price">￥128.00</div>
            <van-stepper v-model="value" min="1" max="8" />
          </div>
        </li>
        <li>
          <div class="radio1">
            <van-checkbox v-model="checked"></van-checkbox>
          </div>

          <h2><img src="../../public/images/like.jpeg" alt="" /></h2>

          <div class="goods">
            <div class="goods_title">
              <span>茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶</span>
              <i class="iconfont icon-lajitong"></i>
            </div>

            <div class="goods_price">￥128.00</div>
            <van-stepper v-model="value" min="1" max="8" />
          </div>
        </li>
        <li>
          <div class="radio1">
            <van-checkbox v-model="checked"></van-checkbox>
          </div>

          <h2><img src="../../public/images/like.jpeg" alt="" /></h2>

          <div class="goods">
            <div class="goods_title">
              <span>茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶茶叶</span>
              <i class="iconfont icon-lajitong"></i>
            </div>

            <div class="goods_price">￥128.00</div>
            <van-stepper v-model="value" min="1" max="8" />
          </div>
        </li>
      </ul>
    </section>

    <footer>
      <div class="radio">
        <van-checkbox v-model="checked"></van-checkbox>
      </div>
      <div class="total">
        <div>
          共有
          <span class="total-active">1</span>
          件商品
        </div>
        <div>
          <span>总计:</span>
          <span class="total-active">￥128.00+0茶币</span>
        </div>
      </div>
      <div class="order">去结算</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Cart",
  data() {
    return {
      value: 1,
      checked: "true",
    };
  },

  methods: {
    returns() {
      console.log("111");
      // this.$router.push("/my");
    },
  },
};
</script>
<style scoped>
.cart container {
  position: absolute;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center; /*垂直居中 */
  width: 100%;
  height: 1.1733rem;
  background-color: #b0352f;
  color: #fff;
}
header i {
  padding: 0 0.32rem;
  font-size: 0.5333rem;
}
header span {
  padding: 0 0.32rem;
  font-size: 0.5333rem;
}
section {
  background-color: #f5f5f5;
}

footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
  height: 1.3333rem;
  border-top: 0.0533rem;
}
.radio {
  padding: 0.2667rem 0.2667rem;
  margin-top: 7px;
}
.total {
  flex: 1;
  font-size: 0.32rem;
  padding: 0.2667rem;
}
.order {
  padding: 0 0.533333rem;
  color: #fff;
  background-color: #b0352f;
  height: 1.28rem;
  width: 2.1333rem;
  text-align: center;
  font-size: 0.3733rem;
  line-height: 1.28rem;
}
.total-active {
  color: #b0352f;
}
.cart-title {
  display: flex; /* 默认水平 */
  padding: 0.5333rem;
  font-weight: 500;
}
.cart-title span {
  padding: 0 0.4rem;
  font-size: 0.4rem;
  font-weight: 600;
}
ul {
  display: flex;
  flex-direction: column;
}
ul li {
  padding: 0.16rem 0.5333rem;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
ul li img {
  width: 1.9733rem;
  height: 1.9733rem;
  margin-left: 0.4rem;
}
/* .radio1 {
  margin-left: -6px;
} */

.goods {
  padding-left: 15px;
  width: 100%;
  font-size: 0.32rem;
  display: flex;
  flex-direction: column; /* 让goods里面两个盒子垂直排列 */
  align-items: space-around;
}
.goods_title {
  display: flex;
  justify-content: space-around;
}

.goods_title i {
  font-size: 0.5333rem;
}
.goods_price {
  /* padding: 0.08rem 0.2667rem; */
  color: #b0352f;
  font-weight: 500;
}
::v-deep .van-stepper {
  text-align: right;
}
</style>
