import {
  AxiosConfig,
  AxiosResponse,
  AxiosRequestHeaders,
  AxiosError,
  InternalAxiosRequestConfig
} from './types'
import { useStorage } from '@/hooks/web/useStorage'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { useAppStore } from '@/store/modules/app'
import { outGoLogin } from '@/utils/common'
import { type } from 'os'
import { string } from 'vue-types'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const { getStorage } = useStorage('localStorage')
const appStore = useAppStore()

const config: AxiosConfig = {
  /**
   * api请求基础路径
   */
  baseUrl: {
    // 开发环境接口前缀
    // base: 'http://192.168.110.189:8080/shopmp', //黄浩
    // base: 'http://192.168.110.197:8080/shopmp', //渝梦
    // base: 'http://192.168.110.65:8080/shopmp/', //恒彬
    // base: 'http://192.168.110.52:8080/shopmp', //付鑫
    // base: 'http://192.168.110.36:8080/shopmp',//晓铭
    // base: 'http://192.168.110.233:9002/ptgylBoss', //本地
    // base: 'http://ptgyl.kfos.com/ptgylBoss',//测试
    base: 'http://goldlink.nsd2020.com/ptgylBoss',//线上

    // 本地测试地址
    // dev: 'http://192.168.110.233:9002/ptgylBoss',
    dev: 'http://192.168.110.235:8751/ptgylBoss',

    // 打包生产环境接口前缀
    // pro: 'http://ptgyl.kfos.com/ptgylBoss',
    pro: 'http://goldlink.nsd2020.com/ptgylBoss',

    // 正式测试地址
    test: 'http://192.168.110.235:8751/ptgylBoss'
  },

  /**
   * 接口成功返回状态码
   */
  code: 200,

  /**
   * 接口请求超时时间
   */
  timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  defaultHeaders: 'application/json',

  interceptors: {
    //请求拦截
    // requestInterceptors: (config) => {
    //   return config
    // },
    // 响应拦截器
    // responseInterceptors: (result: AxiosResponse) => {
    //   return result
    // }
  }
}

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  config.headers['boss-token'] = getStorage(appStore.getToken) || ''
  // config.headers['TenantId'] = 15
  config.headers['lang'] = getStorage('lang') || 'zh'

  if (
    config.method === 'post' &&
    (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}
  ; (error: AxiosError) => {
    Promise.reject(error)
  }

const defaultResponseInterceptors = (response: any) => {
  if (response instanceof Blob) {
    // 如果是文件流，直接过
    if(response.type == 'application/json'){
      ElMessage.error('System Busy')
      return
    }
    return response
  } else if (response.code == config.code) {
    return response
  } else {
    ElMessage.error(response.msg || response.response.data.error || t('commmn.b24'))
    if (response.code == 401) {
      outGoLogin()
    }
  }
}
  ; (error: AxiosError) => {
    // console.log('err' + error) // for debug
    ElMessage.error(error.message)
    return Promise.reject(error)
  }

export { defaultResponseInterceptors, defaultRequestInterceptors }
export default config
