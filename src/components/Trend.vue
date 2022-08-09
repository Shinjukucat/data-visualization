<template>
  <div class="com-container">
    <div class="title" :style="titleStyle">
      <span>{{'▎' + showSelectTitle}}</span>
      <!-- <span class="iconfont"∨>&#xe6eb;</span> -->
      <span class="title-icon" @click="showSelect">∨</span>
      <div class="select-con" v-show="isShow" :style="marginType">
        <div class="select-item" v-for="item in selectType" :key="item.key" @click="handleSelect(item.key)">{{item.text}}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '@/utils/theme_utils'
// 销量趋势图表模块
export default {
  name: 'Trend',
  data() {
    return {
      chartInstance: null,
      allData: null,
      isShow: false,  //是否显示下拉菜单
      choiceType: 'map',  //选择展示哪个图表
      titleFontSize: 0    //控制标题文字的大小
    }
  },
  mounted() {
    // 在页面DOM加载完毕后，要先初始化图表对象，然后获取数据
    this.initChart()
    this.getTrendData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()  //一开始的时候这里主动调用一下分辨率的计算，做一下屏幕适应，解决一些情况下的bug
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    ...mapState(['Theme']),
    selectType() {
      if(! this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => {
          // 利用过滤器将选中的那个type剔除掉，在遍历所有type的时候去掉选中的type
          return item.key !== this.choiceType
        })
      }
    },
    showSelectTitle() {
      if(! this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 因为文字部分不是使用echarts的方法设置的，所以需要另外动态设置样式来实现自适应
    titleStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.Theme).titleColor
      }
    },
    // 解决下拉框里面的文字不对齐的问题
    marginType() {
      return {
        marginLeft: this.titleFontSize / 2 + 'px'
      }
    },
  },
  watch: {
    Theme() {
      this.chartInstance.dispose()  //先要销毁当前的主题
      this.initChart()  //重新以最新的主题初始化图表对象，此时初始化对象的第二个参数已经更改为新的主题
      this.screenAdapter()   //更新图表的屏幕适配
      this.upDataChart()  //更新图表的展示
    }
  },
  methods: {
    initChart() {
      // 下面这句初始化了一个echart实例对象并将其赋值给chartInstance，让chartInstance来代表这个实例对象
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.Theme)
      const initOption = {
        // grid配置坐标轴大小
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true  //让距离中带上文字部分，不然底部类目的文字都显示不出来了
        },
        // tooltip工具栏效果
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false  //是否需要间距效果(这里指的是数据线距左边需不需要距离)
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getTrendData() {
      // 发请求
      // 保存到allData
      const {data : res} = await this.$http.get('trend')
      // console.log(res)
      this.allData = res
      this.upDataChart()
    },
    upDataChart() {
      // 五个折线的渐变颜色
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      // x轴类目轴数据
      const timeArr = this.allData.common.month
      // y轴数据 就是series下的数据
      const valueArr = this.allData[this.choiceType].data
      // seriesArr里面就是其中一个分类下的五个城市的折线数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          // 下面这句实现堆叠图的图表形式，让每条数据的stack值相同就可以了
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },  //0%的颜色值
              {
                offset: 1,
                color: colorArr2[index]
              }  //100%的颜色值
            ])
          }
        }
      })
      const cityArr = valueArr.map((item) => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        // legend是用来显示比如这里上面的上海北京...五个个小图标
        legend: {
          data: cityArr
        },
        // seriesArr叫做图例的数据
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      // 分辨率适配只有标题和五个图例及其文字大小就可以了，因为图表大小已经在initOption里面通过%的形式实现了自适应
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 控制下拉菜单的展示与否
    showSelect() {
      this.isShow = ! this.isShow
    },
    // 点击哪个type就把显示哪个type的数据
    handleSelect(currentType) {
      this.choiceType = currentType
      this.upDataChart()
      this.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  z-index: 10;
  color: white;
  top: 20px;
  left: 20px;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-con {
    background-color: #222733;
  }
}
</style>