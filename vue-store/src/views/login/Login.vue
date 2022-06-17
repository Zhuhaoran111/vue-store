<template>
  <div class="login">
    <Header>
      <!-- 如果自己有的就用自己的 -->
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
      <div class="login-code">
        <input
          type="text"
          v-model="userCode"
          placeholder="请输入手机验证码"
          pattern="[0-9]*"
        />
        <button :disabled="disabled" @click="sendCode">{{ codeMsg }}</button>
      </div>
      <div class="login-btn" @click="login">登录</div>
      <div class="tab">
        <span @click="goUserLogin">密码登录</span>
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

export default {
  data() {
    return {
      userTel: "",
      disabled: false, //默认为false，按钮能点击，但是点击后60秒内设置为true不能点击
      userCode: "", //存放用户输入的验证码
      codeNum: 6,
      code: "", //存放后台返回来的短信验证码
      codeMsg: "获取短信验证码",
      rules: {
        //手机号验证码
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: "手机号不能为空,并且是11位数字",
        },
      },
    };
  },
  components: {
    Tabbar,
    Header,
  },

  methods: {
    //登录
    login() {
      console.log(this.code == this.userCode);
      console.log(this.code); //前台没传过来验证码
      console.log(this.userCode);
      if (this.code == this.userCode) {
        //证明用户输入的短信验证码是正确的
        //发送请求
        http
          .$axios({
            url: "/api/addUser",
            method: "POST",
            data: {
              phone: this.userTel,
            },
          })
          .then((res) => {
            if (!res.success) return;
            console.log(res);
          });
      }
    },

    //跳转到密码登陆页面
    goUserLogin() {
      this.$router.push("/userLogin");
    },

    //跳转到注册界面
    goRegister() {
      this.$router.push("/register");
    },

    //获取短信验证码
    sendCode() {
      console.log("aaa");
      //验证手机号码
      if (!this.validate("userTel")) return;

      //请求短信验证码接口
      http
        .$axios({
          url: "/api/code",
          method: "POST",
          data: {
            phone: this.userTel,
          },
        })
        .then((res) => {
          if (res.success) {
            this.code = res.data;
            console.log(res.data);
          }
        });

      //禁用按钮
      this.disabled = true;
      //倒计时从6倒计时
      let timer = setInterval(() => {
        --this.codeNum;
        this.codeMsg = `重新发送${this.codeNum}`;
      }, 1000);

      //判断什么时候停止
      setTimeout(() => {
        clearInterval(timer);
        this.codeNum = 6;
        this.disabled = false;
        this.codeMsg = "获取短信验证码";
      }, 6000); //点击后的6秒来停止这个倒计时setInterval，并把值赋值为原来的值
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
