import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TagView {
  path: string
  name: string
  title: string
  affix?: boolean // 固定标签
}

export const useTagsStore = defineStore('tags', () => {
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<string[]>([])

  // 固定的标签页
  const affixTags = computed(() => visitedViews.value.filter(tag => tag.affix))

  function addView(view: RouteLocationNormalized) {
    addVisitedView(view)
    addCachedView(view)
  }

  function addVisitedView(view: RouteLocationNormalized) {
    if (visitedViews.value.some(v => v.path === view.path)) return

    visitedViews.value.push({
      path: view.path,
      name: view.name as string,
      title: view.meta.title as string,
      affix: view.meta.affix as boolean
    })
  }

  function addCachedView(view: RouteLocationNormalized) {
    if (cachedViews.value.includes(view.name as string)) return
    if (view.meta.cache) {
      cachedViews.value.push(view.name as string)
    }
  }

  function delView(view: RouteLocationNormalized) {
    return new Promise(resolve => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  function delVisitedView(view: RouteLocationNormalized) {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  function delCachedView(view: RouteLocationNormalized) {
    const index = cachedViews.value.indexOf(view.name as string)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  function delOthersViews(view: RouteLocationNormalized) {
    return new Promise(resolve => {
      delOthersVisitedViews(view)
      delOthersCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  function delOthersVisitedViews(view: RouteLocationNormalized) {
    visitedViews.value = visitedViews.value.filter(v => {
      return v.affix || v.path === view.path
    })
  }

  function delOthersCachedViews(view: RouteLocationNormalized) {
    const index = cachedViews.value.indexOf(view.name as string)
    if (index > -1) {
      cachedViews.value = cachedViews.value.slice(index, index + 1)
    } else {
      cachedViews.value = []
    }
  }

  function delAllViews() {
    return new Promise(resolve => {
      delAllVisitedViews()
      delAllCachedViews()
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  function delAllVisitedViews() {
    visitedViews.value = visitedViews.value.filter(tag => tag.affix)
  }

  function delAllCachedViews() {
    cachedViews.value = []
  }

  return {
    visitedViews,
    cachedViews,
    affixTags,
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delAllViews
  }
})
