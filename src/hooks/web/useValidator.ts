import { useI18n } from '@/hooks/web/useI18n'
import { FormItemRule } from 'element-plus'

const { t } = useI18n()

interface LengthRange {
  min: number
  max: number
  message?: string
}

export const useValidator = () => {
  const required = (message?: string): FormItemRule => {
    return {
      required: true,
      message: message || t('common.required')
    }
  }

  const lengthRange = (options: LengthRange): FormItemRule => {
    const { min, max, message } = options

    return {
      min,
      max,
      message: message || t('common.lengthRange', { min, max })
    }
  }

  const notSpace = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (val?.indexOf(' ') !== -1) {
          callback(new Error(message || t('common.notSpace')))
        } else {
          callback()
        }
      }
    }
  }

  const notSpecialCharacters = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
          callback(new Error(message || t('common.notSpecialCharacters')))
        } else {
          callback()
        }
      }
    }
  }
  //验证密码
  const validPWD = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        if (value === '' || value.length < 6 || value.length > 12) {
          callback(new Error(message || t('valid.validPwd')))
        } else {
          const reg = /^(?![A-Za-z]+$)(?![.@$!%*#_~?&^]+$)(?!\d+$)[\da-zA-Z.@$!%*#_~?&^]{6,12}$/
          if (!reg.test(value)) {
            callback(new Error(message || t('valid.validPwd')))
          } else {
            callback()
          }
        }
      }
    }
  }
  // 验证手机号
  const validMobile = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        if (value === '') {
          callback(new Error(message || t('valid.validMobile')))
        } else {
          const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
          if (!reg.test(value)) {
            callback(new Error(message || t('valid.validMobile')))
          } else {
            callback()
          }
        }
      }
    }
  }
  //验证邮箱
  const validEmail = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validEmail')))
        } else {
          callback()
        }
      }
    }
  }
  // 验证营业执照
  const validLicenseNumber = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        // const reg = /^(?![0-9]+$)(?![A-Z]+$)[0-9A-Z](\w{14}|\w{17})$/
        const reg =
          /^([159Y]{1})([1239]{1})([0-9ABCDEFGHJKLMNPQRTUWXY]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-90-9ABCDEFGHJKLMNPQRTUWXY])$/

        if (!reg.test(value)) {
          // callback(new Error(message || t('valid.validLicenseNumber')))
          callback(new Error(message || '请输入符合规范的营业执照'))
        } else {
          callback()
        }
      }
    }
  }
  // 验证营业执照是否符合
  const isvalidLicenseNumber = (value: any) => {
    // const reg = /^(?![0-9]+$)(?![A-Z]+$)[0-9A-Z](\w{14}|\w{17})$/
    const reg =
      /^([159Y]{1})([1239]{1})([0-9ABCDEFGHJKLMNPQRTUWXY]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-90-9ABCDEFGHJKLMNPQRTUWXY])$/

    if (!reg.test(value)) {
      return false
    } else {
      return true
    }
  }
  // 只允许中英数字构成
  const validA = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^[A-z0-9\u4e00-\u9fa5]*$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validA')))
        } else {
          callback()
        }
      }
    }
  }
  //只允许输入中文
  const validB = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^[\u4e00-\u9fa5]*$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validB')))
        } else {
          callback()
        }
      }
    }
  }
  //只能输入中英文，不能使用数字与符号
  const validC = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^[A-z\u4e00-\u9fa5]*$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validC')))
        } else {
          callback()
        }
      }
    }
  }
  //只能输入中英文与数字，不能使用符号,不能纯数字
  const validD = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^(?!\d+$)[A-z0-9\u4e00-\u9fa5]*$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validD')))
        } else {
          callback()
        }
      }
    }
  }

  const validNumber = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^\d+$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validNumber')))
        } else {
          callback()
        }
      }
    }
  }

  const validIp = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg =
          /^(1[0-9]{2}|2[0-4][0-9]|25[0-5]|(\d){1,2})\.(1[0-9]{2}|2[0-4][0-9]|25[0-5]|(\d){1,2}|0)\.(1[0-9]{2}|2[0-4][0-9]|25[0-5]|(\d){1,2}|0)\.(1[0-9]{2}|2[0-4][0-9]|25[0-5]|(\d){1,2}|0)$/g
        if (!reg.test(value)) {
          callback(new Error(message || t('common.a48')))
        } else {
          callback()
        }
      }
    }
  }

  const validNumberSpace = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^[A-Za-z0-9]+$/
        if (!reg.test(value)) {
          callback(new Error(message || t('valid.validNumberSpace')))
        } else {
          callback()
        }
      }
    }
  }

  const validNumberPointer = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^\d*\.?\d{0,2}$/
        if (!reg.test(value)) {
          callback(new Error(message || t('common.b15')))
        } else {
          callback()
        }
      }
    }
  }
  const validNumberPointer1 = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /^\d*\.?\d{0,3}$/
        if (!reg.test(value)) {
          callback(new Error(message || t('common.b17')))
        } else {
          callback()
        }
      }
    }
  }

  const validNoChinese = (message?: string): FormItemRule => {
    return {
      validator: (_, value, callback) => {
        const reg = /[\u4E00-\u9FA5]/g
        if (reg.test(value)) {
          callback(new Error(message || t('common.b27')))
        } else {
          callback()
        }
      }
    }
  }

  return {
    required,
    lengthRange,
    notSpace,
    notSpecialCharacters,
    validPWD,
    validMobile,
    validEmail,
    validLicenseNumber,
    isvalidLicenseNumber,
    validA,
    validB,
    validC,
    validD,
    validNumber,
    validNumberSpace,
    validIp,
    validNumberPointer,
    validNumberPointer1,
    validNoChinese
  }
}
