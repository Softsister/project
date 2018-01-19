<template>
  <div class="info">
    <div class="avatar">
      <img src="../assets/logo.png" alt="">
    </div>
    <el-form ref="formName" :rules="rules" :model="form" class="container">
      <div class="userInfo">
        <el-form-item prop="username">
          <el-input prefix-icon='myicon myicon-user' v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon='myicon myicon-key' v-model="form.password" type='password' placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="logins">登录</el-button>
        </el-form-item>
     </div>
    </el-form>
  </div>
</template>

<script>
import {login} from '../api/api.js'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    logins: function () {
      this.$refs['formName'].validate((valid) => {
        if (valid) {
          let params = {
            username: this.form.username,
            password: this.form.password
          }
          // 调用接口
          login(params).then(res => {
            if (res.meta.status === 200) {
              // 存储 token
              localStorage.setItem('mytoken', res.data.token)
              this.$router.push({name: 'home'})
            } else {
              // alert('用户名或密码错误')
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  background-color: #ddd;
}
.container {
  box-sizing: border-box;
  margin: 180px auto 0;
  width: 500px;
  height: 340px;
  background: #fff;
  position: relative;
}
.avatar {
  position: absolute;
  top: 110px;
  left: 50%;
  margin-left: -70px;
  width: 120px;
  height: 120px;
  border: 10px solid #fff;
  border-radius: 50%;
  background: #ccc;
  overflow: hidden;
  z-index: 999;
}
.userInfo {
  position: absolute;
  text-align: center;
  width: 400px;
  margin: 100px 50px;
}
.btn {
  width: 400px;
}
</style>
