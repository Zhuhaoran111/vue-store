<template>
  <div class="list">
    <header>
      <div class="returns">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="search">
        <i class="iconfont icon-fangdajing"></i>
        <span>搜你喜欢的...</span>
      </div>
      <div class="go-home">
        <img src="@/assets/image/home.png" alt="" />
      </div>
    </header>
    <section>
      <div class="list-l" ref="left">
        <ul class="l-item">
          <li
            v-for="(item, index) in leftData"
            :key="index"
            :class="{ active: index == currentIndex }"
            @click="goScroll(index)"
          >
            <!--   :class="{ active: index == currentIndex }"  绑定class属性 -->
            <!--   @click="goScroll(index)"  这里点击每项把index传过去 -->
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="list-r" ref="right">
        <!--这里不知道滑动哪一个所以需要加一个盒子div里面有多个ul -->
        <!-- 因为ul也是一个整体块，所以只是提供一个遍历的内部对象，这里的item是每个二级对象 -->
        <div>
          <ul v-for="(item, index) in rightData" :key="index">
            <!-- 这里这里的item是每个二级对象结构是id:0,name="推荐"，list数据 
             是
          -->
            <li class="shop-list" v-for="(k, i) in item" :key="i">
              <h2>{{ k.name }}</h2>
              <ul class="r-content">
                <li v-for="(j, indx) in k.list" :key="indx">
                  <img :src="j.imgUrl" alt="" />
                  <span>{{ j.name }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar";
import http from "@/common/api/request.js";
//引入滑动插件
import BetterScroll from "better-scroll";
export default {
  name: "List",
  data() {
    return {
      leftData: [], //左侧数据
      rightData: [], //右侧数据
      rightBsscroll: "", //右侧滑动的数据
      allHeight: [], //承载右侧数据的高度值
      scrollY: "", //右侧滚动距离
    };
  },
  components: {
    Tabbar,
  },
  async created() {
    let res = await http.$axios({
      url: "/api/goods/list",
    });
    let leftArr = []; //这定义一个数组来接收遍历过的一级菜单数据
    let rightArr = [];

    //res进行遍历，v是每个遍历的对象
    res.forEach((v) => {
      //把一级的数据进行push进去
      leftArr.push({
        id: v.id,
        name: v.name,
      });
      //这是二级下面的数据push进去
      rightArr.push(v.data);
    });
    //进行不用菜单的赋值
    this.leftData = leftArr;

    this.rightData = rightArr;

    this.$nextTick(() => {
      //获取dom节点
      //左侧滑动
      new BetterScroll(this.$refs.left, {
        click: true, //betterScroll默认取消点击事件时false,这里要手动改变为true
      });
      //右侧滑动
      this.rightBsscroll = new BetterScroll(this.$refs.right, {
        click: true,
        probeType: 3, //默认为0建议修改成2和3
      });

      //统计右侧板块的高度值，并且放入数组中
      let height = 0;
      this.allHeight.push(height);
      //获取右侧的每一块高度
      let uls = this.$refs.right.getElementsByClassName("shop-list");
      //把dom对象转换成真正的数组,并通过clientHeight来算出每个ul的高度
      Array.from(uls).forEach((v) => {
        height += v.clientHeight;

        this.allHeight.push(height);
      });
      console.log(this.allHeight); //把每个模块的高度及进行累计计算

      //得到右侧滚动的值这里的pos就是滑动数值并且就取y的值是正值
      this.rightBsscroll.on("scroll", (pos) => {
        this.scrollY = Math.abs(pos.y);
        // this.currentIndex;
      });
    });
  },

  methods: {
    goScroll(index) {
      /* rightBsscroll.scrollTo(x,y,秒数) */
      this.rightBsscroll.scrollTo(0, -this.allHeight[index], 300);
    },
  },

  computed: {
    currentIndex() {
      //findIndex(currentValue,index)  当前值和索引值
      return this.allHeight.findIndex((item, index) => {
        console.log(item);
        //0, 257, 514, 771, 1028, 1378

        return this.scrollY >= item && this.scrollY < this.allHeight[index + 1];
        /*  假设scrollY滚动了400的距离
              400>=0&&400<257   F
              400>=257&&400<514 T
        */
      });
    },
  },
};
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.list-l {
  width: 2.48rem;
  background-color: #fff;
  overflow: hidden;
  border-right: 1px solid #cccccc;
}

.list-l .l-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.l-item li {
  width: 100%;
  /* line-height: 1.2rem; */
  text-align: center;
  font-size: 0.4rem;
  margin: 0.5333rem 0;
  padding: 0.08rem 0;
}
.list-r {
  flex: 1;
  overflow: hidden;
}
.shop-list {
  text-align: center; /* 水平居中 */
}
.shop-list h2 {
  padding: 20px 0px; /* padding内边距 */
  font-size: 0.5867rem;
  font-weight: 400;
}
.shop-list .r-content {
  justify-content: space-around;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}
.r-content li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* 上下左右各给一个间距 */
  padding: 0.2667rem 0;
  width: 33.3%;
}
.r-content li img {
  width: 1.4133rem;
  height: 1.4133rem;
}
.r-content li span {
  font-size: 16px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background-color: #b0352f;
}
.returns {
  line-height: 1.73333rem;
  padding: 0 20px;
}
.returns i {
  color: #fff;
  font-size: 0.6133rem;
}
.search {
  flex: 1;
  padding: 0.0533rem 0.2667rem;
  background-color: #ffffff;
  border-radius: 24px;
  display: flex;
  align-items: center;
}
.search i {
  padding-right: 0.16rem;
  color: #666;
  font-size: 0.48rem;
}
.search span {
  color: #666;
  font-size: 0.4533rem;
}
.go-home {
  padding: 0 0.2667rem;
  line-height: 0.48rem;
  width: 0.48rem;
  height: 0.48rem;
  margin-top: -28px;
  margin-right: 20px;
}
.active {
  color: #b54f4a;
  border-left: 6px solid #b54f4a;
}

/* 设置其它盒子的样式穿透 */
::v-deep .tabbar {
  border-top: 1px solid #cccccc;
}
</style>
