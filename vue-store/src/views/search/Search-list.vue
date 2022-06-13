<template>
  <div class="search-list">
    <div class="headers">
      <Header></Header>
      <ul>
        <li
          v-for="(item, index) in searchList.data"
          :key="index"
          @click="changeTab(index)"
        >
          <!-- 这里通过:class来绑定样式事件,让综合一上来显示红色
          这个默认显示是综合是红色显示，但是当点击索引1销量时，index值hi变成2,要想 currentIndex变就
          要在触发事件让点击的索引值==currentIndex
          -->
          <div :class="searchList.currentIndex == index ? 'activie' : ''">
            {{ item.name }}
          </div>
          <!--这里通过v-if来判断index索引值 ，如果不等与0即综合，就显示该上下标-->
          <div class="search-filter" v-if="index != 0">
            <!-- 下面是判断上箭头和下箭头哪个亮 -->
            <i
              class="iconfont icon-arrow_up_fat"
              :class="item.status == 1 ? 'activie' : ''"
            ></i>

            <i
              class="iconfont icon-arrow_down_fat"
              :class="item.status == 2 ? 'activie' : ''"
            ></i>
          </div>
        </li>
      </ul>
    </div>

    <section>
      <ul v-if="goodsList.length">
        <li v-for="(item, index) in goodsList" :key="index">
          <!--:src换成 v-lazy变成懒加载 -->
          <img v-lazy="item.imgUrl" alt="" />
          <h3>{{ item.name }}</h3>
          <div>
            <div class="price">
              <div>
                <span>￥</span>
                <b>{{ item.price }}</b>
              </div>
              <div>立即购买</div>
            </div>
          </div>
        </li>
      </ul>
      <h4 v-else>暂无数据</h4>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from "@/components/search/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
import http from "@/common/api/request.js";
export default {
  data() {
    return {
      goodsList: [],
      searchList: {
        currentIndex: 0,
        /* 
        这里注意：
        1.status是都没有亮，1是上箭头亮，2是下箭头亮
         */
        data: [
          { name: "综合", key: "zonghe" },
          { name: "价格", status: 0, key: "price" },
          { name: "销量", status: 0, key: "num" },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //切换效果,注意这里的index是当前的切换所在的index值
    changeTab(index) {
      //如果点击了哪个，就把index值赋值给currentIndex
      this.searchList.currentIndex = index;

      //点击的下下标是对应数据的哪一个
      let item = this.searchList.data[index]; //data里面三个对象

      //取消所有的状态值都变成0
      //forEach循环，v是每个对象，i是每个对象的索引值
      this.searchList.data.forEach((v, i) => {
        /* 测试1：d当点击销量时，i的中为1 */
        console.log("循环的索引值" + i);

        console.log("这是索引值" + index);
        //当前遍历的索引值不是当前所切换的,就把它的状态变成0，就是拿自己点击的然后与索引值对比，不相等
        //的就把自己所对应的状态值该为0.即变成没有颜色的按钮
        if (i != index) {
          v.status = 0;
        }
      });

      //当前点击的改变状态
      if (index == this.searchList.currentIndex) {
        //判断上下箭头的值，一上来状态值默认为0，当你点击销量时，判断，这时item.status=1,在点击
        //又会指向下面的三元表达式，这时 item.status下箭头亮起
        item.status = item.status == 1 ? 2 : 1;
      }
      //发送数据请求，进行数据排序操作

      this.getData();
    },

    getData() {
      http
        .$axios({
          url: "/api/goods/shopList",
          params: {
            searchName: this.$route.query.key, //通过路由来接收值，从Header传过来的是key值，接收也是key值
            ...this.orderBy, //这是啥意思，扩展运算符......传送扩展运算符
          },
        })
        .then((res) => {
          console.log(res);
          this.goodsList = res;
        });
    },
  },

  //绑定监听，当路由发生变化时，在调用一次接口
  watch: {
    $route() {
      this.getData();
    },
  },

  //绑定计算属性
  computed: {
    orderBy() {
      //拿到当前的index并把index放到data里面去。拿当前是哪个对象
      //知道是哪个对象
      let obj = this.searchList.data[this.searchList.currentIndex];
      //针对状态判断是升序还是降序
      let val = obj.status == "1" ? "asc" : "desc";
      return {
        //这是返回一个对象。类似于{price:asc/desc}
        [obj.key]: val,
      };
    },
  },

  components: {
    Header,
    Tabbar,
  },
};
</script>

<style scoped>
.search-list {
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

section {
  flex: 1;
  overflow: hidden;
}
.headers ul {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
.headers ul .search-filter {
  display: flex;
  flex-direction: column; /*让里面的盒子垂直排列 */
  align-content: center;
  margin-top: 3px;
}
.search-filter i {
  font-size: 14px;
}

section ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
section ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.2667rem;
  width: 50%;
  box-sizing: border-box; /* 盒子模型 */
}
section ul li img {
  width: 4.5333rem;
  height: 4.5333rem;
}
section ul li h3 {
  color: #222;
  font-weight: 400;
  font-size: 0.3733rem;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
section ul li .price {
  display: flex;
  padding: 10px 13px;
  justify-content: space-around;
  align-items: center; /* 垂直居中 */
  font-size: 14px;
  width: 100%;
}
/* 懒加载样式 */
section ul li img[lazy="loading"] {
  background-color: #f7f7f7;
}
section ul li .price div:last-child {
  color: #fff;
  background-color: #b0523f;
  padding: 0.08rem 0.16rem;
  border-radius: 0.16rem;
}

section ul li .price div:first-child b {
  color: #b0523f;
  font-size: 16px;
}
section ul li .price div:first-child span {
  color: #b0523f;
  font-size: 12px;
}
.activie {
  color: red;
}
</style>>

