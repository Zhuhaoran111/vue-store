<template>
  <header>
    <!-- 左中右三部分 -->
    <div class="search-return" @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="search-main">
      <i class="iconfont icon-fangdajing"></i>
      <form action="" onsubmit="return false" @keyup.enter="goSearchList">
        <!-- v-model绑定一个值，能拿到用户输入的值 -->
        <input type="text" placeholder="搜索你喜欢的产品" v-model="searchVal" />
      </form>
    </div>
    <div class="search-btn" @click="goSearchList">搜索</div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      searchVal: this.$route.query.key,
      searchArr: "",
    };
  },

  created() {
    if (!this.$route.query) {
    }
  },

  methods: {
    //返回首页
    goBack() {
      this.$router.back();
    },
    goSearchList() {
      //如果搜索的关键字空白直接返回就return
      if (!this.searchVal) return;

      //判断之前有没有本地存储获取指定searchList本地存储的值
      if (!localStorage.getItem("searchList")) {
        //没有存个标识key,value的形式获取指定value 存储到key 字段
        localStorage.setItem("searchList", "[]");
      } else {
        //之前搜索过把本地存储过的值赋值给数组
        this.searchArr = JSON.parse(localStorage.getItem("searchList"));
        // console.log(this.searchArr + "赋值给数组");
      }

      //增加数组----通过unshift追加数据
      this.searchArr.unshift(this.searchVal);

      //ES6去重
      let newArr = new Set(this.searchArr); //这是对象要转换为数组

      //给本地存储赋值JSON.stringify格式    对象转换成数组Array.from(newArr)
      localStorage.setItem("searchList", JSON.stringify(Array.from(newArr)));

      // console.log(this.searchVal);
      // console.log(this.searchArr);

      /* 路径如果没有变化不跳转页面 */
      if (this.searchVal === this.$route.query.key) {
        return false;
      }

      //跳转页面
      this.$router.push({
        name: "list",
        //通过路由传参
        query: {
          key: this.searchVal,
        },
      });
    },
  },
};
</script>

<style>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 1.1733rem;
  background-color: red;
  color: #fff;
}
.search-return {
  padding: 0 0.2667rem;
}

.search-return i {
  font-size: 0.5867rem;
}

.search-btn {
  font-size: 0.4267rem;
}

.search-main {
  width: 6.6533rem;
  height: 0.8rem;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20px;
  margin-right: 12px;
}
.search-main i {
  padding: 0 0.2667rem;
  color: #666666;
}

.search-main form {
  width: 100%;
  display: flex;
  /* 设置水平居中和垂直居中 */
  justify-content: center;
  align-items: center;
}
.search-main form input {
  width: 100%;
}
</style>