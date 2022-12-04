<template>
  <div>
    <el-card
      style="width: 1040px;margin-bottom: 20px;margin-left: 270px;">
      <el-descriptions title="方法详细信息" :column="2" size="medium" :border='true'>
        <el-descriptions-item>
          <template slot="label">
            方法id
          </template>
          {{ mth_id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            方法名
          </template>
          {{ name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            返回值类型，参数名及其类型
          </template>
          {{ signature }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            参数个数
          </template>
          {{ num_parameters }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            入度
          </template>
          {{ num_inbound }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            出度
          </template>
          {{ num_outbound }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            圈复杂度
          </template>
          {{ cyclomatic_complexity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所属类id
          </template>
          {{ class_id }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-button v-wave class="Back" type="primary" @click="back">返回</el-button>
    <el-button v-wave class="LoginOut" type="warning" @click="loginOut">登出</el-button>

  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "Funcinfo",
  data() {
    return {
      mth_id: Number,
      name: String,
      signature:String,
      length: Number,
      num_valid_lines: Number,
      num_comment_lines: Number,
      num_blank_lines: Number,
      num_parameters: Number,
      num_inbound: String,
      num_outbound: String,
      call_hierarchy: Number,
      cyclomatic_complexity: Number,
      class_id: Number
    };
  },
  mounted() {
    this.mth_id=sessionStorage.getItem('mth_id');
    this.name=sessionStorage.getItem('name');
    this.signature=sessionStorage.getItem('signature');
    this.length=sessionStorage.getItem('length');
    this.num_valid_lines=sessionStorage.getItem('num_valid_lines');
    this.num_comment_lines=sessionStorage.getItem('num_comment_lines');
    this.num_blank_lines=sessionStorage.getItem('num_blank_lines');
    this.num_parameters=sessionStorage.getItem('num_parameters');
    this.num_inbound=sessionStorage.getItem('num_inbound');
    this.num_outbound=sessionStorage.getItem('num_outbound');
    this.call_hierarchy=sessionStorage.getItem('call_hierarchy');
    this.cyclomatic_complexity=sessionStorage.getItem('cyclomatic_complexity');
    this.class_id=sessionStorage.getItem('class_id');
  },
  methods: {
    loginOut:function(){
      sessionStorage.clear();
      this.$router.push('/Login');
      Vue.prototype.$message.success("已登出")
    },
    back:function (){
      this.$router.push('/Project');
    }
  }
}
</script>

<style scoped>
.Back{
  position: relative;left:500px;top:20px;
  font-weight: 800;
  font-size: 16px;
}
.LoginOut{
  position: relative;left:720px;top:20px;
  font-weight: 800;
  font-size: 16px;
}

</style>
