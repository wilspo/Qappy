var gulp = require('gulp');
var typescript = require('gulp-tsc');

var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var gutil = require('gulp-util');
var log = gutil.log
var colors = gutil.colors;

var jsFiles = ['jquery/dist/jquery.js', 'handlebars/handlebars.js'];
jsFiles = jsFiles.map(function(x){ return 'lib/bower_components/' + x; });

var paths = {
	html: 'src/*.html',
	typescript: 'src/typescript/**/*.ts',
	handlebars: 'src/templates/**/*.hbs'
}

gulp.task('watch', function() {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.handlebars, ['handlebars']);
});

gulp.task('watch-ts', function() {
  gulp.watch(paths.typescript, ['typescript']);
});

gulp.task('html', function() {
	return gulp.src(paths.html)
		.pipe(gulp.dest('build/'));
});

gulp.task('javascript', function() {
	return gulp.src(jsFiles)
		.pipe(gulp.dest('build/Scripts'));
});

gulp.task('typescript', function() {
	return gulp.src(paths.typescript)
		.pipe(typescript({ target:'ES5', keepTree: false, out: 'Qappy.js'}))
		.pipe(gulp.dest('build/Scripts'));
});

gulp.task('handlebars', function() {
	return gulp.src(paths.handlebars)
 		.pipe(handlebars())
    	.pipe(defineModule('plain'))
    	.pipe(declare({
      		namespace: 'Templates'
    	}))
    	.pipe(concat('Templates.js'))
    	.pipe(gulp.dest('build/Scripts'));
});

/** Web Server: http://rhumaric.com/2014/01/livereload-magic-gulp-style/ **/
var modRewrite = require('connect-modrewrite');
var express = require('express');
var liveReload = require('connect-livereload');
var tinyLr = require('tiny-lr');

var EXPRESS_PORT = 9999;
var LIVERELOAD_PORT = 8888; // Standard port is 35729

function startExpress() {
  	var server = express();
  	server.use(liveReload({ port: LIVERELOAD_PORT }));
  	server.use(modRewrite([
		'!\\..{2,4}$ /default.html [L]'
  	]));
  	server.use( express.static('build') );
  	server.listen(EXPRESS_PORT);

  	log( colors.green('Express Server started on port ' + EXPRESS_PORT) );
}

var lrServer;
function startLiveReload() {
  	lrServer = tinyLr(); 
  	lrServer.listen(LIVERELOAD_PORT); 
  	log( colors.green('Live Reload listening on port ' + LIVERELOAD_PORT) );
}

function notifyLiveReload(event) {
  	var fileName = require('path').relative('build', event.path);
 	log( colors.green('Reloading ') + colors.magenta(fileName) );
  	lrServer.changed({
    	body: {
      		files: [fileName]
    	}
  	});
}
 
gulp.task('express', function () {
  	startExpress();
  	startLiveReload();
  	gulp.watch('build/**/*', notifyLiveReload);
});


gulp.task('default', ['html', 'typescript', 'handlebars', 'watch']);