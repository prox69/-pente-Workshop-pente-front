<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
       width="760" height="760"
       class="board"
       :class="{ 'hover': hover }"
       preserveAspectRatio="xMidYMid meet"
       @mousemove="mouseMove">
    <grid></grid>
    <!-- <g>
      <stone v-for="s in stones" :x="pointToCoordinate(s.x)" :y="pointToCoordinate(s.y)" :color="s.color"></stone>
    </g>
    <g v-if="hover">
      <stone class="hover-stone" :x="pointToCoordinate(hover.x)" :y="pointToCoordinate(hover.y)" :color="hover.color"></stone>
    </g> -->
    <g v-if="hover">
      <stone class="hover-stone" :x="pointToCoordinate(hover.x)" :y="pointToCoordinate(hover.y)" :color="hover.color"></stone>
    </g>
  </svg>
</template>

<script>

import Grid from './Grid'

import { SCALE } from './const'

export default {
  components: {
    Grid
  },
  props: {
    localCurrentTurn: String,
    board: Array
  },
  data () {
    return {
      hover: null
    }
  },
  computed: {
    cellSize: function () {
      return SCALE
    }
  },
  methods: {
    mouseMove: function (event) {
      if (!this.localCurrentTurn) {
        return
      }

      let p = this.eventPoint(event)
      this.hover = this.isValidPoint(p) ? { x: p.x, y: p.y, color: this.localCurrentTurn } : null
    },
    isValidPoint (p) {
      let { x, y } = p
      return x >= 0 && y >= 0 && x < 19 && y < 19
    },
    coordinateToPoint: function (x) {
      return Math.round((x - this.cellSize / 2) / this.cellSize)
    }
  }
}

</script>

<style scoped>
.board {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 300px;
}

.board.hover {
  cursor: grabbing;
}

.hover-stone {
  fill-opacity: .75;
}
</style>
