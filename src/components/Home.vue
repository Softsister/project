<template>
 <el-container>
    <el-aside :style='{width:"auto"}'>
      <div class="logo"></div>
      <el-menu
        :collapse="isCollapse"
        :unique-opened="true"
        default-active="2"
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu :key='item.id' :index="item.path" v-for='item in menuData'>
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{{item.authName}}</span>
          </template>
          <el-menu-item :key='taget.id' :index='taget.path' v-for='taget in item.children'>
            <i class="el-icon-menu"></i>
            <span>{{taget.authName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- <el-menu
        :collapse="isCollapse"
        :unique-opened="true"
        default-active="2"
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">用户管理</span>
          </template>
          <el-menu-item index="/user">
            <i class="el-icon-menu"></i>
            <span>用户列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">权限管理</span>
          </template>
          <el-menu-item index="/home/role">
            <i class="el-icon-menu"></i>
            <span slot="title">角色列表</span>
          </el-menu-item>
          <el-menu-item index="/home/right">
            <i class="el-icon-menu"></i>
            <span slot="title">权限列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">商品管理</span>
          </template>
          <el-menu-item index="/product">
            <i class="el-icon-menu"></i>
            <span slot="title">商品列表</span>
          </el-menu-item>
          <el-menu-item index="/category">
            <i class="el-icon-menu"></i>
            <span slot="title">商品分类</span>
          </el-menu-item>
          <el-menu-item index="/param">
            <i class="el-icon-menu"></i>
            <span slot="title">商品参数</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">订单管理</span>
          </template>
          <el-menu-item index="/order">
            <i class="el-icon-menu"></i>
            <span slot="title">订单列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">数据统计</span>
          </template>
          <el-menu-item index="/report">
            <i class="el-icon-menu"></i>
            <span slot="title">数据报表</span>
          </el-menu-item>
        </el-submenu>
      </el-menu> -->
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <i @click="toggleMenu" class="myicon myicon-menu btnsize"></i>
          <div class="stitle">电商后台管理系统</div>
          <a href="javascript:;" @click="logout" class="logoutbtn">退出</a>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getMenus} from '../api/api.js'
export default {
  data () {
    return {
      isCollapse: false,
      menuData: []
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('mytoken')
      this.$router.push({name: 'login'})
    },
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  mounted () {
    getMenus().then(res => {
      console.log(res)
      if (res.meta.status === 200) {
        this.menuData = res.data
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btnsize {
  font-size: 36px;
  color: #989898;
  cursor: pointer;
  line-height: 60px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-container{
  height: 100%;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: left;
  display: block;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: left;
  overflow: '';
}
.logoutbtn {
  position: absolute;
  right: 10px;
  color: orange;
}
.el-header {
  background-color: #545c64;
}
.logo {
  height:60px;
  background: url(../assets/logo.png);
  background-size: cover;
  background-color: #989898;
}
.stitle {
  position: absolute;
  font-size: 28px;
  overflow: hidden;
  width: 300px;
  color: #fff;
  left: 600px;
  top: 0px;
}
</style>
