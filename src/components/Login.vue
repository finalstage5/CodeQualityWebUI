<template>
  <div class="login-wrap">
    <el-form class="login-container">
      <h1 class="title">用户登录</h1>
      <el-form-item>
        <el-input type="type" placeholder="用户账号" v-model="username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="用户密码" v-model="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-wave type="primary" @click="doLogin()" style="width: 100%;">登录</el-button>
      </el-form-item>
      <el-row style="text-align: center;margin-top: -10px;">
        <el-link type="primary" @click="toRegister()">用户注册</el-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>
/* import axios from 'axios'
import qs from 'qs' */
import Vue from 'vue'
import fs from "fs";
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    doLogin: function() {
      let username = this.username;
      let password = this.password;
      console.log("username=%s,password=%s", username, password);
      let url='/user/login';
      let url1='/user/login?username=%3C'+username+'%3E&password=%3C'+password+'%3E';

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
            Vue.prototype.$message.success("登录成功！");
            this.$router.push('/Personal')

          } else {
            Vue.prototype.$message.error("用户名或密码错误！")
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

      //发起ajax请求-Post
      //payload:{a:'zs','b':'123'}->a=zs&b=123
      /* let str=qs.stringify(params);
      console.log(str); */
      /* this.axios.post(url,params).then(resp=>{
        let data = resp.data;
        console.log(data);
          this.$message({
            message: data.msg,
            type:data.code==1?'success':'error'
        });
      }).catch(err=>{
        console.log(err);
      }); */
    },
    toRegister: function() {
      this.$router.push('/Register')
    }
  }
}
</script>

<style scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;
  /* background-color: #112346; */
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
