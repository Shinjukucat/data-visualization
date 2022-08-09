const theme = {
  // 这里存在原生HTML样式的组件有 ScreenPage.vue  Hot.vue  Trend.vue
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题的文字颜色
    titleColor: '#ffffff',
    // 左上角logo的图片路径
    logoSrc: 'logo_dark.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部的边框图片路径
    headerBorderSrc: 'header_border_dark.png'
  },
  vintage: {
    // 背景颜色
    backgroundColor: '#ffffff',
    // 标题的文字颜色 / 子组件中的标题文字颜色
    titleColor: '#000000',
    // 左上角logo的图片路径
    logoSrc: 'logo_light.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_light.png',
    // 页面顶部的边框图片路径
    headerBorderSrc: 'header_border_light.png'
  }
}
// 定义一个函数，根据传入的主题，返回对应的主题样式，实现原生HTML样式的切换
export function getThemeValue(themeValue) {
  return theme[themeValue]
}