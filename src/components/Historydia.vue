<template>
  <el-dialog
    title="历史版本"
    :visible.sync="dialogVisible"
    width="67%"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-table
      :data="tableData"
      border
      ref="multipleTable"
      size="medium"
      class="container"
      header-cell-class-name="table-header"
      max-height="400px"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column prop="id" label="版本id" width="200" align="center">
      </el-table-column>

      <el-table-column prop="address" label="上传日期"  width="450" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            v-wave
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="See(scope.$index, scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

</template>

<script>

import {ref} from "vue";

export default {
  name: 'Historydia',
  props: {
    dialogVisible:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      tableData:[{id:'1',address:'20221108'},
        {id:'2',address:'20221118'}]
    }
  },
  methods: {
    show() {
      this.dialogVisible = ref(true)
    },
    See:function (){
      this.$router.push('/History');this.$router.go(0)
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
