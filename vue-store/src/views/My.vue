<template>
  <div class="my">
    <header>
      <div class="login" @click="goLogin">登录/注册</div>
    </header>
    <section>
      <ul>
        <li>地址管理</li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import Tabbar from "@/components/common/Tabbar.vue";

export default {
  name: "My",
  list: "",
  data() {
    return {
      a: 1,
    };
  },
  components: {
    Tabbar,
  },
  // computed: {
  //   ...mapState({
  //     list: (state) => state.user.list,
  //   }),
  // },

  methods: {
    goLogin() {
      this.$router.push("/login");
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
</style>
