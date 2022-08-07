<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
// 商家销售统计图表模块 —— 横向柱状图
export default {
  name: 'Seller',
  data() {
    return {
      chartInstance: null,  // echarts对象
      allData: null,   // 存储所有请求到的数据
      currentPage: 1,  //当前页数
      totalPage: 0,   //总页数
      timer: null,    //定时器的标识，方便清除定时器
    }
  },
  mounted() {
    // 在DOM加载完毕后就初始化echartsInstance对象
    this.initChart(),
    // 获取该图表的数据
    this.getSellerData()
    // 分辨率适配，监听浏览器屏幕变化
    window.addEventListener('resize', this.screenAdapter)
    // 在页面初次加载的时候(刷新的时候)也要主动进行屏幕适配，不然字体什么的还是初始化的大小，不是适配的大小
    this.screenAdapter()
  },
  destroyed() {
    // 在销毁组件的时候清除定时器
    clearInterval(this.timer)
    // 在销毁组件的时候，将监听器移除，避免内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartsInstancs对象
    initChart() {
      // init方法里面的第一个参数就是图表最终显示的Dom元素，第二个是主题的名字
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      // 对图表初始化配置的控制 initOption属于初始化配置
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        // 坐标轴的位置，调整图表的大小，位置
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true  //使得图表的四周距离中包括文字部分category和value
        },
        // 图表的横轴是值，纵轴的类目，类型是柱状图
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          trigger: 'axis',  //在鼠标移到坐标轴的时候 显示背景 和 详细信息小框
          axisPointer: {
            type: 'line',  //线形背景
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            // 在柱状图上显示文字数据
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
              }
            },
            // 每一个柱的样式
            itemStyle: {
              // 颜色渐变  通过echarts的线性渐变方法实现
              // x1 y1 x2 y2 用来指明颜色渐变的方向x1 y1确定原点坐标 x2 y2指明渐变末尾的坐标   [] 数组里用来指明不同百分比之下颜色的值，就是渐变从什么颜色到什么颜色
              // color: new this.$echarts.graphic.LinearGradient(x1, y1, x2, y2, [])  
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 0% 状态下颜色的值
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 100% 状态下颜色的值
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 给图表对象鼠标监听事件
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.pageInterval()   //鼠标移出的时候重启定时器
      })
    },
    // 获取数据
    async getSellerData() {
      // 商家销售统计图表的数据接口地址：http://127.0.0.1:8080/api/seller
      const {data: res} = await this.$http.get('seller')
      // console.log(res)
      this.allData = res
      // 数据处理
      this.allData.sort((a, b) => {
        return a.value - b.value  //对数据从小到大排序
      })
      // 每五个元素一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updataChart()
      // 在上面第一次更新图表后，启动定时器
      this.pageInterval()
    },
    // 更新图表
    updataChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showDate = this.allData.slice(start, end)
      const sellerName = showDate.map((item) => {
        return item.name
      })
      const sellerValues = showDate.map((item) => {
        return item.value
      })
      // dataOption仅仅用于装数据相关的  dataOption是获取数据之后的配置
      const dataOption = {
        yAxis: {
          data: sellerName
        },
        series: [
          {
            data: sellerValues,
          }
        ]
      }
      // option可以设置多次，新旧option是一个相互整合的机制，不是覆盖
      this.chartInstance.setOption(dataOption)
    },
    // 修改当前页数的定时器
    pageInterval() {
      // 保险操作，在创建新定时器之前判断是否已存在定时器
      if(this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentPage === this.totalPage ? this.currentPage = 1 : this.currentPage ++
        this.updataChart()
      }, 3000)
    },
    // 当浏览器大小发生变化时调用这个方法，来完成屏幕适配
    screenAdapter() {
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // console.log(titleFontSize)
      // 按下面这样配置。asapterOption里面全部都是和屏幕分辨率大小相关的配置了
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            // 每一个柱的样式
            itemStyle: {
              // 柱的圆角 数组里左上 右上 右下 左下
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 最后一步：必须要手动地调用图表对象的resize方法，才能产生实时适配屏幕效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>