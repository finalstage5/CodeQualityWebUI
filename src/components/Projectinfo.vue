<template>
  <div>
    <el-card
      style="width: 1040px;margin-bottom: 20px;margin-left: 270px;">
      <el-descriptions title="版本详细信息" :column="2" size="medium" :border='true'>
        <el-descriptions-item>
          <template slot="label">
            版本id
          </template>
          {{ ver_id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            上传日期
          </template>
          {{ time }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            原始文件哈希值
          </template>
          {{ hash }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            代码行数
          </template>
          {{ length }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文件个数
          </template>
          {{ num_files }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            类的个数
          </template>
          {{ num_classes }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            方法个数
          </template>
          {{ num_methods }}
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
            所属项目id
          </template>
          {{ pro_id }}
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
  name: "Projectinfo",
  data() {
    return {
      ver_id: null,
      time: null,
      hash: null,
      length: null,
      call_graph_id: null,
      num_files: null,
      num_classes: null,
      num_methods: null,
      num_valid_lines: null,
      num_comment_lines: null,
      num_blank_lines: null,
      num_edges: null,
      num_api: null,
      num_comment_api: null,
      num_api_parameters: null,
      call_hierarchy: null,
      coupling: null,
      cyclomatic_complexity: null,
      modifiability: null,
      extensibility: null,
      testability: null,
      replaceability: null,
      understandability: null,
      pro_id: null,
    };
  },
  mounted() {
    this.ver_id=sessionStorage.getItem('ver_id');
    this.time=sessionStorage.getItem('time');
    this.hash=sessionStorage.getItem('hash');
    this.length=sessionStorage.getItem('length');
    this.call_graph_id=sessionStorage.getItem('call_graph_id');
    this.num_files=sessionStorage.getItem('num_files');
    this.num_methods=sessionStorage.getItem('num_methods');
    this.num_classes=sessionStorage.getItem('num_classes');
    this.num_valid_lines=sessionStorage.getItem('num_valid_lines');
    this.num_comment_lines=sessionStorage.getItem('num_comment_lines');
    this.num_blank_lines=sessionStorage.getItem('num_blank_lines');
    this.num_edges=sessionStorage.getItem('num_edges');
    this.num_api=sessionStorage.getItem('num_api');
    this.num_comment_api=sessionStorage.getItem('num_comment_api');
    this.num_api_parameters=sessionStorage.getItem('num_api_parameters');
    this.call_hierarchy=sessionStorage.getItem('call_hierarchy');
    this.coupling=sessionStorage.getItem('coupling');
    this.cyclomatic_complexity=sessionStorage.getItem('cyclomatic_complexity');
    this.modifiability=sessionStorage.getItem('modifiability');
    this.extensibility=sessionStorage.getItem('extensibility');
    this.testability=sessionStorage.getItem('testability');
    this.replaceability=sessionStorage.getItem('replaceability');
    this.understandability=sessionStorage.getItem('understandability');
    this.pro_id=sessionStorage.getItem('pro_id');
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
