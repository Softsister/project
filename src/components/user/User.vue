<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-input placeholder="请输入内容" class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="dialogVisible4Add = true" plain>添加用户</el-button>
    </div>
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        width="180"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        width="180"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        width="180"
        label="用户状态">
        <template slot-scope="scope">
          <!-- 作用域插槽，可以定制数据显示 -->
          <el-switch @change='toggleUser(scope.row)' v-model="scope.row.mg_state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        width="280"
        label="操作">
        <template slot-scope="scope">
          <el-button size='small' type="primary" icon="el-icon-edit" @click='editHandler(scope.row)'></el-button>
          <el-button size='small' @click="deleteHandler(scope.row)" type="primary" icon="el-icon-delete"></el-button>
          <el-button size='small' type="primary" icon="el-icon-check"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 10, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      @close='closeUserDialog("add")'
      :visible="dialogVisible4Add"
      width="30%">
      <el-form ref="userform" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='mobile'>
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="submitUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      @close='closeUserDialog("edit")'
      :visible="dialogVisible4Edit"
      width="30%">
      <el-form ref="userform4Edit" :rules="rules" :model="eform" label-width="80px">
        <el-form-item label="用户名" prop='username'>
          <el-button disabled>{{eform.username}}</el-button>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="eform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='mobile'>
          <el-input v-model="eform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button type="primary" @click="submitUser4Edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getUsersData, toggleUserState, addUser, getUsersById, editUser, deleteUser} from '../../api/api.js'
export default {
  data () {
    return {
      currentPage: 1, // 当前页码
      pagesize: 2, // 每页显示条数
      total: 0, // 数据总条数
      tableData: [], // 实际的表格列表数据
      dialogVisible4Add: false,
      dialogVisible4Edit: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      eform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    deleteHandler (row) {
      this.$confirm('确定要删除用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(uId => {
        deleteUser({id: row.id}).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'info',
              message: '删除成功'
            })
            this.initList()
          }
        })
      })
    },
    editHandler (row) {
      getUsersById({id: row.id}).then(res => {
        if (res.meta.status === 200) {
          this.eform.id = res.data.id
          this.eform.username = res.data.username
          this.eform.email = res.data.email
          this.eform.mobile = res.data.mobile
          this.dialogVisible4Edit = true
        }
      })
    },
    submitUser4Edit () {
      this.$refs['userform4Edit'].validate(valid => {
        if (valid) {
          editUser(this.eform).then(res => {
            // console.log(res)
            if (res.meta.status === 200) {
              this.dialogVisible4Edit = false
              this.initList()
            }
          })
        }
      })
    },
    submitUser () {
      this.$refs['userform'].validate((valid) => {
        if (valid) {
          addUser(this.form).then(res => {
            if (res.meta.status === 201) {
              this.dialogVisible4Add = false
              this.initList()
            }
          })
        }
      })
    },
    toggleUser (data) {
      // 改变用户状态
      toggleUserState({
        uId: data.id, // 用户id
        state: data.mg_state // 用户当前状态
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    },
    closeUserDialog (flag) {
      if (flag === 'add') {
        this.dialogVisible4Add = false
      } else {
        this.dialogVisible4Edit = false
      }
    },
    handleSizeChange (val) {
      // 改变每页显示条数
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      // 改变当前页码
      this.currentPage = val
      this.initList()
    },
    initList () {
      // 初始化数据列表
      getUsersData({
        query: '',
        pagenum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data.users
          this.total = res.data.total
          this.currentPage = res.data.pagenum
        }
      })
    }
  },
  mounted () {
    // 首次加载页面，初始化表格数据
    this.initList()
  }
}
</script>
<style scoped>
  .el-breadcrumb {
    background-color: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
  }
  .el-pagination {
    background-color: #D3DCE6;
    padding-top: 10px;
    height: 35px;
    line-height: 35px;
  }
  .search {
    width: 300px;
  }
</style>
