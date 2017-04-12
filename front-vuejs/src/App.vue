<template>
  <div id="app-container">
    <div id="app">
      <!-- <div v-if="showNewGamePrompt" class="app-prompt-overlay">
        <div>
          <div class="app-prompt">
            <div class="md-display-1">Welcome to VuePente</div>
            <br>
            <md-button class="md-raised md-primary" @click="promptNewGame">Nouvelle partie</md-button>
          </div>
        </div>
      </div> -->
      <board :local-current-turn="localCurrentTurn" :board="board"></board>
    </div>
    <md-dialog md-open-from="#custom" md-close-to="#custom" ref="newGame">
      <md-dialog-title>Choisissez un mode de jeu</md-dialog-title>
      <md-dialog-content>
        <md-button class="md-primary" @click.native="closeDialog('newGame')">Local</md-button>
        <md-button class="md-primary" @click.native="closeDialog('newGame')">Remote</md-button>
      </md-dialog-content>
    </md-dialog>
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
    },
    promptNewGame: function () {
      this.showNewGameDialog = true
    },
    hideNewGamePrompt: function () {
      this.showNewGameDialog = false
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

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  position: relative;
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

.app-prompt {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  background-color: #fff;
  padding: 6px;
}

#app-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70%;
  width: 100%;
  padding: 24px 0;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Helvetica, sans-serif;
  text-align: center;
  position: relative;
}

</style>
