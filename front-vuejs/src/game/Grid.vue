<template>
  <svg>
    <line v-for="x in centers" :x1="pointToCoordinate(x)" :x2="pointToCoordinate(x)" :y1="pointToCoordinate(0)" :y2="pointToCoordinate(18)" stroke="black" stroke-width="1"></line>
    <line v-for="y in centers" :y1="pointToCoordinate(y)" :y2="pointToCoordinate(y)" :x1="pointToCoordinate(0)" :x2="pointToCoordinate(18)" stroke="black" stroke-width="1"></line>
    <circle cx="70" cy="70" r="4"></circle>
    <circle cx="190" cy="70" r="4"></circle>
    <circle cx="310" cy="70" r="4"></circle>
    <circle cx="70" cy="190" r="4"></circle>
    <circle cx="190" cy="190" r="4"></circle>
    <circle cx="310" cy="190" r="4"></circle>
    <circle cx="70" cy="310" r="4"></circle>
    <circle cx="190" cy="310" r="4"></circle>
    <circle cx="310" cy="310" r="4"></circle>
  </svg>
</template>

<script>

import range from 'lodash/fp/range'

export default {
  data () {
    return {
      msg: 'Jeu de pente'
    }
  },
  methods: {
    pointToCoordinate: function (x) {
      return x * 20 + 20 / 2.0
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
