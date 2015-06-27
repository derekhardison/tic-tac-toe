co.hardison.tictactoe.Board = Backbone.View.extend( {
	tagName: 'div',
	className: 'board',

	turn: undefined,
	o: undefined,
	x: undefined,

	matrix: undefined,
	winMatrix: undefined,

	events: {
		'click .square': 'onSquareClick'
	},

	initialize: function () {
		this.o = new co.hardison.tictactoe.Player( {
			id: 'o'
		} );

		this.x = new co.hardison.tictactoe.Player( {
			id: 'x'
		} );

		// initialize first player to o.
		this.turn = this.o;
		this.matrix = {};
		this.winMatrix = [];

		this.createMatrix( this.matrix, this.$el );
		this.createWinMatrix( this.winMatrix );
	},

	/**
	 * Constructs the board.
	 *
	 * @param store {Object} Empty object to use as the matrix of information.
	 * @param $el {Object} jQuery element to attach square.
	 */
	createMatrix: function ( store, $el ) {
		var i, x, y;

		for ( i = 0; i < 9; i++ ) {
			y = Math.floor( i / 3 );
			x = ( i % 3 );

			if ( i < 3 ) {
				// initialize 2x2 matrix
				store[ i ] = {};
			}

			store[ x ][ y ] = new co.hardison.tictactoe.Square();
			store[ x ][ y ].x = x;
			store[ x ][ y ].y = y;
			store[ x ][ y ].render();

			$el.append( store[ x ][ y ].$el );
		}
	},

	/**
	 * Builds a matrix containing all possible solutions for the game of tic-tac-toe.
	 *
	 * @param solutions {Object} Constructs the win matrix solutions.
	 */
	createWinMatrix: function ( solutions ) {
		var i;

		for ( i = 0; i < 511; i++ ) {
			// initialize the win matrix.
			this.winMatrix[ i ] = false;
		}

		this.isWon( ( 1 << 0 ) | ( 1 << 1 ) | ( 1 << 2 ) );
		this.isWon( ( 1 << 3 ) | ( 1 << 4 ) | ( 1 << 5 ) );
		this.isWon( ( 1 << 6 ) | ( 1 << 7 ) | ( 1 << 8 ) );
		this.isWon( ( 1 << 0 ) | ( 1 << 3 ) | ( 1 << 6 ) );
		this.isWon( ( 1 << 1 ) | ( 1 << 4 ) | ( 1 << 7 ) );
		this.isWon( ( 1 << 2 ) | ( 1 << 5 ) | ( 1 << 8 ) );
		this.isWon( ( 1 << 0 ) | ( 1 << 4 ) | ( 1 << 8 ) );
		this.isWon( ( 1 << 2 ) | ( 1 << 4 ) | ( 1 << 6 ) );
	},

	/**
	 * Updates the winMatrix to contain the winning arrangements.
	 *
	 * @param {int} pos Combination that contains the winning arrangment.
	 */
	isWon: function ( pos ) {
		var i;

		for ( i = 0; i < 511; i++ ) {
			if ( ( i & pos ) == pos ) {
				this.winMatrix[ i ] = true;
			}
		}
	},

	/**
	 * Toggle the player from o to x or x to o.
	 */
	togglePlayer: function () {
		if ( this.turn === this.o ) {
			this.turn = this.x;
		} else {
			this.turn = this.o;
		}
	},

	/**
	 * Resets the game.
	 */
	reset: function () {
		var i, x, y;

		for ( i = 0; i < 9; i++ ) {
			y = Math.floor( i / 3 ),
				x = ( i % 3 );

			this.matrix[ x ][ y ].setPlayer( undefined );
		}

		this.turn = this.o;
	},

	/**
	 * Makes the current player's move and toggles to the other.
	 *
	 * @param {Object} x Coordinate of box
	 * @param {Object} y Coordinate of box
	 * @return {Boolean} Returns true if the space is unoccupied and the player was able to move, otherwise false.
	 */
	makeMove: function ( x, y ) {
		if ( !this.matrix[ x ][ y ].model ) {
			// set the player and toggle.
			this.matrix[ x ][ y ].setPlayer( this.getTurn() )
			this.togglePlayer();

			return true;
		}

		return false;
	},

	/**
	 * Reverse the last player's move and toggles to the other.
	 *
	 * @param {Object} x Coordinate of box
	 * @param {Object} y Coordinate of box
	 * @return {Boolean} Returns true if the space is occupied and the remove was removed, otherwise false.
	 */
	reverseMove: function ( x, y ) {
		if ( this.matrix[ x ][ y ].model ) {
			// set the player and toggle.
			this.matrix[ x ][ y ].setPlayer( undefined )
			this.togglePlayer();

			return true;
		}

		return false;
	},

	/**
	 * Returns the status of the game.  String 'win' indicates computer wins,
	 * 'lose' indicates computer lost, 'tie' indicates tie, 'ok' if the game
	 * is not complete.
	 *
	 * @return {String} Status of the game
	 */
	status: function () {
		var o = this.o.get( 'squares' ),
			x = this.x.get( 'squares' );

		if ( this.winMatrix[ x ] ) {
			// Computer has a winning configuration. Human lost.
			return 'win';
		}

		if ( this.winMatrix[ o ] ) {
			// Human has the winning configuration. Computer lost.
			return 'lose';
		}

		if ( ( x | o ) == 511 ) {
			// All places on the board are filled. The game is over. No one
			// has a winning configuration.
			return 'tie';
		}

		// Game has not ended. Continue.
		return 'ok';
	},

	/**
	 * @return {Object} Returns the current playing player.
	 */
	getTurn: function () {
		return this.turn;
	},

	/**
	 * Listen for square click event and call the computer's move.
	 *
	 * @param {Object} event
	 */
	onSquareClick: function ( event ) {
		var target = $( event.currentTarget ),
			x = target.data( 'x' ),
			y = target.data( 'y' );

		if ( this.status() != 'ok' ) {
			// reset the board.
			this.reset();
			return;
		}

		if ( !this.makeMove( x, y ) ) {
			// human move was not successful do not continue.
			return;
		}

		// computer move
		this.makeComputerMove();

		switch ( this.status() ) {
			case 'lose':
				alert( 'You have won!' );
				break;

			case 'win':
				alert( 'You have lost!' );
				break;

			case 'tie':
				alert( 'Stalemate' );
				break;
		}
	},

	/**
	 * Make the computer's move.
	 */
	makeComputerMove: function () {
		var bestMove = this.maxValue( 0, -5000, 5000 ),
			y = Math.floor( bestMove / 3 ),
			x = ( bestMove % 3 );

		this.makeMove( x, y )
	},

	/**
	 * Calculate the value of the board.
	 *
	 * @param {Object} depth Current depth of the search.
	 * @return {int} Return a heuristic value for the board.
	 */
	hValue: function ( depth ) {
		if ( this.status() == 'lose' ) {
			return -100;
		} else if ( this.status() == 'win' ) {
			return 100 - depth;
		}

		return depth;
	},

	/**
	 * Alpha-beta minimax search
	 *
	 * @param {Object} depth Depth the search is currently at.
	 * @param {Object} alpha Alpha value
	 * @param {Object} beta Beta value.
	 */
	maxValue: function ( depth, alpha, beta ) {
		var tmp = beta,
			bestMove = -1,
			i, x, y;

		if ( this.status() != 'ok' ) {
			// game is over.
			return this.hValue( depth );
		}

		for ( i = 0; i < 9; i++ ) {
			y = Math.floor( i / 3 );
			x = ( i % 3 );

			if ( this.makeMove( x, y ) ) {
				// able to make move.
				tmp = alpha;
				alpha = Math.max( alpha, this.minValue( depth + 1, alpha, beta ) );
				this.reverseMove( x, y );

				if ( alpha >= beta ) {
					// stop. this is a bad move.
					break;
				}

				if ( alpha > tmp ) {
					// this move is better.
					bestMove = i;
				}
			}
		}

		if ( depth == 0 ) {
			// since this is the originating call, return the move to make.
			alpha = bestMove;
		}

		return alpha;
	},

	/**
	 * Alpha-beta minimax search
	 *
	 * @param {Object} depth Depth the search is currently at.
	 * @param {Object} alpha Alpha value
	 * @param {Object} beta Beta value.
	 */
	minValue: function ( depth, alpha, beta ) {
		var i, x, y;

		if ( this.status() != 'ok' ) {
			// game is over.
			return this.hValue( depth );
		}

		for ( i = 0; i < 9; i++ ) {
			y = Math.floor( i / 3 );
			x = ( i % 3 );

			if ( this.makeMove( x, y ) ) {
				// able to make move.
				beta = Math.min( beta, this.maxValue( depth + 1, alpha, beta ) );
				this.reverseMove( x, y );

				if ( alpha >= beta ) {
					// stop. this is a bad move.
					break;
				}
			}
		}

		return beta;
	}
} );
