<template>
  <circle :r="size" :cx="x" :cy="y" v-bind:class="{ 'white-stone': isWhite, 'black-stone': isBlack }"></circle>
</template>

<script>
import { BLACK, WHITE } from './color'
import { SCALE } from './const'

export default {
  props: ['x', 'y', 'color'],
  computed: {
    isBlack: function () {
      return this.color === BLACK
    },
    isWhite: function () {
      return this.color === WHITE
    },
    size: function () {
      return SCALE / 2
    }
  }
}
</script>

<style>

.black-stone {
  fill: black;
  stroke: black;
}

.white-stone {
  fill: white;
  stroke: black;
}

</style>
