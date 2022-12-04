<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <el-descriptions title="报告详细内容" :column="2" size="medium" :border='true'>
        <el-descriptions-item>
          <template slot="label">
            分析方法
          </template>
          {{ analyzer }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            报告生成日期与时间
          </template>
          {{ time }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            版本id
          </template>
          {{ version_id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文件类型
          </template>
          {{ filetype }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table
        :data="tableData"
        style="margin-top: 20px;"
        border
      >
        <el-table-column v-for="item in tableHead" align="center" :label="item.label" :property="item.property">
        </el-table-column>

      </el-table>

      <el-button style="margin-left: 570px;margin-top: 20px;" type="primary" @click="back">返回</el-button>
      <el-button style="margin-left: 300px;margin-top: 20px;" type="warning" @click="loginOut">登出</el-button>
    </el-card>
  </div>
</template>

<script>

import Vue, {ref} from "vue";
import fs from "fs";

export default {
  name: 'Reportcontent2',
  data() {
    return {
      result:'',
      version_id:'',
      filetype:'',
      analyzer:'',
      time:'',
      tableData: [],
      tableHead: [],
      spanArr: [],
    }
  },
  mounted:function() {
    const that=this;
    const config = {
      method: 'get',
      url: '/report/get?user_id=' + sessionStorage.getItem("user_id")
        + '&token='+ sessionStorage.getItem("token")
        + '&report_id=' + sessionStorage.getItem('report_id'),

    };
    const Info = (res) => {
      console.log(JSON.stringify(res.data));
      if (res.data.resp.status_code === 0) {
        console.log(res.data.report);
        that.version_id = res.data.report.version_id;
        that.filetype = res.data.report.filetype;
        that.analyzer = res.data.report.analyzer;
        that.time = res.data.report.time;
        that.result = res.data.report.result;
        that.tableHead=[
          {label:"Problem", property:"Problem"},
          {label:"Package", property:"Package"},
          {label:"File", property:"File"},
          {label:"Priority", property:"Priority"},
          {label:"Line", property:"Line"},
          {label:"Description", property:"Description"},
          {label:"Rule_set", property:"Rule_set"},
          {label:"Rule", property:"Rule"}
        ];
        let data = that.result.split('\r\n');
        data.splice(0, 1);//将数组第一位的表格名称去除
        that.tableData=[];
        for (let i = 0; i < data[i].length; i++) {
          data[i]=data[i].split(',');
          let obj={};
          console.log(data[i]);
          obj.Problem = data[i][0].substring(1,data[i][0].length-1);
          obj.Package = data[i][1].substring(1,data[i][1].length-1);
          obj.File = data[i][2].substring(1,data[i][2].length-1);
          obj.Priority = data[i][3].substring(1,data[i][3].length-1);
          obj.Line = data[i][4].substring(1,data[i][4].length-1);
          obj.Description = data[i][5].substring(1,data[i][5].length-1);
          obj.Rule_set = data[i][6].substring(1,data[i][6].length-1);
          obj.Rule = data[i][7].substring(1,data[i][7].length-1);
          that.tableData.push(obj);
          //data.push(obj);
          //data.splice(0, 1);//将数组第一位的表格名称去除
          //that.tableData=data;
        }

        Vue.prototype.$message.success("获取报告内容成功！");
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
      this.$router.push('/Reportlist');
    },
  }
}
</script>

<style scoped>

</style>
