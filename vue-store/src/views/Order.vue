<template>
  <div class="order container">
    <header>
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <slot>
        <span>我的订单</span>
      </slot>
      <i class="iconfont icon-kefu"></i>
    </header>
    <section>
      <div class="path">
        <h3 class="path-title">收货信息</h3>
        <div class="path-content" @click="goPath">
          <div>
            <span>{{ path.name }}</span>
            <span>{{ path.tel }}</span>
          </div>
          <div>
            <span>{{ path.province }}</span>
            <span>{{ path.city }}</span>
            <span>{{ path.county }}</span>
            <span>{{ path.addressDetail }}</span>
          </div>
        </div>
      </div>
      <!-- 支付方式 -->
      <div class="payment">
        <div class="payment-title">支付方式</div>
        <van-radio-group v-model="radioPayment">
          <van-radio name="wx">微信支付</van-radio>
          <van-radio name="ali">支付宝支付</van-radio>
        </van-radio-group>
      </div>

      <!-- 商品 -->
      <div class="goods">
        <ul>
          <li v-for="(item, index) in goodsList" :key="index">
            <div>
              <img :src="item.goods_imgUrl" alt="" />
            </div>
            <div class="goods-content">
              <h4>{{ item.goods_name }}</h4>
              <div class="goods-total">
                <span>￥{{ item.goods_price }}</span>
                <span>×{{ item.goods_num }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <div class="order-total">
        <span>共</span>
        <b>{{ total.num }}</b>
        <span>件</span>
        <span>总金额</span>
        <em>￥{{ total.price }}</em>
      </div>
      <div class="order-topay" @click="goPayment">提交订单</div>
    </footer>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import http from "@/common/api/request.js";
import { Toast } from "vant";
import bus from "@/common/bus.js";
import qs from "qs";

export default {
  data() {
    return {
      radioPayment: "wx",
      path: {},
      item: [],
      total: {
        price: 0,
        num: 0,
      },
    };
  },

  activated() {
    //这是在地址页面获取点击的地址信息
    bus.$on("selectPath", (data) => {
      this.path = JSON.parse(data);
      console.log(this.path, "xxxx");
    });
    //这是获取选中的商品的id
    this.item = JSON.parse(this.$route.query.detail);
    //这是获取商品的列表
    this.goodsList = JSON.parse(this.$route.query.goodsList);
    this.selectOrder();
  },

  created() {
    this.goodsList = JSON.parse(this.$route.query.goodsList);
    console.log("aaaaaaaaaaa");
    this.selectAddress();
  },
  computed: {
    ...mapState({
      order_id: (state) => state.order.order_id,
      selectList: (state) => state.cart.selectList,
    }),
    ...mapGetters(["defaultPath"]),
  },
  methods: {
    //查询订单
    selectOrder() {
      //查询订单
      http
        .$axios({
          url: "/api/selectOrder",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            orderId: this.order_id,
          },
        })
        .then((res) => {
          //存储订单
          this.init_order(res.data);
          this.total.price = res.data[0].goods_price;
          this.total.num = res.data[0].goods_num;
          console.log(res);
        });
    },

    //查询地址
    selectAddress() {
      //查询到地址了
      http
        .$axios({
          url: "/api/selectAddress",
          method: "post",
          headers: {
            token: true,
          },
        })
        .then((res) => {
          this.init_data(res.data);
          //有默认收货地址
          if (this.defaultPath.length) {
            this.path = this.defaultPath[0];
          } else {
            this.path = res.data[0];
          }
        });
    },

    ...mapMutations(["init_data", "init_order"]),

    //选择收货地址
    goPath() {
      this.$router.push({
        path: "/path",
        query: {
          type: "select",
        },
      });
    },

    //提交订单
    goPayment() {
      //如果地址没有填写则提示选择地址
      if (!this.path) return Toast("请选择地址");

      //发送请求=>1.修改订单状态  2.删除购物车数据
      http
        .$axios({
          url: "/api/submitOrder",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            orderId: this.order_id,
            shopArr: this.selectList,
          },
        })
        .then((res) => {
          let newArr = [];
          this.goodsList.forEach((v) => {
            newArr.push(v.goods_name);
          });
          //支付宝传递的参数
          let dataOrder = {
            orderId: this.order_id,
            name: newArr.join(""),
            price: this.total.price,
          };

          if (res.success) {
            //提价订单成功去支付
            http
              .$axios({
                url: "/api/payment",
                method: "post",
                headers: {
                  token: true,
                  "Content-type": "application/x-www-form-urlencoded",
                },
                data: qs.stringify(dataOrder), //序列化，qs为了是增加安全性
              })
              .then((res) => {
                if (res.success) {
                  //打开支付宝支付
                  window.location.href = res.paymentUrl;
                }
              });
          }
        });
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.173333rem;
  color: #fff;
  background-color: #b0352f;
}

i {
  padding: 0 0.4rem;
  font-size: 0.586666rem;
}
section {
  background-color: #f7f7f7;
  height: 580px;
}
span {
  font-weight: 300;
  font-size: 0.48rem;
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 1.2rem;
  border-top: 1px solid #ccc;
}
.order-topay {
  width: 3.2rem;
  line-height: 1.2rem;
  color: #fff;
  font-size: 0.426666rem;
  text-align: center;
  background-color: #b0352f;
}
footer .order-total {
  font-size: 0.426666rem;
}
.order-total span {
  padding: 0 0.16rem;
}
.order-totalb {
  color: #b0352f;
}
.order-total em {
  font-size: 0.48rem;
  color: #b0352f;
}

.path-title {
  padding: 0.4rem;
  font-size: 0.48rem;
}
.path-content {
  padding: 0.16rem 0.4rem;
  font-size: 0.373333rem;
  background-color: #ffffff;
}
.path-content span {
  padding-right: 0.16rem;
}

.path-title {
  padding: 0.4rem;
  font-size: 0.48rem;
}

.payment {
  padding: 0.16rem 0.4rem;
  margin-top: 0.4rem;
  font-size: 0.426666rem;
  background-color: #ffffff;
}
.payment .van-radio-group {
  display: flex;
  padding: 0.16rem 0;
}
.payment .van-radio-group .van-radio {
  padding-right: 0.266666rem;
}
.goods {
  padding: 0.16rem 0.4rem;
  margin-top: 0.4rem;
  font-size: 0.426666rem;
  background-color: #ffffff;
}
.goods ul {
  width: 100%;
}
.goods ul li {
  display: flex;
  width: 100%;
}
.goods ul li img {
  width: 1.973333rem;
  height: 1.973333rem;
}

.goods ul li .goods-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 0.4rem;
}
.goods-content .goods-total {
  display: flex;
  justify-content: space-between;
}
</style>
