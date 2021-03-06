import Vue from 'vue'
import router from './router/index.js'
import './plugins/vuetify'
import App from './App.vue'
import * as firebase from 'firebase'
import Vcarousel from 'vuetify'
import Datepicker from 'vuejs-datepicker'
import { store } from './store'
import DateFilter from './filters/date'
import Alertcmp from './components/shared/Alert'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'



Vue.config.productionTip = false

Vue.filter('date', DateFilter)

Vue.component('Vcarousel', Vcarousel, 'Datepicker', Datepicker)
Vue.component('app-alert', Alertcmp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-details-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-details-time-dialog', EditMeetupTimeDialog)

new Vue({
  render: h => h(App),
  router,
  store,
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAKHbm091MMAf4stFX-zIHKFSEj4WWGZbw',
      authDomain: 'vue-devmeetup-3d4c9.firebaseapp.com',
      databaseURL: 'https://vue-devmeetup-3d4c9.firebaseio.com',
      projectId: 'vue-devmeetup-3d4c9',
      storageBucket: 'gs://vue-devmeetup-3d4c9.appspot.com',
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
      }
    })
    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')
