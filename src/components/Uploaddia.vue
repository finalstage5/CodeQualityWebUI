<template>
  <el-dialog
    title="创建项目"
    :visible.sync="dialogVisible"
    width="30%"
    top="15%"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-input placeholder="项目名称" v-model="name" :disabled="false"></el-input>

    <el-button v-wave class="jar" type="primary" @click="okk" style="margin-top: 40px;margin-left: 160px">确定</el-button>

  </el-dialog>

</template>

<script>

import Vue, {ref} from "vue";
import fs from "fs";

export default {
  name: 'Uploaddia',
  props: {
    dialogVisible:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      userid:'',
      name:'',
      token:''
    }
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    okk:function (){
      if(this.name===''){
        alert("项目名称不能为空！");
        return false;
      }
      console.log("username=%s,password=%s", this.userid, this.name);
      this.userid = parseInt(sessionStorage.getItem("user_id"));
      this.token = sessionStorage.getItem("token");
      let url='/project/create';
      let url1='/project/create?user_id='+this.userid+'&token='+this.token+'&name='+this.name+'';
      const config = {
        method: 'post',
        url: '/project/create?user_id=' + this.userid + '&token='
          + this.token + '&name='
          + this.name
      };
      //定义请求参数
      let params = {
        userid: this.userid,
        token: this.token,
        name: this.name
      };
      console.log(params);

      const CreateOk = (res) => {
        if (res.data) {
          console.log(res.data.resp);
          if (res.data.resp.status_code === 0) {
            //判断返回的是否成功
            Vue.prototype.$message.success("创建成功！");
            location.reload();
            this.$emit("childFn1");

          } else {
            Vue.prototype.$message.error("内容出错！")
          }
        } else {
          Vue.prototype.$message.error("网络错误，请稍后再试")
        }
      }

      //发起ajax请求-Post（注意参数必须保存到params属性中）
      this.$axios(config)
        .then(res => CreateOk(res))
        .catch(err => {
          Vue.prototype.$message.error("请检查网络状况")
          console.error(err);
          //console.log(err);
        });
    },
    handleClose() {
      this.$emit("childFn");
      //这个ChildFn就是自定义方法，如果要传递数据可以这样写
      //this.$emit("childFn",'传递的数据');
      //然后在父组件方法中就可以拿到了
      //receive(value){
      //console.log(value) 这个value就是传递的值
      //},
    }
  }
}
</script>

<style scoped>

</style>
