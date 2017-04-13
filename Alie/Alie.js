/********************** INTELLIGENCE ARTIFICIELLE DU JEU ***************************/

class Alie {
	constructor(players) {
		this.board = null;
		this.winRateTable = null;
		this.AMC = new AlieMonteCarlo();
		this.players = players;
		this.lastPlayedStrike = [];
	}

	// Initialisation du board à analyser
	initializeBoard(board) {
		this.board = board;
		this.initializeWinRateTable(Game.cloneBoard(board));
		this.AMC.board = board;
	}

	// Generation de la table de WinRate
	generateWinRateTable() {
		// Parcours du board
		var empty_coords = Game.getAllEmptyCoords(this.board, undefined, this.lastPlayedStrike, 2);
		var instance = this;
		
		for(var i = 0; i < empty_coords.length; i++) {
		//if(empty_coords[i][0] == 1 && empty_coords[i][1] == 4) {
			this.AMC.initialize(empty_coords[i][0], empty_coords[i][1], this.board, this.players);
			this.AMC.run(function(wins, playouts) {
				var winRate = Math.ceil((wins/playouts)*100);
				// Script de défense
				winRate = instance.triggerDefense(empty_coords[i], winRate);
				instance.winRateTable[empty_coords[i][0]][empty_coords[i][1]] = winRate;
			});
		//}	
		}
	}

	// Script de défense
	triggerDefense(coords, winRate) {
		// Défense pour 4
		var check4 = Game.checkAlignment(coords[0], coords[1], this.board, this.players.opponent, 4);
		for(var i = 0; i < 8; i++) {
			if(check4[i] >= 4) {
				winRate = winRate * 2;
			}
			else if(check4[i] >= 3) {
				winRate = winRate * 1.3;
			}
		}

		return winRate;
	}

	// Récupération du meilleur coup selon la WinRateTable
	getBestStrike() {
		var bestStrike = [];
		var bestStrikeWinRate = 0;
		for(var j = 0; j < this.winRateTable.length; j++) {
			for(var k = 0; k < this.winRateTable[j].length; k++) {
				if(this.winRateTable[j][k] != 'X' && this.winRateTable[j][k] >= bestStrikeWinRate) {
					bestStrikeWinRate = this.winRateTable[j][k];
					bestStrike = [j,k];
				}
			}
		}

		this.lastPlayedStrike = bestStrike;
		return bestStrike;
	}

	// Initialisation de la table de WinRate
	initializeWinRateTable(board) {
		this.winRateTable = board;
		for(var i = 0; i < board.length; i++) {
			for(var j = 0; j < board[i]; j++) {
				if(this.board[i][j] == 1 || this.board[i][j] == 2) {
					this.board[i][j] = 'X';
				}
			}	
		}
	}






}