<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-button type="success" title='添加角色' @click="dialogVisible4Add = true" plain>添加角色</el-button>
    </div>
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope='scope'>
          <el-row :key="item.id" v-for="item in scope.row.children">
            <el-col :span="3">
              <el-tag @close="deleteRight(scope.row, item.id)" closable>{{item.authName}}</el-tag>
              <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
            </el-col>
            <el-col :span="21">
              <el-row class="authlist" :key="tag.id" v-for="tag in item.children">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row, tag.id)" type="success" closable>{{tag.authName}}</el-tag>
                  <i v-if="tag.children.length>0" class="el-icon-arrow-right arrow"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleteRight(scope.row, btn.id)" :key="btn.id" type="warning" closable v-for="btn in tag.children">{{btn.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="260">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        width="500"
        label="描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope='scope'>
          <el-button size='small' type="primary" title='编辑角色' icon="el-icon-edit" @click='roleId(scope.row)'></el-button>
          <el-button size='small' type="danger" title='删除角色' icon="el-icon-delete" @click="deleteHandler(scope.row)"></el-button>
          <el-button size='small' type="primary" title='授权' icon='el-icon-check' @click='grantHandler(scope.row)'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible="dialogVisible4Add"
      width="40%"
      @close="handleRoleClose('add')">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item prop='roleName' label="角色名称">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item prop='roleDesc' label="角色描述">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="submitRole4Add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog
      title="修改角色"
      :visible="dialogVisible4Edit"
      width="40%"
      @close="handleRoleClose('edit')">
      <el-form ref="editRoleForm" :rules="rules" :model="eform" label-width="100px">
        <el-form-item prop='roleName' label="角色名称">
          <el-input v-model="eform.roleName"></el-input>
        </el-form-item>
        <el-form-item prop='roleDesc' label="角色描述">
          <el-input v-model="eform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button type="primary" @click="submitRole4Edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权角色 -->
    <el-dialog
      title="授权角色"
      :visible="dialogVisible4Grant"
      width="40%"
      @close="handleRoleClose('grant')">
        <el-tree
          ref='tree'
          node-key="id"
          :default-checked-keys="selectTree"
          default-expand-all
          :props="treeProps"
          :data="treeData"
          show-checkbox>
        </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Grant = false">取 消</el-button>
        <el-button type="primary" @click="submitGrant">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {rolesList, rolesAdd, rolesById, rolesUpdate, deleteRoler, deleteRolerById, rightList, grantRole} from '../../api/api.js'
export default {
  data () {
    return {
      treeData: [],
      selectTree: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      tableData: [],
      dialogVisible4Add: false,
      dialogVisible4Edit: false,
      dialogVisible4Grant: false,
      currentRole: '',
      form: {
        roleName: '',
        roleDesc: ''
      },
      eform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    _getThirdRightId (data, arr) {
      data.forEach((item) => {
        if (!item.children) {
          arr.push(item.id)
        } else {
          this._getThirdRightId(item.children, arr)
        }
      })
    },
    // 授权
    submitGrant () {
      // console.log(this.$refs.tree.getCheckedNodes())
      let treeNodes = this.$refs['tree'].getCheckedNodes()
      let tmp = treeNodes.map(item => {
        return item.id + ',' + item.pid
      })
      let ids = new Set(tmp.join(',').split(','))
      let result = [...ids].join(',')
      grantRole({id: this.currentRole, rids: result}).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.initList()
          this.dialogVisible4Grant = false
        }
      })
    },
    grantHandler (row) {
      rightList({type: 'tree'}).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.treeData = res.data
          this.selectTree = []
          this._getThirdRightId(row.children, this.selectTree)
          this.dialogVisible4Grant = true
          this.currentRole = row.id
        }
      })
    },
    // 删除角色指定授权
    deleteRight (row, rightId) {
      // console.log(id)
      deleteRolerById({id: row.id, rId: rightId}).then(res => {
        if (res.meta.status === 200) {
          row.children = res.data
        }
      })
    },
    deleteHandler (row) {
      this.$confirm('确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(uId => {
        deleteRoler({id: row.id}).then(res => {
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
    roleId (row) {
      // console.log(row)
      rolesById({id: row.id}).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.eform.id = res.data.roleId
          this.eform.roleName = res.data.roleName
          this.eform.roleDesc = res.data.roleDesc
          this.dialogVisible4Edit = true
        }
      })
    },
    submitRole4Edit () {
      rolesUpdate(this.eform).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.dialogVisible4Edit = false
          this.initList()
        }
      })
    },
    submitRole4Add () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          rolesAdd(this.form).then(res => {
            // console.log(res)
            if (res.meta.status === 201) {
              this.dialogVisible4Add = false
              this.initList()
            }
          })
        }
      })
    },
    handleRoleClose (flag) {
      if (flag === 'add') {
        this.dialogVisible4Add = false
      } else if (flag === 'edit') {
        this.dialogVisible4Edit = false
      } else {
        this.dialogVisible4Grant = false
      }
    },
    initList () {
      rolesList().then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data
        }
      })
    }
  },
  mounted () {
    // 初始化数据列表
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
.el-tag  {
  margin-left: 5px;
}
.authlist {
  border-top: solid 1px #D3DCE6;
  padding-bottom: 5px;
}
.arrow {
  font-size: 18px;
  font-weight: bold;
}
.el-table{
  padding: 6px 0!important;
}
</style>
