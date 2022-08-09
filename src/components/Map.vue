<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref" @dblclick="backChina"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
// 商家地图分部模块
import axios from 'axios'
// 导入硬核汉字转拼音的包/轮子
import {getProvinceMapInfo} from '@/utils/map_utils'
export default {
  name: 'Map',
  data() {
    return {
      chartInstance: null,
      allData: null,
      provinceData: {}  //存储第一次发请求时获取到的省的矢量数据，做一次缓存，下一次判断如果已经请求过的话就不用再请求了
    }
  },
  computed: {
    ...mapState(['Theme']),
  },
  watch: {
    Theme() {
      this.chartInstance.dispose()  //先要销毁当前的主题
      this.initChart()  //重新以最新的主题初始化图表对象，此时初始化对象的第二个参数已经更改为新的主题
      this.screenAdapter()   //更新图表的屏幕适配
      this.upDataChart()  //更新图表的展示
    }
  },
  mounted() {
    this.initChart()
    this.getMapData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.Theme)
      // 获取中国地图的矢量数据
      // 由于中国地图的矢量数据在前端端口上，所以不能用$http,需要借助axios发送新基础路径请求
      const res = await axios.get('http://localhost:8090/static/map/china.json')
      // console.log(res)
      // 注册地图的步骤
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'  //竖向排列
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        // 这个arg参数可以显示点击身份的信息
        // console.log(arg)
        const provinceInfo = getProvinceMapInfo(arg.name)
        // console.log(provinceInfo)
        if(! this.provinceData[provinceInfo.key]) {
          const res = await axios.get('http://localhost:8090' + provinceInfo.path)
          this.provinceData[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getMapData() {
      // 发请求获取数据，对this.allData进行赋值后，调用updataChart方法更新图表
      const {data: res} = await this.$http.get('map')
      this.allData = res
      // console.log(res)
      this.upDataChart()
    },
    upDataChart() {
      // 处理图表里的数据
      // 添加图例数据
      const legendArr = this.allData.map((item) => {
        return item.name
      })
      const seriesArr = this.allData.map((item) => {
        // return这个对象里面代表的是各个类别下的所有散点数据
        // 如果想在地图中显示散点的数据，需要给散点的图表添加一个配置：coordinateSystem: 'geo'
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 双击回到中国地图
    backChina() {
      const chinaOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(chinaOption)
    }
  }
}
</script>

<style lang="less" scoped>

</style>