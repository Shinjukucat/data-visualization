<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    // 在DOM加载完毕后就初始化echartsInstance对象
    this.initChart(),
    // 获取该图表的数据
    this.getSellerData()
  },
  methods: {
    // 初始化echartsInstancs对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    async getSellerData() {
      // 商家销售统计图表的数据接口地址：http://127.0.0.1:8080/api/seller
      const result = await this.$http.get('seller')
      console.log(result)
    }
  }
}
</script>

<style lang="less" scoped>

</style>