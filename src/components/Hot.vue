<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="arr-left" @click="toLeft" :style="comStyle">＜</span>
    <span class="arr-right" @click="toRight" :style="comStyle">＞</span>
    <span class="pieTitle" :style="comStyle">{{pieTitle}}</span>
  </div>
</template>

<script>
// 热销商品占比模块
export default {
  name: 'Hot',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPie: 0,  //当前所处的是哪个一级分类的图表
      titleFontSize: 0
    }
  },
  mounted() {
    this.initChart()
    this.getHotData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    pieTitle() {
      // 这里的判断有没有allData很重要，不然数据还没请求回来的时候会找allData报错
      if(! this.allData) {
        return ''
      } else {
        return this.allData[this.currentPie].name
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children
            let totalValue = 0
            thirdCategory.forEach(item => {
              totalValue += item.value
            });
            let resStr = ''
            thirdCategory.forEach(item => {
              resStr += `${item.name} : ${parseInt(item.value / totalValue * 100)  + '%'}<br/>`
            })
            return resStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            // emphasis是当饼图中的某块处于高亮状态(鼠标移上去的时候)才会触发的效果
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    async getHotData() {
      const {data : res} = await this.$http.get('hotproduct')
      console.log(res)
      this.allData = res
      this.upDataChart()
    },
    upDataChart() {
      const legendData = this.allData[this.currentPie].children.map(item => {
        return item.name
      })
      const seriesData = this.allData[this.currentPie].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          // 这里添加的属性都会同步到arg属性下的data属性中，这里将三级属性作为children同步进去，就可以在tooltip中使用该属性了
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidh: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft() {
      this.currentPie > 0 ? this.currentPie -- : this.currentPie = this.allData.length - 1
      this.upDataChart()
    },
    toRight() {
      this.currentPie < this.allData.length - 1 ? this.currentPie ++ : this.currentPie = 0
      this.upDataChart()
    }
  }
}
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #FFF;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #FFF;
}
.pieTitle {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #FFF;
}
</style>