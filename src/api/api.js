import axios from 'axios'

// axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 登陆拦截器
// 拦截器处理token
axios.interceptors.request.use(function (config) {
  // 获取当前是否存在token
  let token = localStorage.getItem('mytoken')
  if (token) {
    // Authorization 请求头的键是前后台约定
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 实现登录功能
export const login = (params) => {
  return axios.post('login', params).then(res => {
    // 返回具体的数据
    return res.data
  })
}
// 获取用户数据
export const getUsersData = (params) => {
  return axios.get('users', {params: params}).then(res => {
    // 返回具体的数据
    return res.data
  })
}
// 用户状态切换
export const toggleUserState = (params) => {
  return axios.put('users/' + params.uId + '/state/' + params.state).then(res => {
    return res.data
  })
}
// 添加用户
export const addUser = (params) => {
  return axios.post('users', params).then(res => {
    return res.data
  })
}
// 通过id查找用户数据
export const getUsersById = (params) => {
  return axios.get('users/' + params.id, params).then(res => {
    return res.data
  })
}
// 编辑用户
export const editUser = (params) => {
  return axios.put('users/' + params.id, params).then(res => {
    return res.data
  })
}
// 删除用户
export const deleteUser = (params) => {
  return axios.delete('users/' + params.id).then(res => {
    return res.data
  })
}
// 权限管理
export const rightList = (params) => {
  return axios.get('rights/' + params.type).then(res => {
    return res.data
  })
}
// 角色列表
export const rolesList = (params) => {
  return axios.get('roles').then(res => {
    return res.data
  })
}
// 添加角色
export const rolesAdd = (params) => {
  return axios.post('roles', params).then(res => {
    return res.data
  })
}
// 根据id 查找角色
export const rolesById = (params) => {
  return axios.get('roles/' + params.id).then(res => {
    return res.data
  })
}
// 编辑角色
export const rolesUpdate = (params) => {
  return axios.put('roles/' + params.id, params).then(res => {
    return res.data
  })
}
// 删除角色
export const deleteRoler = (params) => {
  return axios.delete('roles/' + params.id).then(res => {
    return res.data
  })
}
// 删除角色指定权限
export const deleteRolerById = (params) => {
  return axios.delete('roles/' + params.id + '/rights/' + params.rId).then(res => {
    return res.data
  })
}
// 角色授权
export const grantRole = (params) => {
  return axios.post('roles/' + params.id + '/rights', params).then(res => {
    return res.data
  })
}
