<template>
  <div id="app">
    <img src="./assets/logo.png">
    <board></board>
  </div>

</template>

<script>

import Board from './game/Board'
import store from './game/store'

export default {
  store,
  components: {
    Board
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
  margin-top: 60px;
}
</style>
