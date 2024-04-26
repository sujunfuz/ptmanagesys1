import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// 封装表格激活冻结样式
export function tableStatusStyle(value, msg = null) {
  if (value === 'ACTIVE' || value === 'STATUS_0_0_0_0') {
    return (
      <>
        <div class="flex items-center">
          <span class="w-8px h-8px border-rd-100% bg-green-500 inline-block"></span>
          <span class="ml-4px">{msg || t('userDemo.enable')}</span>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div class="flex items-center">
          <span class="w-8px h-8px border-rd-100% bg-red-500 inline-block"></span>
          <span class="ml-4px">{msg || t('userDemo.disable')}</span>
        </div>
      </>
    )
  }
}

import { ElTag } from 'element-plus'

// 封装表格激活冻结样式
export function tableStatusStyleTag(
  value: any,
  success: String = t('project.success'),
  fail: String = t('project.fail')
) {
  if (
    value === 'ACTIVE' ||
    value == '正常' ||
    value == 'PUT_ON_SALE' ||
    value === 'STATUS_0_0_0_0'
  ) {
    return (
      <>
        <div class="flex items-center">
          <ElTag type="success">{success}</ElTag>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div class="flex items-center">
          <ElTag type="info">{fail}</ElTag>
        </div>
      </>
    )
  }
}
