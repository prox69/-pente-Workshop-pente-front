/********************** SERVEUR DE L'IA ***************************/

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Appel de ALIE
app.post("/alie", function(req, res) {
	if(typeof req.body.board == 'undefined') {
		res.sendStatus(401);
	}
	else {
		var alie = new Alie({ player : 1, opponent : 2});

		alie.initializeBoard(Game.cloneBoard(req.body.board));
		alie.generateWinRateTable();
		res.json({ bestStrike : alie.getBestStrike() });
	}
});	

/********************** JEU ***************************/

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
		var align_pent_checks = this.checkAlignment(x,y,this.playerTurn,4);
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
			var align_ten_checks = this.checkAlignment(x,y,other_player,2);
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
	checkAlignment(x,y,player,it) {
		var align_pent_checks = [0,0,0,0,0,0,0,0];
		var align_pent_breaks = [false,false,false,false,false,false,false,false];

		for(var i = 1; i <= it; i++) {
			if(x-i >= 0) {
				if(y+i <= 18) {
					if(!align_pent_breaks[1] && this.board[x-i][y+i] == player) { align_pent_checks[1] += 1; } else { align_pent_breaks[1] = true; }
				}
				if(y-i >= 0) {
					if(!align_pent_breaks[7] && this.board[x-i][y-i] == player) { align_pent_checks[7] += 1; } else { align_pent_breaks[7] = true; }
				}
				if(!align_pent_breaks[0] && this.board[x-i][y] == player) { align_pent_checks[0] += 1; } else { align_pent_breaks[0] = true; }

			}
			if(x+i <= 18) {
				if(y-i >= 0) {
					if(!align_pent_breaks[5] && this.board[x+i][y-i] == player) { align_pent_checks[5] += 1; } else { align_pent_breaks[5] = true; }
				}
				if(y+i <= 18) {
					if(!align_pent_breaks[3] && this.board[x+i][y+i] == player) { align_pent_checks[3] += 1; } else { align_pent_breaks[3] = true; } 
				}
				if(!align_pent_breaks[4] && this.board[x+i][y] == player) { align_pent_checks[4] += 1; } else { align_pent_breaks[4] = true; }
			}
			if(y-i >= 0) {
				if(!align_pent_breaks[6] && this.board[x][y-i] == player) { align_pent_checks[6] += 1; } else { align_pent_breaks[6] = true; }
			}	
			if(y+i <= 18) {
				if(!align_pent_breaks[2] && this.board[x][y+i] == player) { align_pent_checks[2] += 1; } else { align_pent_breaks[2] = true; }
			}	
		}

		return align_pent_checks;
	}

	// Récupère les coordonnées de toutes les cases vides
	static getAllEmptyCoords(board, exclude) {
		var empty_coords = [];
		for(var i = 0; i < board.length; i++) {
			for(var j = 0; j < board[i].length; j++) {
				if(board[i][j] == 0) {
					if(typeof exclude == 'undefined' || (typeof exclude != 'undefined' && exclude[0] != i && exclude[1] != j)) {
						empty_coords.push([i,j]);
					}
				}
			}	
		}
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

/********************** ALIE : INTELLIGENCE ARTIFICIELLE DU JEU ***************************/

class Alie {
	constructor(players) {
		this.board = null;
		this.winRateTable = null;
		this.AMC = new AlieMonteCarlo();
		this.players = players;
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
		var empty_coords = Game.getAllEmptyCoords(this.board);
		var instance = this;

		for(var i = 0; i < empty_coords.length; i++) {
			//if(empty_coords[i][0] == 1 && empty_coords[i][1] == 4) {
				this.AMC.initialize(empty_coords[i][0], empty_coords[i][1], this.board, this.players);
				this.AMC.run(function(wins, playouts) {
					var winRate = Math.ceil((wins/playouts)*100);
					instance.winRateTable[empty_coords[i][0]][empty_coords[i][1]] = winRate;
				});
			//}	
		}
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

/********************** ALGORITHME DE MONTE CARLO POUR ALIE ***************************/

class AlieMonteCarlo {
	constructor() {
		this.coords = [];
		this.origin_board;
		this.board;
		this.player;
		this.opponent;

		this.round = 100;
		this.playouts = 0;
		this.wins = 0;
	}

	// Initialisation de l'algorithme
	initialize(y,x,board, players) {
		this.coords = [y,x];
		this.board = Game.cloneBoard(board);
		this.origin_board = Game.cloneBoard(board);
		this.player = players.player;
		this.opponent = players.opponent;
		this.playouts = 0;
		this.wins = 0;
	}

	// Lancement de l'algoritme
	run(cb) {
		this.generatePlayouts();
		return cb(this.wins, this.playouts);
	}

	// Generation des playouts
	generatePlayouts() {
		for(var i = 0; i < this.round; i++) {
			this.playout(Game.cloneBoard(this.origin_board));
		}
	}

	// Lancement d'un playout
	playout(board) {
		// Board pour le playout
		this.board = board;

		// Création d'une nouvelle partie
		var temp_game = new Game(this.board, this.player);
		var all_empty_points = Game.getAllEmptyCoords(this.board, [this.coords[0], this.coords[1]]);
		var winner = 0;

		// On joue le premier coup défini
		temp_game.playStrike(this.coords[0], this.coords[1]);
		// Mise à jour des cases vides
		if(temp_game.coordsTenailles.length > 0) {
			for(var t; t < temp_game.coordsTenailles.length; t++) {
				all_empty_points.push(temp_game.coordsTenailles[t]);
			}
		}
		// Mise à jour du winner
		winner = temp_game.winner;

		// Suite du jeu sur la partie
		while(winner == 0 && all_empty_points.length > 0) {
			// Récupération d'une case vide random
			var rand = Math.floor(Math.random() * all_empty_points.length);
			var strike = all_empty_points[rand];

			// On joue le coup
			temp_game.playStrike(strike[0],strike[1]);

			// Mise à jour des cases vides
			all_empty_points.splice(rand,1);
			if(temp_game.coordsTenailles.length > 0) {
				for(var t; t < temp_game.coordsTenailles.length; t++) {
					all_empty_points.push(temp_game.coordsTenailles[t]);
				}
			}

			// Mise à jour du winner
			winner = temp_game.winner;
		}

		// Interprétation du résultat
		if(winner == this.player) {
			this.wins++;
		}
		this.playouts++;
	}

		

}


/********LANCEMENT**********/
//Lancement du serveur
var server_port = 80;
var server_ip_address = '127.0.0.1';

app.listen(server_port, server_ip_address, function(){
	console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});

