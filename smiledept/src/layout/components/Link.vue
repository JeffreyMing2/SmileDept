<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

const props = defineProps<{
  to: string
}>()

const type = computed(() => {
  return isExternal(props.to) ? 'a' : 'router-link'
})

function linkProps(to: string) {
  if (isExternal(to)) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to
  }
}
</script>
