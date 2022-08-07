<template>
  <div class="com-page">
    <single-page></single-page>
  </div>
</template>

<script>
import Map from '@/components/Map.vue'
export default {
  name: 'MapPage',
  components: {
    'single-page': Map
  }
}
</script>

<style lang="less" scoped>

</style>