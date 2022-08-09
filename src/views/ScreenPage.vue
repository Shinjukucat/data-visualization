<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <!-- <img :src="headerSrc" alt=""> -->
        <img src="/static/img/header_border_dark.png" alt="">
      </div>
      <span class="logo">
        <!-- <img :src="logoSrc" alt="" /> -->
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">通用平台实时监控系统</span>
      <div class="title-right">
        <!-- <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme"> -->
        <img src="/static/img/qiehuan_dark.png" class="qiehuan" @click="handleChangeTheme">
        <span class="datetime">{{systemDateTime}}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullScreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <img :src="[fullScreenStatus.trend ? `/static/img/compress.svg` : `/static/img/expand.svg`]" alt="" @click="changeSize('trend')">
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullScreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <img :src="[fullScreenStatus.seller ? `/static/img/compress.svg` : `/static/img/expand.svg`]" alt="" @click="changeSize('seller')">
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top"  :class="[fullScreenStatus.map ? 'fullScreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <img :src="[fullScreenStatus.map ? `/static/img/compress.svg` : `/static/img/expand.svg`]" alt="" @click="changeSize('map')">
          </div>
        </div>
        <div id="middle-bottom"  :class="[fullScreenStatus.rank ? 'fullScreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <img :src="[fullScreenStatus.rank ? `/static/img/compress.svg` : `/static/img/expand.svg`]" alt="" @click="changeSize('rank')">
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullScreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <img :src="[fullScreenStatus.hot ? `/static/img/compress.svg` : `/static/img/expand.svg`]" alt="" @click="changeSize('hot')">
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullScreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <img :src="[fullScreenStatus.stock ? `/static/img/compress.svg` : `/static/img/expand.svg`]" alt="" @click="changeSize('stock')">
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Trend from '@/components/Trend.vue'
import Seller from '@/components/Seller'
import Map from '@/components/Map'
import Rank from '@/components/Rank'
import Hot from '@/components/Hot'
import Stock from '@/components/Stock'
import {mapState} from 'vuex'
import {getThemeValue} from '@/utils/theme_utils'
export default {
  data() {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      },
      // 当前的系统时间
      systemDateTime: null,
      // 用于保存当前系统日期的定时器id
      timerID: null,
    }
  },
  mounted() {
    this.currentTime()
  },
  destroyed() {
    clearInterval(this.timerID)
  },
  components: {
    Trend,
    Seller,
    Map,
    Rank,
    Hot,
    Stock,
    Seller
  },
  methods: {
    changeSize(chartName) {
      // 1. 改变该图表在fullScreenStatus中的状态
      this.fullScreenStatus[chartName] = ! this.fullScreenStatus[chartName]
      // 2. 需要调用对应图表组件里的screenAdapter方法
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()  //拿到$refs后在里面找对应的chartName
        // this.$refs.chartName.screenAdapter()
      })
    },
    // 切换主题
    handleChangeTheme() {
      this.$store.commit('changeTheme')
    },
    currentTime() {
      this.systemDateTime = new Date().toLocaleString()

      this.timerID && clearInterval(this.timerID)

      this.timerID = setInterval(() => {
        this.systemDateTime = new Date().toLocaleString()
      }, 1000)
    },
  },
  computed: {
    ...mapState['Theme'],
    // 下面四个计算属性有bug，用不了
    logoSrc() {
      return '/static/img/' + getThemeValue(this.Theme).logoSrc
    },
    headerSrc() {
      return '/static/img/' + getThemeValue(this.Theme).headerBorderSrc
    },
    themeSrc() {
      return '/static/img/' + getThemeValue(this.Theme).themeSrc
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.Theme).backgroundColor,
        color: getThemeValue(this.Theme).titleColor,
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 展开为全屏样式的定义
.fullScreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;

  img {
    width: 15px;
  }
}
</style>