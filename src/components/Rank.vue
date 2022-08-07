<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
// 地区销售排行模块
export default {
  name: "Rank",
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,  //dataZoom区域缩放的起点
      endValue: 9,   //dataZoom区域缩放的终点
      timer: null
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
    clearInterval(this.timer)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk');
      const initOption = {
        title: {
          text: '▎地区销售排行',
          top: 20,
          left: 20
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        series: [
          // 指明图表类型
          {
            type: 'bar'
          }
        ]
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.moveInterval()
      })
    },
    async getRankData() {
      const {data: res} = await this.$http.get('rank')
      this.allData = res
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      console.log(res)
      this.upDataChart()
      // 数据获取完后开启定时器
      this.moveInterval()
    },
    upDataChart() {
      // 柱状图三种颜色渐变的起始颜色
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
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
        // 数据的区域缩放
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            // 对每一个柱子的样式进行调整
            itemStyle: {
              // arg可以拿到每一条柱的详细信息，包括名字，数值等
              color: (arg) => {
                let targetColor = null
                if(arg.value > 250) {
                  targetColor = colorArr[0]
                } else if(arg.value > 200) {
                  targetColor = colorArr[1]
                } else {
                  targetColor = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ])
              }
            }
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            // 柱宽
            barWidth: titleFontSize,
            // 柱的圆角
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    moveInterval() {
      // 保险操作，如果已经有定时器的话，将定时器清除
      if(this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.startValue ++
        this.endValue ++
        // this.allData.length是22
        if(this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.upDataChart()
      }, 2000)
    }
  },
};
</script>

<style lang="less" scoped></style>
