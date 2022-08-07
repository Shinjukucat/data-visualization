<template>
  <div class="com-page">
    <Trend />
  </div>
</template>

<script>
import Trend from '@/components/Trend'
export default {
  name: 'TrendPage',
  components: {
    // 这里kv同名简写
    Trend
  }
}
</script>

<style lang="less" scoped>

</style>