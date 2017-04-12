export function playerTurn ({dispatch}, x, y) {
  dispatch('PLAYER_TURN', x, y)
}

export function pass ({dispatch}) {
  dispatch('PASS_TURN')
}
