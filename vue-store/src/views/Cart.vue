<template>
  <div class="cart container">
    <header>
      <div>
        <i class="iconfont icon-fanhui" @click="gobackhome"></i>
      </div>
      <span>购物车</span>
      <span @click="isNavBar" v-text="isNavStatus ? '完成' : '编辑'"></span>
    </header>
    <section v-if="list.length">
      <div class="cart-title">
        <!-- 下面这是全选按钮 -->
        <van-checkbox @click="checkAllFn" :value="isCheckAll"></van-checkbox>
        <span>商品</span>
      </div>

      <ul>
        <li v-for="(item, index) in list" :key="index">
          <div class="radio1">
            <van-checkbox
              @click="check_item(index)"
              v-model="item.checked"
            ></van-checkbox>
            <!-- 这里的item.checked是中间内容部分的按钮 -->
          </div>

          <h2><img :src="item.goods_imgUrl" alt="" /></h2>

          <div class="goods">
            <div class="goods_title">
              <span>{{ item.goods_name }}</span>
              <i
                class="iconfont icon-lajitong"
                @click="delGoodsFn(item.id)"
              ></i>
            </div>

            <div class="goods_price">￥{{ item.goods_price }}</div>
            <van-stepper
              @change="changeNum($event, item)"
              v-model="item.goods_num"
              integer
            />
          </div>
        </li>
      </ul>
    </section>

    <section v-else>
      没有购物车数据
      <router-link to="/home">去首页逛逛吧</router-link>
    </section>

    <footer>
      <div class="radio">
        <van-checkbox @click="checkAllFn" :value="isCheckAll"></van-checkbox>
      </div>
      <div class="total" v-show="!isNavStatus">
        <div>
          共有
          <span class="total-active">{{ total.price }}</span>
          件商品
        </div>
        <div>
          <span>总计:</span>
          <span class="total-active">￥{{ total.price.toFixed(2) }}+0茶币</span>
        </div>
      </div>
      <!-- 这里给每个删除添加id,然后传值给cart.js -->
      <div class="order" v-if="isNavStatus" @click="delGoodsFn">删除</div>
      <div class="order" v-else @click="goOrder">去结算</div>
    </footer>
  </div>
</template>

<script>
import http from "@/common/api/request.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { Toast } from "mint-ui";

export default {
  name: "Cart",
  data() {
    return {
      // value: 1,
      isNavStatus: false,
      checked: true,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState({
      list: (state) => state.cart.list,
      selectList: (state) => state.cart.selectList,
    }),
    ...mapGetters(["isCheckAll", "total"]),

    goodsList() {
      return this.selectList.map((id) => {
        return this.list.find((v) => v.id == id);
      });
    },
  },

  methods: {
    ...mapMutations(["cart_list", "check_item", "init_order"]),
    ...mapActions(["checkAllFn", "delGoodsFn"]),
    async getData() {
      let res = await http.$axios({
        url: "/api/selectCart",
        method: "POST",
        headers: {
          token: true,
        },
      });
      console.log(res);

      //遍历给每个按钮加上checked来标志阿
      res.data.forEach((v) => {
        v["checked"] = true;
      });
      // console.log(res.data);

      //这里打印数据
      //这里调用方法这个方法是vuex中的
      this.cart_list(res.data);
    },

    //点击编辑完成
    isNavBar() {
      this.isNavStatus = !this.isNavStatus;
    },
    gobackhome() {
      this.$router.push("/my");
    },

    //修改数量，当前购物车的id以及修改后的数量传递给后端
    //这个value就是修改后的数量，item.id是购物车商品的id
    changeNum(value, item) {
      console.log(value, item.id);
      http
        .$axios({
          url: "/api/updateNum",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            id: item.id,
            num: value,
          },
        })
        .then((res) => {
          console.log(res);
        });
    },
    //点击结算取结算页
    goOrder() {
      if (!this.selectList.length) {
        Toast("请选择商品");
        return;
      }

      //就是把购物车选择的和自己打勾选择的作对比，id相同
      let newList = [];
      this.list.forEach((item) => {
        this.selectList.filter((v) => {
          if (v == item.id) {
            newList.push(item);
          }
        });
      });

      /* 生成一个订单 */
      http
        .$axios({
          url: "/api/addOrder",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            arr: newList,
          },
        })
        .then((res) => {
          if (!res.success) return;

          //存储订单
          this.init_order(res.data);
          console.log(res);

          //提交进入订单的页面
          this.$router.push({
            path: "/order",
            query: {
              //selectList存的是id号码
              detail: JSON.stringify(this.selectList),
              goodsList: JSON.stringify(this.goodsList),
            },
          });
        });
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
