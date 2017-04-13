import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { matrix } from '../arrays'
import { BLACK, WHITE } from './color'

export const state = {
  game_done: false,
  board: matrix(),
  gameType: 'placeholder',
  current_turn: null,
  remoteInviteId: null,
  remoteGameId: null,
  pass_last_turn: false,
  captures: {
    [BLACK]: 0,
    [WHITE]: 0
  }
}

export const mutations = {
  NEW_LOCAL_GAME (state, size) {
    state.gameType = 'local'
    state.game_done = false
    state.board = matrix(size, size)
    state.current_turn = BLACK
    state.captures[BLACK] = 0
    state.captures[WHITE] = 0
    state.remoteGameId = null
    state.pass_last_turn = false
  }
}

export default new Vuex.Store({
  state,
  mutations
})
