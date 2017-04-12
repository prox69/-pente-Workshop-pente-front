import { pass, playerTurn } from './actions'

import { currentTurn } from './getters'

export default class LocalGame {
  constructor (store) {
    this.store = store
  }

  pass () {
    pass(this.store)
  }

  play ({ x, y }) {
    playerTurn(this.store, x, y)
  }

  localCurrentTurn () {
    return currentTurn(this.store.state)
  }
}
