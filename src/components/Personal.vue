<template>
  <div class="login-wrap">
    <el-button v-wave class="AddProject" type="primary" @click="addproject">添加项目</el-button>

    <el-button v-wave class="DelProject" type="danger" @click="delproject">批量删除项目</el-button>

    <el-button v-wave class="LoginOut" type="warning" @click="loginOut">登出</el-button>

    <el-table
      :data="tableData"
      border
      ref="elTable"
      size="medium"
      class="container"
      header-cell-class-name="table-header"
      max-height="800px"
      @selection-change="handleSelect()"
    >

      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column prop="pro_id" label="项目id" width="100" align="center">
      </el-table-column>

      <el-table-column prop="name" label="项目名称"  width="450" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button
            v-wave
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >查看详情</el-button>
          <el-button
            v-wave
            size="small"
            type="primary"
            icon="el-icon-upload"
            @click="handlesub(scope.$index, scope.row)"
          >上传新版本</el-button>
          <el-button
            v-wave
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

    <Uploaddia :dialogVisible="Visible" @childFn="receive"></Uploaddia>
    <Newupload :dialogVisible="Visible1" @childFn="receive1"></Newupload>
    <Analyze :dialogVisible="Visible2" ref='child' @childFn="receive2"></Analyze>

  </div>
</template>

<script>
import Vue, {ref} from "vue";
import Uploaddia from "./Uploaddia"
import Newupload from "./Newupload";
import Analyze from "./Analyze";

export default {
  name: "Personal",
  components:{
    Analyze,
    Uploaddia,
    Newupload,
  },
  data(){
    return {
      tableData:[],
      Visible: false,
      Visible1: false,
      Visible2: false,
    }
  },
  mounted:function() {
    const that=this;
    const config = {
      method: 'get',
      url: '/project/list?user_id=' + sessionStorage.getItem("user_id") + '&token='
        + sessionStorage.getItem("token")
    };
    const Info = (res) => {
      console.log(JSON.stringify(res.data));
      if (res.data.resp.status_code === 0) {
        if(res.data.project_list==null){
          Vue.prototype.$message.success("暂无项目信息！");
          this.$emit("childFn");
          return;
        }
        //判断返回的是否成功
        for(let i=0;i<res.data.project_list.length;i++){
          let project = {pro_id:Number,name:String};
          project.name=res.data.project_list[i].name;
          project.pro_id=res.data.project_list[i].pro_id;
          console.log(project);
          that.tableData.push(project);
          console.log(that.tableData);
        }
        Vue.prototype.$message.success("获取项目信息成功！");
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
  methods:{
    receive(){
      this.Visible=false
    },
    receive1(){
      this.Visible1=false
    },
    receive2(){
      this.Visible2=false
    },
    handleSelect(){
      console.log(this.$refs.elTable.selection);
    },
    addproject:function (){
      this.Visible = ref(true);
    },
    delproject:function (){
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          for(let i=0;i<this.$refs.elTable.selection.length;i++)
            this.Delete(this.$refs.elTable.selection[i].pro_id);
        })
        .catch(() => {});

    },
    Delete(pro_id) {
      console.log("id:"+pro_id);
      let params={
        user_id: '',
        pro_id: '',
        token: ''
      };
      params.pro_id=pro_id;
      params.token=sessionStorage.getItem("token");
      params.user_id=sessionStorage.getItem("user_id");

      const config = {
        method: 'delete',
        url: '/project/delete?pro_id='+params.pro_id
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
      location.reload();
    },
    handlesub:function (index, row){
      sessionStorage.removeItem('pro_id');
      sessionStorage.setItem("pro_id",this.tableData[index].pro_id);
      this.Visible1 = ref(true);
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
    handleEdit:function (index, row){
      sessionStorage.removeItem('pro_id');
      sessionStorage.setItem("pro_id",this.tableData[index].pro_id)
      this.$router.push('/Project');
    },
    // 删除用户
    handleDelete(index, row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          console.log("id:"+this.tableData[index].id);
          let params={
            user_id: '',
            pro_id: '',
            token: ''
          };
          params.pro_id=this.tableData[index].pro_id;
          params.token=sessionStorage.getItem("token");
          params.user_id=sessionStorage.getItem("user_id");

          const config = {
            method: 'delete',
            url: '/project/delete?pro_id='+params.pro_id
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
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    handleAna(index, row){
      sessionStorage.removeItem('pro_id');
      sessionStorage.setItem("pro_id",this.tableData[index].pro_id);
      this.$refs.child.show();
      //this.Visible2 = ref(true);
    }
  }
}

</script>

<style scoped>
.login-wrap{
  border-radius: 10px;
  margin: 0 auto;
  width: 1050px;
  height: 760px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.AddProject{
  position: relative;left:180px;top:0px;
  font-weight: 600;
  font-size: 14px;
}
.DelProject{
   position: relative;left:340px;top:0px;
   font-weight: 600;
   font-size: 14px;
 }
.LoginOut{
  position: relative;left:600px;top:0px;
  font-weight: 600;
  font-size: 14px;
}
.container {
  border-radius: 10px;
  margin: 50px auto;
  width: 1050px;
  height: 600px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
</style>
