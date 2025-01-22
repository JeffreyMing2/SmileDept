<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu($event, tag)"
      >
        {{ tag.title }}
        <el-icon
          v-if="!tag.affix"
          class="close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </scroll-pane>

    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭当前
      </li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'
import { useTagsStore } from '@/stores/tags'
import ScrollPane from './ScrollPane.vue'
import type { TagView } from '@/stores/tags'

const route = useRoute()
const router = useRouter()
const tagsStore = useTagsStore()
const scrollPaneRef = ref()

// 右键菜单相关
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>()

const visitedViews = computed(() => tagsStore.visitedViews)

function isActive(tag: TagView) {
  return tag.path === route.path
}

function isAffix(tag: TagView) {
  return tag.affix
}

function addTags() {
  const { name, path, meta, fullPath, query } = route
  if (name) {
    tagsStore.addView({
      name: name as string,
      path,
      meta,
      fullPath,
      query
    })
  }
}

function refreshSelectedTag(view: TagView) {
  router.replace({
    path: '/redirect' + view.path,
    query: view.query
  })
}

async function closeSelectedTag(view: TagView) {
  const { visitedViews } = await tagsStore.delView(view)
  if (isActive(view)) {
    toLastView(visitedViews, view)
  }
}

function closeOthersTags(view: TagView) {
  router.push(view)
  tagsStore.delOthersViews(view)
}

function closeAllTags(view: TagView) {
  tagsStore.delAllViews().then(({ visitedViews }) => {
    if (isAffix(view)) {
      return
    }
    toLastView(visitedViews, view)
  })
}

function toLastView(visitedViews: TagView[], view: TagView) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.path })
    } else {
      router.push('/')
    }
  }
}

function openMenu(e: MouseEvent, tag: TagView) {
  const menuMinWidth = 105
  const offsetLeft = e.currentTarget.getBoundingClientRect().left
  const offsetWidth = (e.currentTarget as HTMLElement).offsetWidth
  const maxLeft = window.innerWidth - menuMinWidth
  left.value = offsetLeft + offsetWidth / 2
  if (left.value > maxLeft) {
    left.value = maxLeft
  }
  top.value = e.currentTarget.getBoundingClientRect().top + 20
  visible.value = true
  selectedTag.value = tag
}

function closeMenu() {
  visible.value = false
}

function handleScroll() {
  closeMenu()
}

watch(
  () => route.path,
  () => {
    addTags()
  }
)

onMounted(() => {
  addTags()
  document.addEventListener('click', closeMenu)
  document.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
  document.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: var(--el-color-primary);
        color: #fff;
        border-color: var(--el-color-primary);

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }

        .close-icon {
          color: #fff;
        }
      }

      .close-icon {
        width: 16px;
        height: 16px;
        vertical-align: -3px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        color: #666;

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
