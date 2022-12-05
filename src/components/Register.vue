<template>
  <div>
    <el-form class="login-container">
      <h1 class="title">用户注册</h1>
      <el-form-item>
        <el-input type="type" placeholder="用户账号" v-model="username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="emil" placeholder="用户邮箱" v-model="email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="用户密码" v-model="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password1" placeholder="确认密码" v-model="password1" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-wave type="primary" @click="doRegister()" style="width: 46%;">注册</el-button>
        <el-button v-wave type="primary" @click="toLogin()" style="width: 46%;">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from "vue";

export default{
  name:'Register',
  data:function(){
    return {
      username:'',
      email:'',
      password:'',
      password1:''
    }
  },
  methods:{
    doRegister:function(){
      let username = this.username;
      let email = this.email;
      let password = this.password;
      let password1 = this.password1;

      if (email !== "") {
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        let isok= reg.test(email );
        if (!isok) {
          alert("邮箱格式不正确，请重新输入！");
          return false;
        }
      }
      else {
        alert("邮箱格式不正确，请重新输入！");
        return false;
      }

      console.log("username=%s,email=%s,password=%s", username, email,password);
      let url='/user/signup';
      let url1='/user/signup?username=%3C'+username+'%3E&email=%3C'+email+'%3E&password=%3C'+password+'%3E';
      //定义请求参数
      let params = {
        username: username,
        email: email,
        password: password
      };
      console.log(params);

      if(password===password1){
        const getLoginInfoOk = (res) => {
          if (res.data) {
            console.log(res.data.resp.status_msg);
            if (res.data.resp.status_msg === 'OK') {
              //判断返回的是否正确密码
              Vue.prototype.$message.success("注册成功！");
              this.$router.push('/Login')

            } else {
              Vue.prototype.$message.error("注册失败！")
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
      }
      else{
        Vue.prototype.$message.error("两次密码不一致！")
      }
    },
    toLogin:function(){
      this.$router.push('/Login');
    }
  }
}
</script>

<style>
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
