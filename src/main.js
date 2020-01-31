import Vue from 'vue'
import { i18n } from './config'
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App.vue'

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAduFigEVOHxfA42OoMSLspg9vBBEgkxKo',
        libraries: 'places'
    }
})

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app')
