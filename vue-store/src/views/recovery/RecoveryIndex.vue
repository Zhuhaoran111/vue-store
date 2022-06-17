<template>
  <div class="login">
    <Header>
      <!-- 如果自己有的就用自己的 -->
      <span>找回密码</span>
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
      <div class="login-btn" @click="next">下一步</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "../login/Header.vue";
import { Toast } from "mint-ui";
import http from "@/common/api/request.js";
import RecoveryBtnVue from "./RecoveryBtn.vue";

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
    //找回密码点击下一步
    next() {
      //如果获取的验证码与自己填写验证码不一样
      console.log(this.code == this.userCode);
      console.log(typeof this.code); //number类型---后台返回
      console.log(typeof this.userCode); //string类型---自己输入
      this.userCode = parseInt(this.userCode); //强制把自己输入的转换为数字类型
      console.log(typeof this.userCode); //强制转换成了number类型

      if (this.code !== this.userCode) {
        Toast("验证码输入不正确");
        return;
      }

      //告诉后端，用户输入的手机号，存在吗
      http
        .$axios({
          url: "/api/selectUser",
          method: "POST",
          data: {
            phone: this.userTel,
          },
        })
        .then((res) => {
          //失败返回信息
          if (!res.success) {
            Toast(res.msg);
            return; //如果数据库中没有手机号则退出这个条件
          }
          //成功则跳转
          this.$router.push({
            name: "btn", //跳转到RecoveryBtn界面修改密码界面
            query: {
              phone: this.userTel, //把电话号码传到找回密码里面的组件里面
            },
          });
        });
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
            console.log(this.code);
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
</style>
