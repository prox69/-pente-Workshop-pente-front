/********************** INTELLIGENCE ARTIFICIELLE DU JEU ***************************/

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