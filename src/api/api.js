import axios from 'axios'

axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/'
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

export const testData = (params) => {
  return axios.get('users', {params: params}).then(res => {
    // 返回具体的数据
    return res.data
  })
}