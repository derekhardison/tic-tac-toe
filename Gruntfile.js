module.exports = function(grunt) {
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
		
		uglify: {
			target: {
				files: {
					'dist/Tic-Tac-Toe.js': [ 'node_modules/jquery/dist/jquery.min.js', 'node_modules/underscore/underscore-min.js', 'node_modules/backbone/backbone-min.js', 'src/Game.js', 'src/Board.js', 'src/Player.js', 'src/Square.js' ],
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};
