<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div v-if="showNewGamePrompt" class="app-prompt-overlay">
      <div>
        <!-- <md-dialog-prompt
          :md-title="prompt.title"
          :md-ok-text="prompt.ok"
          v-model="value"
          @open="onOpen"
          @close="onClose"
          ref="newGame">
        </md-dialog-prompt> -->

        <md-dialog md-open-from="#custom" md-close-to="#custom" ref="newGame">
          <md-dialog-title>Choisissez un mode de jeu</md-dialog-title>
          <md-dialog-content>
            <md-button class="md-primary" @click.native="closeDialog('newGame')">Local</md-button>
            <md-button class="md-primary" @click.native="closeDialog('newGame')">Remote</md-button>
          </md-dialog-content>
        </md-dialog>

        <div class="app-prompt">
          <h5>Welcome to VueGo</h5>
          <!-- <mdl-button colored raised class="mdl-js-ripple-effect" @click="promptNewGame"> -->
            New Game
          <!-- </mdl-button> -->
        </div>
      </div>
    </div>
    <board :local-current-turn="localCurrentTurn" :board="board"></board>
  </div>

</template>

<script>

import Vue from 'vue'
import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

Vue.use(Vuex)
Vue.use(VueMaterial)

import Board from './game/Board'
import store from './game/store'
import LocalGame from './game/local_game'

export default {
  store,
  components: {
    Board,
    VueMaterial
  },
  data: () => ({
    value: '',
    prompt: {
      title: 'Mode de jeu',
      ok: 'Valider',
      id: 'mode',
      name: 'mode',
      placeholder: 'game mode...'
    }
  }),
  mounted () {
    this.$nextTick(() => {
      this.openDialog('newGame')
    })
  },
  methods: {
    openDialog (ref) {
      this.$refs[ref].open()
    },
    closeDialog (ref) {
      this.$refs[ref].close()
    },
    onOpen () {
      console.log('Opened')
    },
    onClose (type) {
      console.log('Closed', type)
    }
  },
  computed: {
    game: function () {
      switch (this.gameType) {
        case 'local':
          return new LocalGame(this.$store)
        case 'remote':
          // return new RemoteGame(this.$store)
          return null
        default:
          return null
      }
    },
    localCurrentTurn: function () {
      return this.game ? this.game.localCurrentTurn() : null
    },
    showNewGamePrompt: function () {
      return !this.showJoiningDialog && (!this.game || this.gameDone)
    },
    board () {
      return this.$store.getters.board
    },
    gameType () {
      return this.$store.getters.gameType
    }
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

.app-prompt-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.app-prompt-overlay > * {
  height: 100%;
  width: 70vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
