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
          v-model="userPwd"
          placeholder="请输入新的密码"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-btn" @click="submitBtn">确认</div>
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
      userPwd: "",
      rules: {
        //手机号验证码
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: "密码不能为空且6~12位",
        },
      },
    };
  },
  methods: {
    submitBtn() {
      console.log("aaa");
      if (!this.validate("userPwd")) return;

      //确认修改---发送请求
      http
        .$axios({
          url: "/api/recovery",
          method: "POST",
          data: {
            phone: this.$route.query.phone,
            pwd: this.userPwd,
          },
        })
        .then((res) => {
          console.log(res);
          Toast("修改成功,请登录");
          //修改登录跳转带d
          if (res.success) {
            this.$router.push({
              path: "/login",
            });
          }
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
  components: {
    Tabbar,
    Header,
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
