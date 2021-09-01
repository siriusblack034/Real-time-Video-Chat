import Vue from 'vue'
import App from './App.vue'
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.config.productionTip = false
Vue.use(VueLoading);
new Vue({
  render: h => h(App),
}).$mount('#app')
