<template>
  <el-dialog
    title="选择分析方法进行分析(默认全选)"
    :visible.sync="dialogVisible"
    width="35%"
    top="5%"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-table
      :data="tableData"
      border
      ref="elTable"
      size="medium"
      class="container"
      header-cell-class-name="table-header"
      max-height="700px"
      @selection-change="handleSelect()">

      <el-table-column type="selection" width="80" align="center"></el-table-column>
      <el-table-column prop="methods" label="分析方法" align="center">
      </el-table-column>
    </el-table>

    <el-button size="small" type="primary" style="margin-top: 10px;margin-left: 250px;" @click="Analyze()">开始分析</el-button>

  </el-dialog>

</template>

<script>

import Vue, {ref} from "vue";
import fs from "fs";

export default {
  name: 'Ana1',
  props: {
    dialogVisible:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      value:'',
      tableData:[],
    }
  },
  mounted:function() {
    const that = this;
    let url1 = '/analyze/version/list?user_id=%3C'+ sessionStorage.getItem("user_id")
      + '%3E&token=%3C' + sessionStorage.getItem("token") + '%3E';
    const config = {
      method: 'get',
      url: '/analyze/version/list?user_id=' + sessionStorage.getItem("user_id") + '&token='
        + sessionStorage.getItem("token")
    };
    this.$axios(config)
      .then((res) => {
        if (res.data.resp.status_code === 0) {
          console.log(res.data);
          for(let i=0;i<res.data.analyzer_list.length;i++){
            let ana = {methods:String};
            ana.methods=res.data.analyzer_list[i];
            that.tableData.push(ana);
          }
        } else {
          this.$message.error("出错了s！");
        }
      })
      .catch((err) => {
        console.log(err);
        this.$message.error("网络错误，请稍后再试");
      });

  },
  methods: {
    Analyze(){
      console.log(this.$refs.elTable.selection);
      let analyzers=[];
      if(this.$refs.elTable.selection.length==0){
        for(let i=0;i<this.tableData.length;i++)
          analyzers.push(this.tableData[i].methods);
      }
      else{
        for(let i=0;i<this.$refs.elTable.selection.length;i++)
          analyzers.push(this.$refs.elTable.selection[i].methods);
      }
      console.log(analyzers);
      let config = {
        method: 'post',
        url: '/analyze/version?user_id='+ sessionStorage.getItem("user_id")
          + '&token=' + sessionStorage.getItem("token")
          + '&version_id=' + sessionStorage.getItem("ver_id"),
          //+ '&analyzers=' + analyzers,
      };
      for(let i=0;i<analyzers.length;i++){
        config.url=config.url+'&analyzers='+analyzers[i];
      }
      this.$axios(config)
        .then((res) => {
          console.log(res.data.resp);
          if (res.data.resp.status_code === 0) {
            this.$message.success("分析成功");
          } else {
            this.$message.error("分析失败");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络错误，请稍后再试");
        });
    },
    show() {
      this.dialogVisible = true;
    },
    handleSelect(){
      console.log(this.$refs.elTable.selection);
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
