<template>
  <div class="path-index container">
    <Header></Header>
    <section>
      <ul v-if="list.length">
        <li @click="goList(item)" v-for="(item, index) in list" :key="index">
          <div>
            <span>{{ item.name }}</span>
            <span>{{ item.tel }}</span>
          </div>
          <div class="city">
            <span class="active" v-if="item.isDefault == 1">[默认]</span>
            <span>{{ item.province }}</span>
            <span>{{ item.city }}</span>
            <span>{{ item.county }}</span>
            <span>{{ item.addressDetail }}</span>
          </div>
        </li>
      </ul>
      <h1 v-else>暂无地址，请添加地址</h1>
      <div class="add-path" @click="goList('add')">添加地址</div>
    </section>

    <Tabbar></Tabbar>
  </div>
</template>

<script>
import http from "@/common/api/request.js";
import Header from "../../components/path/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
import { mapState, mapMutations } from "vuex";
import bus from "@/common/bus.js";
export default {
  data() {
    return {
      pathStatus: false,
    };
  },
  components: {
    Header,
    Tabbar,
  },
  computed: {
    ...mapState({
      list: (state) => state.path.list,
    }),
  },
  created() {
    //从订单页面进来的
    console.log("这里面走了吗");
    if (this.$route.query.type == "select") {
      this.pathStatus = true;
    }
    this.getData();
  },
  methods: {
    ...mapMutations(["init_data"]),
    getData() {
      http
        .$axios({
          url: "/api/selectAddress",
          method: "post",
          headers: {
            token: true,
          },
        })
        .then((res) => {
          this.init_data(res.data);
          //这是把个人地址信息传到vuex中state中去管理
          console.log(res);
        });
    },

    //添加地址和编辑地址都走这个逻辑
    goList(option) {
      //如果this.pathStatus为true代表从订单页面过来的
      if (this.pathStatus) {
        //利用中间件传值bus
        bus.$emit("selectPath", JSON.stringify(option));
        this.$router.back();
        return;
      }
      this.$router.push({
        name: "path-list",
        params: {
          key: JSON.stringify(option), //JSON.stringify转字符串
        },
      });
    },
  },
};
</script>

<style scoped>
::v-deep .tabbar {
  border-top: 2px solid #ccc;
}
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
}
section ul {
  width: 100%;
}
ul li {
  padding: 0.266666rem 0.4rem;
  margin: 0.16rem 0;
  background-color: #ffffff;
}
ul li span {
  padding-right: 0.4rem;
  font-size: 0.426666rem;
}
ul li .active {
  color: #b0352f;
}

.add-path {
  margin-top: 0.8rem;
  width: 3.2rem;
  line-height: 1.066666rem;
  font-size: 0.48rem;
  text-align: center;
  color: #ffffff;
  background-color: #b0352f;
  border-radius: 6px;
}
.city span {
  padding-right: 0.16rem;
}
</style>
