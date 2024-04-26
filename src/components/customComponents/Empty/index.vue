<template>
  <div>
    <el-empty :image="emptyBack" />
  </div>
</template>

<script setup lang="tsx">
import { ElEmpty } from 'element-plus'
import emptyBack from '@/assets/imgs/emptyBack.png'

// const imgUrl = import.meta.env.VITE_IMG_URL
</script>

<style lang="less" scoped>
::v-deep .el-empty_image img {
  width: 250px !important;
}
</style>
