<template>
  <div id="app">
    <h1>{{$t('food')}}{{$t('guide')}}</h1>
    <dashboard />
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import './assets/css/dianzan/iconfont.css'
import './assets/css/expressionless/iconfont.css'
import './assets/css/menu/iconfont.css'

export default {
  name: 'app',
  components: {
      Dashboard
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
