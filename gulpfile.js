var gulp = require('gulp');
var path = require('path');
var exec = require('child_process').exec;

gulp.task('build-js',function(done){
	exec('nej export ./src/lib/nej/define.js?pro=./src/,./src/index.js -o ./public/javascripts/bundle.js',function(err,stdout,stderr){
		console.log('start');
		if(err) {
			console.log(err);
		}

		console.log(stdout);
		done();
	})
});

gulp.task('default',['build-js']);

