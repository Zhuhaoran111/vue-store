<template>
  <div class="my">
    <header>
      <div class="userInfo" v-if="loginStatus">
        <img :src="userInfo.imgUrl" alt="" />
        <!-- 为什么图片动态绑定，这个地址就可以写成/images开头 -->
        <!-- <img src="../../public/images/user.jpeg" alt="" /> -->

        <span>{{ userInfo.nickName }}</span>
      </div>
      <div v-else class="login" @click="goLogin">登录/注册</div>
    </header>
    <section>
      <ul>
        <li @click="gopath">地址管理</li>
        <li v-if="loginStatus" @click="loginOut">退出登录</li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex"; //引入mapState
import Tabbar from "@/components/common/Tabbar.vue";

export default {
  name: "My",

  data() {
    return {
      a: 1,
    };
  },
  components: {
    Tabbar,
  },

  //存放vuex传过来的数据
  computed: {
    //拿状态值，登陆则显示用户信息，没有登陆则显示登录注册
    ...mapState({
      loginStatus: (state) => state.user.loginStatus,
      userInfo: (state) => state.user.userInfo, //这里为什么加user
      //解答：因为使用了vuex中的modules分了模块的，所以state.user是证明是user模块的，q
      //其它模块的就是state.xxx模块
    }),
  },

  methods: {
    //直接调用loginOut
    ...mapMutations(["loginOut"]),

    goLogin() {
      this.$router.push("/login");
    },
    //进入地址管理
    gopath() {
      console.log("aa");
      this.$router.push("/path");
    },
  },
};
</script>

<style scoped>
.my {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.2667rem;
  background-color: #b0352f;
}
section {
  flex: 1;
  overflow: hidden;
}
.login {
  display: flex;
  color: #fff;
  background-color: #f6ab32;
  border-radius: 0.16rem;
  font-size: 0.48rem;
  padding: 0.1333rem 0.2667rem;
}
section ul li {
  padding: 0.4rem;
  font-size: 0.4267rem;
}

.userInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.userInfo img {
  width: 1.76rem;
  height: 1.76rem;
  border-radius: 50%;
}
.userInfo span {
  padding: 0.1067rem 0;
  font-size: 0.4267rem;
  color: #fff;
  text-align: center;
}
</style>
