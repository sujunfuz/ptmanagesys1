<template>
  <div>
    <ContentWrap
      ><span class="">{{ t('ProblemFeedback.name1') }}{{ dataList?.questionStatusStr }}</span>
      <!-- <div v-if="secondTime > 0" class="mt-5px color-colorBlack font-size-16px"
        >{{ t('AuditCenter.AuditList.please') }}
        <CountDown :second-time="secondTime" class="font-size-16px color-red" />
        {{ t('ProblemFeedback.sub3') }}
      </div> -->
      <div class="mt-10px" v-if="dataList?.questionStatus == 'WAIT_DEAL'">
        <ElButton
          type="primary"
          v-hasPermi="'pfQuestionFeedback:pfQuestionFeedback:edit'"
          @click="openDialog(t('ProblemFeedback.back'), true)"
        >
          {{ t('ProblemFeedback.back') }}
        </ElButton>
      </div>
    </ContentWrap>
    <div class="w-100% flex-b mt-20px">
      <ContentWrap class="w-50%">
        <div>{{ t('serviceDetail.title2') }}</div>
        <div class="color-#7A7A7A font-size-15px mt-30px flex-c">
          <div class="w-70px text-right">{{ t('serviceDetail.name') }}:</div>
          <span class="ml-15px color-colorBlack" v-if="controlHide">{{ dataList?.userName }}</span>
          <span class="ml-15px color-colorBlack" v-else
            >{{ dataList?.userName.split('')[0] }}**</span
          >
          <Icon
            icon="ep:view"
            v-if="!controlHide"
            color="var(--el-color-primary)"
            @click="controlHide = !controlHide"
            class="ml-5px cursor-pointer"
          />
          <Icon
            icon="ep:hide"
            class="ml-5px cursor-pointer"
            v-else
            @click="controlHide = !controlHide"
          />
        </div>
        <div class="color-#7A7A7A font-size-15px mt-30px flex">
          <div class="w-70px text-right">{{ t('serviceDetail.iphone') }}:</div>
          <span class="ml-15px color-colorBlack">{{ dataList?.mobileNo }}</span></div
        >
      </ContentWrap>
      <ContentWrap class="w-50% ml-20px"
        ><div>{{ t('serviceDetail.title3') }}</div>
        <div>
          <div class="mt-15px" v-for="(item, key) in dataList?.questionRecords" :key="key">
            <div class="flex-c"
              ><div class="circleItem"></div
              ><span class="font-size-15px color-#393d44 ml-10px">{{ item.questionDetail }}</span>
            </div>
            <div class="line font-size-14px">
              <!-- {{ item.questionDetail }} -->
              <div class="flex flex-wrap" v-if="item.questionImages">
                <el-image
                  style="width: 100px; height: 100px"
                  class="mt-15px mb-15px mr-15px"
                  :src="imgUrl + item1"
                  fit="fill"
                  v-for="(item1, key1) in item.questionImages.split(',')"
                  :key="key1"
                />
              </div>
              <div class="font-size-14px mb-10px">{{ item.createTimeStr }}</div>
            </div>
          </div>
        </div>
      </ContentWrap>
    </div>
  </div>
  <ContentWrap class="mt-20px text-right">
    <ElButton @click="push('/OperationCenter/problemFeedback')">{{ t('common.back') }}</ElButton>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="180px">
    <el-form
      ref="ruleFormRef"
      label-position="top"
      label-width="100px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item :label="t('ProblemFeedback.back1')" prop="content" :required="true">
        <el-input
          maxlength="500"
          show-word-limit
          v-model="ruleForm.content"
          :rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="submitForm(ruleFormRef)">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElAvatar,
  ElTag,
  ElMessageBox,
  ElImage,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { ref, onMounted, unref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import CountDown from '../components/CountDown.vue'
import {
  questionDetailApi,
  admitReplyApi,
  postReplyQuestionApi
} from '@/api/pfQuestionFeedback/index'
import { useValidator } from '@/hooks/web/useValidator'
import type { FormInstance, FormRules } from 'element-plus'

const imgUrl = import.meta.env.VITE_IMG_URL

const ruleFormRef = ref<FormInstance>()

const { push, currentRoute } = useRouter()
const { required } = useValidator()

const saveLoading = ref(false)

const secondTime = ref(2000)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const openType = ref(false)
const { t } = useI18n()

const rules = reactive<FormRules<any>>({
  content: [{ required: true, message: t('common.required'), trigger: 'blur' }]
})

const id = ref()
onMounted(async () => {
  await getData()
})

interface RuleForm {
  content: ''
}

const ruleForm = reactive<RuleForm>({
  content: ''
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await postReplyQuestionApi({
        id: dataList.value.id,
        questionDetail: ruleForm.content
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        dialogVisible.value = false
        await getData()
      }
    } else {
    }
  })
}

const dataList = ref()

const getData = async () => {
  const id = currentRoute.value.query.id
  const res = await questionDetailApi({ id: id })
  dataList.value = res.data
}

const controlHide = ref(false)

const writeRef = ref<ComponentRef<typeof Write>>()
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      const res = await admitReplyApi({
        ...formData,
        id: dataList.value.id,
        agreeIs: openType.value
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        await getData()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}

const openDialog = (title, type) => {
  dialogTitle.value = title
  openType.value = type
  dialogVisible.value = true
}
</script>

<style scoped>
.circleItem {
  width: 10px;
  height: 10px;
  background-color: #0069e6;
  border: #0069e6 solid 1.5px;
  border-radius: 50%;
}

.line {
  border-left: #e6e6e6 solid 1px;
  margin-left: 5px;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #8b8b8b;
}
</style>
