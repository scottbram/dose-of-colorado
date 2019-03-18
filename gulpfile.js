var gulp = require('gulp'),

	sass 		= require('gulp-sass'),
	concat 		= require('gulp-concat'),
	rename 		= require('gulp-rename'),
	uglify 		= require('gulp-uglify'),
	sourcemaps 	= require('gulp-sourcemaps'),
	
	input = {
	 	'styles': ['src/styles/*.scss', 'src/styles/**/*.scss'],
		'js': 'src/js/**/*.js'
	},
	output = {
	  'styles': 'dist/styles',
	  'js': 'dist/js'
	};

// Process Sass files
var sass_files_src = ['src/styles/*.scss', 'src/styles/**/*.scss'],
    sass_files_dest = 'dist/styles';

gulp.task('build-styles', function () {
    return gulp.src(input.styles)
    	.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.styles));
});

// Process JS files
gulp.task('build-js', function() {
    return gulp.src(input.js)
    	.pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(output.js))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.js));
});

// Default task
/*gulp.task('default', function () {
    gulp.start(['sass', 'js']);
});*/

gulp.task('build', ['build-styles', 'build-js']);
