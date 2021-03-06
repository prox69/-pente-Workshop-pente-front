
class Game {
	constructor(board, playerTurn) {
		this.board = board;
		this.playerTurn = playerTurn;
		this.nbTenailles = {
			"player1" : 0, 
			"player2" : 0 
		};
		this.coordsTenailles = [],
		this.winner = 0;
	}

	// Joue un coup
	playStrike(x,y) {
		var c_x = parseInt(x);
		var c_y = parseInt(y);

		this.board[c_x][c_y] = this.playerTurn;
		this.resolveStrike(c_x,c_y);
		this.nextTurn();
	}

	// Passage au tour suivant
	nextTurn() {
		if(this.playerTurn == 1) {
			this.playerTurn = 2;
		}
		else if(this.playerTurn == 2) {
			this.playerTurn = 1;
		}
	}

	// Résolution des effets du coup joué
	resolveStrike(x,y) {
		// Vérification Pente
		var align_pent_checks = Game.checkAlignment(x,y,this.board,this.playerTurn,4);
		var has_a_pente =  ((align_pent_checks[0] + align_pent_checks[4] + 1) >= 5)
									  || ((align_pent_checks[1] + align_pent_checks[5] + 1) >= 5)
									  || ((align_pent_checks[2] + align_pent_checks[6] + 1) >= 5)
									  || ((align_pent_checks[3] + align_pent_checks[7] + 1) >= 5);

	    if(has_a_pente) {
	    	// Une pente est détectée, on met fin au jeu
	    	this.winner = this.playerTurn;
	    }

	    // Vérification Tenaille
	    if(!has_a_pente) {
			var other_player = this.playerTurn == 1 ? 2 : 1;
			var align_ten_checks = Game.checkAlignment(x,y,this.board,other_player,2);
			this.resolveTenaille(align_ten_checks,x,y);
		}	
	}

	// Résolution d'une tenaille
	resolveTenaille(align_result,x,y) {
		var tenailles = 0;
		for(var i = 0; i < align_result.length; i++) {
			if(align_result[i] == 2) {
				switch(i) {
					case 0: if(x-3 >= 0 && this.board[x-3][y] == this.playerTurn) { 
						this.board[x-2][y] = 0;
						this.board[x-1][y] = 0;
						this.coordsTenailles.push([x-2][y]);
						this.coordsTenailles.push([x-1][y]);
						tenailles++; 
					} 
					case 1: if(x-3 >= 0 && y+3 <= 18 && this.board[x-3][y+3] == this.playerTurn) { 
						this.board[x-2][y+2] = 0;
						this.board[x-1][y-1] = 0;
						this.coordsTenailles.push([x-2][y+2]);
						this.coordsTenailles.push([x-1][y-1]);
						tenailles++; 
					} 
					case 2: if(y+3 <= 18 && this.board[x][y+3] == this.playerTurn) { 
						this.board[x][y+2] = 0;
						this.board[x][y+1] = 0;
						this.coordsTenailles.push([x][y+2]);
						this.coordsTenailles.push([x][y+1]);
						tenailles++; 
					} 
					case 3: if(x+3 <= 18 && y+3 <= 18 && this.board[x+3][y+3] == this.playerTurn) { 
						this.board[x+2][y+2] = 0;
						this.board[x+1][y+1] = 0;
						this.coordsTenailles.push([x+2][y+2]);
						this.coordsTenailles.push([x+1][y+1]);
						tenailles++; 
					} 
					case 4: if(x+3 <= 18 && this.board[x+3][y] == this.playerTurn) { 
						this.board[x+2][y] = 0;
						this.board[x+1][y] = 0;
						this.coordsTenailles.push([x+2][y]);
						this.coordsTenailles.push([x+1][y]);
						tenailles++; 
					} 
					case 5: if(x+3 <= 18 && y-3 >= 0 && this.board[x+3][y-3] == this.playerTurn) { 
						this.board[x+2][y-2] = 0;
						this.board[x+1][y-1] = 0;
						this.coordsTenailles.push([x+2][y-2]);
						this.coordsTenailles.push([x+1][y-1]);
						tenailles++; 
					} 
					case 6: if(y-3 >= 0 && this.board[x][y-3] == this.playerTurn) { 
						this.board[x][y-2] = 0;
						this.board[x][y-1] = 0;
						this.coordsTenailles.push([x][y-2]);
						this.coordsTenailles.push([x][y-1]);
						tenailles++; 
					} 
					case 7: if(y-3 >= 0 && x-3 >= 0 && this.board[x-3][y-3] == this.playerTurn) { 
						this.board[x-2][y-2] = 0;
						this.board[x-1][y-1] = 0;
						this.coordsTenailles.push([x-2][y-2]);
						this.coordsTenailles.push([x-1][y-1]);
						tenailles++; 
					} 
				}
			}
		}

		// Ajout des tenailles
		if(tenailles > 0) {
			this.nbTenailles["player" + this.playerTurn] += tenailles;
			// Si cinq tenailles, le joueur remporte la victoire
			if(this.nbTenailles["player" + this.playerTurn] >= 5) {
				this.winner = this.playerTurn;
		    }	
		}
	}

	/*************** METHODES UTILES **********************/

	// Vérifie les alignements possibles de pions
	static checkAlignment(x,y,board,player,it) {
		var align_pent_checks = [0,0,0,0,0,0,0,0];
		var align_pent_breaks = [false,false,false,false,false,false,false,false];

		for(var i = 1; i <= it; i++) {
			if(x-i >= 0) {
				if(y+i <= 18) {
					if(!align_pent_breaks[1] && board[x-i][y+i] == player) { align_pent_checks[1] += 1; } else { align_pent_breaks[1] = true; }
				}
				if(y-i >= 0) {
					if(!align_pent_breaks[7] && board[x-i][y-i] == player) { align_pent_checks[7] += 1; } else { align_pent_breaks[7] = true; }
				}
				if(!align_pent_breaks[0] && board[x-i][y] == player) { align_pent_checks[0] += 1; } else { align_pent_breaks[0] = true; }

			}
			if(x+i <= 18) {
				if(y-i >= 0) {
					if(!align_pent_breaks[5] && board[x+i][y-i] == player) { align_pent_checks[5] += 1; } else { align_pent_breaks[5] = true; }
				}
				if(y+i <= 18) {
					if(!align_pent_breaks[3] && board[x+i][y+i] == player) { align_pent_checks[3] += 1; } else { align_pent_breaks[3] = true; } 
				}
				if(!align_pent_breaks[4] && board[x+i][y] == player) { align_pent_checks[4] += 1; } else { align_pent_breaks[4] = true; }
			}
			if(y-i >= 0) {
				if(!align_pent_breaks[6] && board[x][y-i] == player) { align_pent_checks[6] += 1; } else { align_pent_breaks[6] = true; }
			}	
			if(y+i <= 18) {
				if(!align_pent_breaks[2] && board[x][y+i] == player) { align_pent_checks[2] += 1; } else { align_pent_breaks[2] = true; }
			}	
		}

		return align_pent_checks;
	}

	// Récupère les coordonnées de toutes les cases vides
	static getAllEmptyCoords(board, exclude, lastPlayed, area) {
		if(typeof lastPlayed == 'undefined' || typeof area == 'undefined')
			lastPlayed = [];

		var empty_coords = [];
		for(var i = 0; i < board.length; i++) {
			for(var j = 0; j < board[i].length; j++) {
				if(board[i][j] == 0) {
					if(typeof exclude == 'undefined' || (typeof exclude != 'undefined' && exclude[0] != i && exclude[1] != j)) {
						if(lastPlayed.length == 0 || (lastPlayed.length != 0 && Math.abs(i - lastPlayed[0]) <= area &&  Math.abs(j - lastPlayed[1]) <= area)) {
							empty_coords.push([i,j]);
						}
					}
				}
			}	
		}

		if(empty_coords.length == 0 && lastPlayed.length != 0) 
			empty_coords = Game.getAllEmptyCoords(board, exclude, lastPlayed, area+1);

		return empty_coords;
	}

	// Fonction Static pour cloner la Map
	static cloneBoard(board) {
		var newBoard = [];
		for (var i = 0; i < board.length; i++) {
			var boardRow = [];
			for (var j = 0; j < board[i].length; j++) {
				boardRow[j] = board[i][j];
			}
			newBoard[i] = boardRow;
		}
		return newBoard;
	}

}

