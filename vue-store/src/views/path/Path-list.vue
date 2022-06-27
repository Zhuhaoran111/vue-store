<template>
  <div class="path-index container">
    <Header>
      <span v-if="pathStatus">添加地址</span>
      <span v-else>编辑地址</span>
    </Header>
    <section>
      <!-- //这个是添加地址 -->
      <van-address-edit
        v-if="pathStatus"
        :area-list="areaList"
        show-set-default
        @save="onAdd"
      />

      <!--这是编辑地址 -->
      <van-address-edit
        v-else
        :area-list="areaList"
        :address-info="AddressInfo"
        show-delete
        show-set-default
        show-search-result
        @save="onUpdate"
        @delete="onDelete"
      />
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import { Toast } from "vant";
import http from "@/common/api/request.js";
import Header from "../../components/path/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
export default {
  data() {
    return {
      pathStatus: false,
      AddressInfo: {},
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市",
        },
        city_list: {
          110100: "北京市",
          120100: "天津市",
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
          120101: "塘沽区",
        },
      },
    };
  },
  created() {
    console.log(this.$route.params.key);
    let key = JSON.parse(this.$route.params.key);
    if (key == "add") {
      //走的是添加地址的逻辑
      this.pathStatus = true; //把这个设置为true说明时点击的是添加，所以进去显示的添加地址
    } else {
      //这里走的编辑地址的逻辑
      this.AddressInfo = key;
      this.AddressInfo.isDefault = this.AddressInfo.isDefault == true ? 1 : 0;
    }
  },
  components: {
    Header,
    Tabbar,
  },
  methods: {
    goList() {
      this.$router.push({
        name: "path-list",
      });
    },

    //点击保存触发 ==> 增加
    onAdd(content) {
      console.log("aaa");
      content.isDefault = content.isDefault == true ? 1 : 0;
      http
        .$axios({
          url: "/api/addAddress",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            ...content,
          },
        })
        .then((res) => {
          console.log(res);
          if (!res.success) return;
          Toast(res.msg);
          this.$router.push("/path");
        });
    },

    //点击保存触发修改
    onUpdate(content) {
      console.log(content);
      content.isDefault = content.isDefault == true ? 1 : 0;
      http
        .$axios({
          url: "/api/updateAddress",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            ...content,
          },
        })
        .then((res) => {
          if (!res.success) return;
          Toast("修改成功");
          this.$router.push("/path");
        });
    },
    //触发删除
    onDelete(content) {
      http
        .$axios({
          url: "/api/deleteAddress",
          method: "post",
          headers: {
            token: true,
          },
          data: {
            id: content.id,
          },
        })
        .then((res) => {
          if (res.msg);
          this.$router.push("/path");
        });
      Toast("delete");
    },
  },
};
</script>

<style scoped>
section {
  background-color: #f7f7f7;
}
section .van-address-edit {
  padding: 0;
}
::v-deep .tabbar {
  border-top: 2px solid #ccc;
}

::v-deep .van-address-edit__buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
::v-deep .van-button--danger {
  width: 8rem;
  height: 1.066666rem;
  background-color: #b0352f;
}
::v-deep .van-button--default {
  width: 8rem;
  height: 1.066666rem;
}
</style>
