<template>
  <div class="login">
    <Header>
      <!-- 如果自己有的就用自己的 -->
      <div></div>
      <span>登录</span>
    </Header>
    <section>
      <div class="login-tel">
        <input
          type="text"
          v-model="userTel"
          placeholder="请输入手机号"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-tel">
        <input type="text" v-model="userPwd" placeholder="请输入密码" />
      </div>
      <div class="login-btn" @click="login">登录</div>
      <div class="tab">
        <span @click="goLogin">短信登录</span>
        <span @click="goRecovery">找回密码</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "./Header.vue";
import { Toast } from "mint-ui";
import http from "@/common/api/request.js";
import { mapMutations } from "vuex"; //在需要传送的给别人的文件中引入A传给B就是给A引入

export default {
  data() {
    return {
      //用户的输入的手机号和密码
      userTel: "",
      userPwd: "",

      //验证规则
      rules: {
        //手机号验证码
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: "手机号不能为空,并且是11位数字",
        },
        //密码验证规则
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: "密码不能为空且要求6,12为位",
        },
      },
    };
  },
  components: {
    Tabbar,
    Header,
  },
  methods: {
    //通过扩展运算符把user.js中mutations中的方法暴露在这里，这里可以调这个方法把参数传过去
    ...mapMutations(["user_login"]),

    //跳转到找回密码界面
    goRecovery() {
      this.$router.push("/recovery");
    },

    //跳转到注册界面
    goRegister() {
      this.$router.push("/register");
    },

    //跳转到登录界面
    goLogin() {
      this.$router.push("/login");
    },

    login() {
      //前端验证,不满条件则return出去
      if (!this.validate("userTel")) return;
      if (!this.validate("userPwd")) return;
      //发送请求，后端验证

      http
        .$axios({
          url: "/api/login",
          method: "POST",
          //post最好携带请求体参数data{}
          data: {
            userTel: this.userTel,
            userPwd: this.userPwd,
          },
        })
        .then((res) => {
          Toast(res.msg);
          //登陆失败
          if (!res.success) return;
          //登陆成功，跳转页面
          console.log(res.data);

          //登录的信息和参数传过去存放到vuex中的mutatios中
          this.user_login(res.data);

          //点击登陆跳转到我的页面
          this.$router.push("/my");
        });
    },

    validate(key) {
      //这里的key是userTel
      let bool = true;
      /* this.rules[key]这是正则，(this[key])这是用户输入的 */
      if (!this.rules[key].rule.test(this[key])) {
        //提示信息
        Toast(this.rules[key].msg);
        bool = false;
        return false;
      }
      return bool;
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.32rem;
  background-color: #f5f5f5;
}
section div {
  margin: 0.2667rem 0;
  width: 8.9333rem;
  height: 1.1733rem;
}
.login-tel input {
  width: 100%;
  border: 1px solid #ccc;
  padding: 0 0.2667rem;
  box-sizing: border-box; /* 盒子模型 */
  border-radius: 0.16rem;
}
section input {
  background-color: #fff;
  line-height: 1.1733rem;
}
.login-tel {
  margin-top: 0.5333rem;
}

.login-code {
  display: flex;
}
.login-code input {
  flex: 1;
  border: 1px solid #ccc;
  padding: 0 0.2667rem;
  box-sizing: border-box; /* 盒子模型 */
  border-radius: 0.16rem;
}
.login-code button {
  padding: 0 0.5333rem;
  line-height: 1.0667rem;
  background-color: #b0352f;
  border: 0;
  color: #fff;
  border-radius: 0.16rem;
}
.login-btn {
  background-color: #b0352f;
  text-align: center;
  color: #fff;
  line-height: 1.1733rem;
  border-radius: 0.16rem;
}
.tab {
  display: flex;
  justify-content: space-between;
  font-size: 0.3733rem;
  font-weight: 500;
}
</style>
