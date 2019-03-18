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

// Default task
gulp.task('build', ['build-styles', 'build-js']);

// Process Sass files
gulp.task('build-styles', () => {
    return gulp.src(input.styles)
    	.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.styles));
});

// Process JS files
gulp.task('build-js', () => {
    return gulp.src(input.js)
    	.pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(output.js))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.js));
});
