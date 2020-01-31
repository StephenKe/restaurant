import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '../assets/js/lang'

Vue.use(VueI18n)

let lang = window.sessionStorage.getItem('LANG') || window.navigator.language

if (~lang.indexOf('zh')) {
    lang = 'zh'
} else if (~lang.indexOf('en')) {
    lang = 'en'
} else {
    lang = 'en'
}

export default new VueI18n({
    locale: lang,
    messages
})