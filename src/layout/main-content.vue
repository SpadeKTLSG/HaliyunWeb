<template>
  <div>
    <el-card
      v-if="route.meta.isTab"
      class="main-head"
    >
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="(item, index) in selectMenu"
          :key="index"
          class="breadcrumb-item"
        >
          <span>{{ item }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <main
      :class="{ 'site-content--tabs': route.meta.isTab }"
      class="site-content"
    >
      <!-- 如果这不是首页 -->
      <el-card
        v-if="homeHidden"
        :style="siteContentViewHeight"
        class="card-content-h"
        style="border-radius: 0 !important; box-shadow: none"
      >
        <router-view />
      </el-card>
      <div v-else>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import {ArrowRight} from '@element-plus/icons-vue'
import {useCommonStore} from "@/layout/common.js";

const route = useRoute()
const documentClientHeight = ref(document.documentElement.clientHeight)

window.addEventListener('resize', () => {
  documentClientHeight.value = document.documentElement.clientHeight
})

const siteContentViewHeight = computed(() => {
  let height = documentClientHeight.value - 50 - 30 - 2
  if (route.meta.isTab) {
    height -= 40
    return isURL(route.meta.iframeUrl) ? {height: height + 'px'} : {minHeight: height + 'px'}
  }
  return {minHeight: height + 'px'}
})

const commonStore = useCommonStore()
const selectMenu = computed(() => commonStore.selectMenu)
const homeHidden = computed(() => route.name !== 'home')
</script>

<style scoped>
.main-head {
  background: #ffffff;
  width: 100%;
  height: 40px;
  position: fixed;
  top: 50px;
  z-index: 10;
  display: flex;
  align-items: center;
  border-radius: 0;
  box-shadow: none;
  border-top: none;
}

.breadcrumb-item:last-child span {
  color: #155bd4 !important;
}

.card-content-h {
  min-height: calc(100vh - 50px - 60px - 20px);
}
</style>
