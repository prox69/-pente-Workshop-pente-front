<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
    class="board"
    ref="board"
    :view-box.camel="viewBox"
    v-bind:class="{ hover: hover }"
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
import Stone from './Stone'

import { SCALE } from './const'

import mapValues from 'lodash/fp/mapValues'

export default {
  components: {
    Grid,
    Stone
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
    viewBox: function () {
      return `0 0 380 380`
    },
    cellSize: function () {
      return SCALE
    }
  },
  methods: {
    mouseMove: function (event) {
      // if (!this.localCurrentTurn) {
      //   return
      // }

      let p = this.eventToPoint(event)
      this.hover = this.isValidPoint(p) ? { x: p.x, y: p.y, color: 'black' } : null
    },
    mouseLeave: function () {
      this.hover = null
    },
    isValidPoint (p) {
      let { x, y } = p
      return x >= 0 && y >= 0 && x < 19 && y < 19
    },
    pointToCoordinate: function (x) {
      let cs = this.cellSize
      return x * cs + cs / 2.0
    },
    coordinateToPoint: function (x) {
      return Math.round((x - this.cellSize / 2) / this.cellSize)
    },
    eventToPoint: function (event) {
      let point = this.$el.createSVGPoint()
      point.x = event.clientX
      point.y = event.clientY

      let ctm = this.$refs.board.getScreenCTM()

      let { x, y } = point.matrixTransform(ctm.inverse())

      return mapValues(a => this.coordinateToPoint(a))({ x, y })
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
