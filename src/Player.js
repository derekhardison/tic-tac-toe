co.hardison.tictactoe.Player = Backbone.Model.extend( {
	defaults: function () {
		return {
			squares: 0
		}
	},

	/**
	 * Square to take as this player.
	 *
	 * @param {int} x Coordinate
	 * @param {int} y Coordinate
	 */
	setSquare: function ( x, y ) {
		var squares = this.get( 'squares' );

		squares |= 1 << ( ( 3 * y ) + x );
		this.set( 'squares', squares );
	},

	/**
	 * Square to take as this player.
	 *
	 * @param {int} x Coordinate
	 * @param {int} y Coordinate
	 */
	removeSquare: function ( x, y ) {
		var squares = this.get( 'squares' );

		squares ^= 1 << ( ( 3 * y ) + x );
		this.set( 'squares', squares );
	}
} );
