var co = {};

// namespace
co.hardison = {};
co.hardison.tictactoe = {};

co.hardison.tictactoe.Game = Backbone.View.extend( {
	el: 'body',

	board: undefined,

	/**
	 * Call render after all the files are loaded.
	 */
	render: function () {
		this.board = new co.hardison.tictactoe.Board();
		this.$el.append( this.board.$el );
	}
} );
