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
        :span-method="objectSpanMethod"
        border
      >
        <el-table-column label="lines" width="300" align="center" property="lines"></el-table-column>
        <el-table-column label="tokens" width="300" align="center" property="tokens"></el-table-column>
        <el-table-column label="occurrences" align="center" property="occurrences">
          <el-table-column label="line" align="center" width="300" property="line"></el-table-column>
          <el-table-column label="path" align="center" property="path"></el-table-column>
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
  name: 'Reportcontent',
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

        let data = that.result.split('\r\n');
        data.splice(0, 2);//将数组第一位的表格名称去除
        that.tableData=[];
        for (let i = 0; i < data[i].length; i++) {
          data[i]=data[i].split(',');
          for(let j=1;j<data[i][2]*2;j=j+2){
            let obj={};
            obj.id=i;
            obj.lines = data[i][0];
            obj.tokens = data[i][1];
            obj.occurrences = '';
            obj.line =data[i][2+j].toString();
            obj.path = data[i][2+j+1].toString();
            that.tableData.push(obj);
          }
          //data.push(obj);
          //data.splice(0, 1);//将数组第一位的表格名称去除
          //that.tableData=data;
        }
        this.tableData.forEach((item,index) => {
          if( index === 0){
            this.spanArr.push(1);
            this.position = 0;
          }else{
            if(this.tableData[index].id === this.tableData[index-1].id ){
              this.spanArr[this.position] += 1;
              this.spanArr.push(0);
            }else{
              this.spanArr.push(1);
              this.position = index;
            }
          }
        })//

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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row>0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if(columnIndex === 1){
        const _row = this.spanArr[rowIndex];
        const _col = _row>0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
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
