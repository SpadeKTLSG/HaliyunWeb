<template>
  <el-scrollbar class="menu-right-el">
    <el-menu
      :default-openeds="openeds"
      class="el-menu-vertical-demo"
    >
      <SubMenuItem
        v-for="(item, index) in expandMenu"
        :key="index"
        :expand-menu="item"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import SubMenuItem from './main-sidebar-sub-menu-item.vue'
import {useCommonStore} from "@/layout/common.js";

defineProps({
  expandMenu: {
    type: Array,
    default: () => []
  }
})

const commonStore = useCommonStore()
const openeds = computed(() => commonStore.menuIds)
</script>

<style scoped>
.menu-right-el {
  background-color: #fff;
  width: 130px !important;
  border-top: 1px solid #ebedf0;
  height: calc(100vh - 50px);
  overflow-y: auto;
}

.el-menu-vertical-demo {
  border: none;
  height: 100%;
}
</style>
