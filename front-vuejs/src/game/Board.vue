<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
       width="760" height="760"
       class="board"
       :class="{ 'hover': hover }"
       preserveAspectRatio="xMidYMid meet">
    <grid></grid>
    <!-- <g>
      <stone v-for="s in stones" :x="pointToCoordinate(s.x)" :y="pointToCoordinate(s.y)" :color="s.color"></stone>
    </g>
    <g v-if="hover">
      <stone class="hover-stone" :x="pointToCoordinate(hover.x)" :y="pointToCoordinate(hover.y)" :color="hover.color"></stone>
    </g> -->
  </svg>
</template>

<script>

import Grid from './Grid'

export default {
  components: {
    Grid
  },
  props: {
    board: Array
  },
  data () {
    return {
      hover: null
    }
  },
  methods: {
  },
  computed: {
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
</style>
