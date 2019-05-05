export default {
  namespaced: true,
  state: {
    isMobile: false,
    isShowMenu:true,//是否显示菜单、导航等操作
    // 全局配置不同服务名称例如：sifc-sms sifc-bdmp sifc-dep
    service_sms:'sifc-sms1',
    service_bdmp:'sifc-bdmp',
    service_dep:'sifc-dep123',
    // over
    theme: 'dark',
    layout: 'side',
    systemName: '人社社保',
    copyright: '',
    footerLinks: [],
    multipage: true
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultipage (state, multipage) {
      state.multipage = multipage
    }
  }
}
