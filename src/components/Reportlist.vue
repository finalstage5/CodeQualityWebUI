<template>
  <div title="查看分析报告">
    <el-table
      :data="tableData1"
      border
      ref="multipleTable"
      size="medium"
      style="width: 1040px;margin-bottom: 20px;margin-left: 270px;"
      header-cell-class-name="table-header"
      max-height="800px"
    >

      <el-table-column prop="report_id" label="报告id" width="200" align="center">
      </el-table-column>
      <el-table-column prop="analyzer" label="生成报告的分析器"  width="550" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            style="margin-top: 6px;"
            @click="Look(scope.$index, scope.row)"
          >查看具体报告</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button style="margin-left: 550px;margin-top: 20px;" type="primary" @click="back">返回</el-button>
    <el-button style="margin-left: 300px;margin-top: 20px;" type="warning" @click="loginOut">登出</el-button>
  </div>

</template>

<script>

import Vue, {ref} from "vue";
import fs from "fs";
import Ana1 from "./Ana1"

export default {
  name: 'Reportlist',
  data() {
    return {
      tableData1:[],
    }
  },
  mounted:function() {
    const that=this;
    const config = {
      method: 'get',
      url: '/report/list?ver_id=' + sessionStorage.getItem("ver_id")
        + '&user_id=' + sessionStorage.getItem("user_id")
        + '&token='+ sessionStorage.getItem("token")
    };
    const Info = (res) => {
      console.log(JSON.stringify(res.data));
      if (res.data.resp.status_code === 0) {
        //判断返回的是否成功
        for(let i=0;i<res.data.report_list.length;i++){
          let project = {report_id:Number,time:String,analyzer:String,filetype:String};
          project.time=res.data.report_list[i].time;
          project.filetype=res.data.report_list[i].filetype;
          project.analyzer=res.data.report_list[i].analyzer;
          project.report_id=res.data.report_list[i].report_id;
          that.tableData1.push(project);
        }
        Vue.prototype.$message.success("获取报告信息成功！");
        this.$emit("childFn");

      } else {
        Vue.prototype.$message.error("出错！")
      }
    }
    this.$axios(config)
      .then(res => Info(res))
      .catch(err => {
        Vue.prototype.$message.error("请检查网络状况")
        console.error(err);
        //console.log(err);
      });
  },
  methods: {
    loginOut:function(){
      let username = this.username;
      let password = this.password;
      console.log("username=%s,password=%s", username, password);
      let url='/user/login';
      let url1='/user/logout?user_id='+sessionStorage.getItem('user_id')+'&token='+sessionStorage.getItem('token');

      //定义请求参数
      let params = {
        username: username,
        password: password
      };
      console.log(params);

      const getLoginInfoOk = (res) => {
        if (res.data) {
          console.log(res.data.resp.status_msg);
          if (res.data.resp.status_msg === 'OK') {
            //判断返回的是否正确密码
            sessionStorage.setItem("user_id",res.data.user_id);
            sessionStorage.setItem("token",res.data.token);
            console.log(sessionStorage.getItem('user_id'));

          } else {
            Vue.prototype.$message.error("出现错误！")
          }
        } else {
          Vue.prototype.$message.error("网络错误，请稍后再试")
        }
      }

      //发起ajax请求-Post（注意参数必须保存到params属性中）
      this.$axios.post(url1)
        .then(res => getLoginInfoOk(res))
        .catch(err => {
          Vue.prototype.$message.error("请检查网络状况")
          console.error(err);
          //console.log(err);
        });
      this.$router.push('/Login');
      sessionStorage.clear();
      Vue.prototype.$message.success("已登出")
    },
    back:function (){
      this.$router.push('/Project');
    },
    Look(index, row){
      sessionStorage.removeItem('report_id');
      sessionStorage.setItem('report_id',this.tableData1[index].report_id);
      if(this.tableData1[index].analyzer!=="cpd")
        this.$router.push('/Reportcontent2');
      else
        this.$router.push('/Reportcontent');
    }
  }
}
</script>

<style scoped>

</style>
