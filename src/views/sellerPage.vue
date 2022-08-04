<template>
<!-- 该组件是针对 /sellerpage 这条路径而显示出来的，在这个组件里通过子组件的形式显示 sellerPage.vue组件 -->
  <div class="com-page">
    <Seller />
  </div>
</template>

<script>
import Seller from '@/components/Seller'
export default {
  data() {
    return {
      
    }
  },
  components: {
    Seller
  }
}
</script>

<style lang="less" scoped>

</style>