<template>
  <div>
    <el-card
      style="width: 1040px;margin-bottom: 20px;margin-left: 270px;">
      <el-descriptions title="文件详细信息" :column="2" size="medium" :border='true'>
        <el-descriptions-item>
          <template slot="label">
            文件id
          </template>
          {{ file_id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文件名
          </template>
          {{ name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文件长度
          </template>
          {{ length }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文件对应路径
          </template>
          {{ path }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            方法个数
          </template>
          {{ num_methods }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            类的个数
          </template>
          {{ num_classes }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            有效代码行数
          </template>
          {{ num_valid_lines }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            注释行数
          </template>
          {{ num_comment_lines }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            空行个数
          </template>
          {{ num_blank_lines }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            内部边数
          </template>
          {{ num_edges }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            接口数
          </template>
          {{ num_api }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            内聚度
          </template>
          {{ coupling }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            圈复杂度
          </template>
          {{ cyclomatic_complexity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            可修改性
          </template>
          {{ modifiability }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            可扩展性
          </template>
          {{ extensibility }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            易测试性
          </template>
          {{ testability }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            可替换性
          </template>
          {{ replaceability }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            易理解性
          </template>
          {{ understandability }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所属版本id
          </template>
          {{ ver_id }}
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
  name: "Fileinfo",
  data() {
    return {
      file_id: Number,
      name: String,
      length: Number,
      path: String,
      num_methods: Number,
      num_classes:Number,
      num_valid_lines: Number,
      num_comment_lines: Number,
      num_blank_lines: Number,
      num_edges: Number,
      num_api: Number,
      num_depend: Number,
      call_hierarchy: Number,
      coupling: Number,
      cyclomatic_complexity: Number,
      modifiability: Number,
      extensibility: Number,
      testability: Number,
      replaceability: Number,
      understandability: Number,
      ver_id: Number,
    };
  },
  mounted() {
    this.file_id=sessionStorage.getItem('file_id');
    this.name=sessionStorage.getItem('name');
    this.path=sessionStorage.getItem('path');
    this.length=sessionStorage.getItem('length');
    this.num_methods=sessionStorage.getItem('num_methods');
    this.num_classes=sessionStorage.getItem('num_classes');
    this.num_valid_lines=sessionStorage.getItem('num_valid_lines');
    this.num_comment_lines=sessionStorage.getItem('num_comment_lines');
    this.num_blank_lines=sessionStorage.getItem('num_blank_lines');
    this.num_edges=sessionStorage.getItem('num_edges');
    this.num_api=sessionStorage.getItem('num_api');
    this.num_depend=sessionStorage.getItem('num_depend');
    this.call_hierarchy=sessionStorage.getItem('call_hierarchy');
    this.coupling=sessionStorage.getItem('coupling');
    this.cyclomatic_complexity=sessionStorage.getItem('cyclomatic_complexity');
    this.modifiability=sessionStorage.getItem('modifiability');
    this.extensibility=sessionStorage.getItem('extensibility');
    this.testability=sessionStorage.getItem('testability');
    this.replaceability=sessionStorage.getItem('replaceability');
    this.understandability=sessionStorage.getItem('understandability');
    this.ver_id=sessionStorage.getItem('ver_id');
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
