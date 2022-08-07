<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Rank",
  data() {
    return {
      chartInstance: null,
      allData: null,
    };
  },
  mounted() {
    this.initChart();
    this.getRankData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref);
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          // 指明图表类型
          {
            type: 'bar'
          }
        ]
      };
      this.chartInstance.setOption(initOption);
    },
    async getRankData() {
      const {data: res} = await this.$http.get('rank')
      this.allData = res
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      console.log(res)
      this.upDataChart();
    },
    upDataChart() {
      // 横坐标所有省份的数据
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      // 纵坐标各个省份对应的value数据
      const valueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        series: [
          {
            data: valueArr
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style lang="less" scoped></style>
