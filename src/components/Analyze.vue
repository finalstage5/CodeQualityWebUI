<template>
  <el-dialog
    title="分析项目版本"
    :visible.sync="dialogVisible"
    width="46%"
    top="5%"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-table
      :data="tableData1"
      border
      ref="multipleTable"
      size="medium"
      class="container"
      header-cell-class-name="table-header"
      max-height="400px"
    >

      <el-table-column prop="ver_id" label="版本id" width="100" align="center">
      </el-table-column>
      <el-table-column prop="time" label="版本上传日期"  width="250" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            style="margin-top: 6px;"
            icon="el-icon-aim"
            @click="handleAna(scope.$index, scope.row)"
          >分析项目</el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Ana1 :dialogVisible="Visible" @childFn="receive"></Ana1>

  </el-dialog>

</template>

<script>

import Vue, {ref} from "vue";
import fs from "fs";
import Ana1 from "./Ana1";

export default {
  name: 'Analyze',
  components:{
    Ana1
  },
  props: {
    dialogVisible:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      value:'',
      Visible:false,
      tableData1:[],
    }
  },
  mounted:function() {
  },
  methods: {
    receive(){
      this.Visible=false;
    },
    show() {
      this.dialogVisible = true;
      const that = this;
      that.tableData1=[];
      const config1 = {
        method: 'get',
        url: '/version/list?user_id=' + sessionStorage.getItem("user_id")
          + '&token=' + sessionStorage.getItem("token")
          + '&pro_id=' + sessionStorage.getItem('pro_id'),
      };
      const Info = (res) => {
        console.log(JSON.stringify(res.data));
        if (res.data.resp.status_code === 0) {
          if(res.data.version_list===null)
          {
            Vue.prototype.$message.success("暂无版本！");
            return;
          }
          //判断返回的是否成功
          for(let i=0;i<res.data.version_list.length;i++){
            let project = {ver_id:Number,time:String};
            //例如将毫秒时间戳“1600336219000”转换为"YYYY-MM-dd  HH24:mi:ss"格式的string类型的时间格式
            const unix_time = res.data.version_list[i].time;
            const temp_time = new Date(unix_time);
            const year = temp_time.getFullYear();
            let month = temp_time.getMonth() + 1;
            month = month < 10 ? "0"+month:month;
            let day = temp_time.getDate();
            day = day < 10 ? "0"+day:day;
            let hour = temp_time.getHours();
            hour = hour < 10 ? "0"+hour:hour;
            let minute = temp_time.getMinutes();
            minute = minute < 10 ? "0"+minute:minute;
            let second = temp_time.getSeconds();
            second = second < 10 ? "0"+second:second;
            const result_time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            project.time=result_time;
            project.ver_id=res.data.version_list[i].ver_id;
            console.log(project);
            that.tableData1.push(project);
            console.log(that.tableData1);
          }
          Vue.prototype.$message.success("获取版本信息成功！");
          this.$emit("childFn");

        } else {
          Vue.prototype.$message.error("出错！")
        }
      }
      this.$axios(config1)
        .then(res => Info(res))
        .catch(err => {
          Vue.prototype.$message.error("请检查网络状况")
          console.error(err);
          //console.log(err);
        });
    },
    handleAna(index, row){
      sessionStorage.removeItem('ver_id');
      sessionStorage.setItem("ver_id",this.tableData1[index].ver_id);
      this.Visible=true;
    },
    // 删除用户
    handleDelete(index, row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          console.log("id:"+this.tableData1[index].ver_id);
          let params={
            user_id: '',
            pro_id: '',
            token: ''
          };
          params.ver_id=this.tableData1[index].ver_id;
          params.token=sessionStorage.getItem("token");
          params.user_id=sessionStorage.getItem("user_id");

          const config = {
            method: 'delete',
            url: '/version/delete?version_id='+params.ver_id
              +'&user_id='+sessionStorage.getItem("user_id")
              +'&token='+sessionStorage.getItem('token')
          };
          this.$axios(config)
            .then((res)=>{
              if(res.data){
                this.$message.success('删除成功');//记住
              }else{
                this.$message.warning('删除失败')
              }
            })
            .catch(function (error) {
              console.log("服务器连接异常！")
            })
          this.tableData1.splice(index, 1);
        })
        .catch(() => {});
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
