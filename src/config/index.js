import Vue from 'vue'
import i18n from './i18n'
import { data } from './data'

let formatDate = (time) => {
    let _date = new Date(time)
    let year = _date.getFullYear()
    let month = _date.getMonth() + 1
    let date = _date.getDate()
    if (month.toString().length === 1) {
        month = '0' + month
    }
    if (date.toString().length === 1) {
        date = '0' + date
    }
    return `${year}-${month}-${date}`
}

let addHourTime = (time, hour) => {
    let [h, m , s] = time.split(':')
    h = Number(h) + hour
    return `${h}:${m}:${s}`
}

Vue.prototype.CONFIG = {
    lang: i18n.locale,
    ua: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent) ? 'mobile' : 'pc',
    data,
    formatDate,
    addHourTime
}

Vue.config.productionTip = false

export {
    i18n
}
