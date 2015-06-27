co.hardison.tictactoe.Square = Backbone.View.extend( {
	tagName: 'div',
	className: 'square',

	x: -1,
	y: -1,

	render: function () {
		this.$el.addClass( 'row-' + this.y )
			.addClass( 'column-' + this.x )
			.data( 'x', this.x )
			.data( 'y', this.y );
	},

	setPlayer: function ( p ) {
		if ( this.model ) {
			// undo the move
			this.model.removeSquare( this.x, this.y );
		}

		this.model = p;

		if ( !this.model ) {
			// remove the player.
			this.$el.removeClass( 'x' )
				.removeClass( 'o' );
		} else if ( this.model.id == 'x' ) {
			// append x class
			this.$el.addClass( 'x' )
			this.model.setSquare( this.x, this.y );
		} else if ( this.model.id == 'o' ) {
			// append o class
			this.$el.addClass( 'o' );
			this.model.setSquare( this.x, this.y );
		}
	}
} );
