<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Stock',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,  //这里有十条数据，每次显示五条，这个属性用来控制数据切换
      timer: null  //控制数据切换的定时器
    }
  },
  mounted() {
    this.initChart()
    this.getStockData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.changeInterval()
      })
    },
    async getStockData() {
      const {data : res} = await this.$http.get('stock')
      console.log(res)
      this.allData = res
      this.upDataChart()
      this.changeInterval()
    },
    upDataChart() {
      // 控住五个圆环的位置，x，y圆点坐标
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          radius: [110, 100],  //通过给饼图设置两个半径内圆半径和外圆半径来实现圆环效果
          center: centerArr[index],
          hoverAnimation: false,  //移除鼠标移入时的动画效果
          labelLine: {
            show: false   //隐藏指示线
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            // 圆环图中有两个数据：销量和库存，圆环左边数据是库存，右边数据是销量
            {
              // 销量 右边
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              // 库存  左边
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2
      const outerRadius = titleFontSize * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          // 五个圆环的半径自适应配置
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    changeInterval() {
      if(this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentIndex === 0 ? this.currentIndex = 1 : this.currentIndex = 0
        this.upDataChart()  //在更改玩currentIndex后一定要更新界面
      }, 5000);
    }
  }
}
</script>

<style lang="less" scoped>

</style>