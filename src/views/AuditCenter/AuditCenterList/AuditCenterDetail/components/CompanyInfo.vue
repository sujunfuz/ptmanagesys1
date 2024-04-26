<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack mb-30px">{{ t('auth.gsinfo') }}</div>
    <Form :isCol="false" :schema="formSchema" />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { FormSchema, Form } from '@/components/Form'
import { reactive } from 'vue'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const props = defineProps({
  merchantData: {
    type: Object,
    default: () => {}
  }
})
const formSchema = reactive<FormSchema[]>([
  {
    field: 'companyName',
    label: t('AuditCenter.AuditList.corporateName'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.merchantName}</span>
        }
      }
    }
  },
  {
    field: 'licenseNumber',
    label: t('auth.licenseNum'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.licenseNo}</span>
        }
      }
    }
  },
  {
    field: 'validDate',
    label: t('auth.validity'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <span>
              {props.merchantData.licenseTerm &&
                props.merchantData.licenseTerm.split(',').join(' - ')}
            </span>
          )
        }
      }
    }
  },
  {
    field: 'licenseImg',
    label: t('auth.licenseImg'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <UploadImage
              viewImgList={[{ name: '', url: props.merchantData.licenseImage }]}
              onlyView={true}
            ></UploadImage>
          )
        }
      }
    }
  },
  {
    field: 'manageRange',
    label: t('auth.businessScope'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.businessScope}</span>
        }
      }
    }
  },
  {
    field: 'companyAddress',
    label: t('auth.address'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.address}</span>
        }
      }
    }
  },
  {
    field: 'IDCardImg',
    label: t('auth.IdCards'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <div class="flex">
              <div class="flex flex-col items-center">
                <UploadImage
                  viewImgList={[{ name: '', url: props.merchantData.legalIdImages }]}
                  onlyView={true}
                ></UploadImage>
                <div>{t('auth.face1')}</div>
              </div>
              <div class="flex flex-col items-center">
                <UploadImage
                  viewImgList={[{ name: '', url: props.merchantData.legalIdImagesBg }]}
                  onlyView={true}
                ></UploadImage>
                <div>{t('auth.face2')}</div>
              </div>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'manageType',
    label: t('AuditCenter.AuditList.businessType'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.managementModelStr}</span>
        }
      }
    }
  },
  {
    field: 'mainProducts',
    label: t('auth.MainCategory'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.mainProducts}</span>
        }
      }
    }
  },
  {
    field: 'guarantor',
    label: t('AuditCenter.AuditList.guarantor'),
    formItemProps: {
      slots: {
        default: () => {
          return <span>{props.merchantData.guarantor}</span>
        }
      }
    }
  }
])
</script>
<style lang="less" scoped></style>
