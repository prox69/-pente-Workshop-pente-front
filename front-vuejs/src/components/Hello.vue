<template>
  <div>
    <h1>{{ msg }}</h1>
    <br>
    <svg width="760" height="760">
      <line v-for="x in centers" :x1="pointToCoordinate(x)" :x2="pointToCoordinate(x)" :y1="pointToCoordinate(0)" :y2="pointToCoordinate(18)" stroke="black" stroke-width="1"></line>
      <line v-for="y in centers" :y1="pointToCoordinate(y)" :y2="pointToCoordinate(y)" :x1="pointToCoordinate(0)" :x2="pointToCoordinate(18)" stroke="black" stroke-width="1"></line>
      <circle cx="380" cy="380" r="4"></circle>
      <!-- <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /> -->
    </svg>
  </div>
</template>

<script>

import range from 'lodash/fp/range'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Jeu de pente'
    }
  },
  methods: {
    pointToCoordinate: function (x) {
      return x * 40 + 40 / 2.0
    }
  },
  computed: {
    centers: function () {
      return range(0)(19)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
