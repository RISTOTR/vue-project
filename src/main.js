import Vue from 'vue'
import router from './router/index.js'
import './plugins/vuetify'
import App from './App.vue'
import Vcarousel from 'vuetify'
import Datepicker from 'vuejs-datepicker';
import { store } from './store'


Vue.config.productionTip = false

Vue.component('Vcarousel', Vcarousel, 'Datepicker', Datepicker)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
