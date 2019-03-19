const gulp = require('gulp'),
	
	/** Plug-ins */
	concat 		= require('gulp-concat'),
	htmlmin 	= require('gulp-htmlmin'),
	rename 		= require('gulp-rename'),
	sass 		= require('gulp-sass'),
	sourcemaps 	= require('gulp-sourcemaps'),
	terser 		= require('gulp-terser'),
	
	/** Path objects */
	input = {
		'html': 'src/*.html',
	 	'styles': 'src/styles/**/*.scss',
		'js': 'src/js/**/*.js'
	},
	output = {
		'html': 'dist',
		'styles': 'dist/styles',
		'js': 'dist/js'
	};

/** Process HTML files */
gulp.task('build-html', function () {
	return gulp.src(input.html)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(output.html));
});

/** Process Sass files */
gulp.task('build-styles', function () {
    return gulp.src(input.styles)
    	.pipe(sourcemaps.init())
    	.pipe(sass({
        	errorLogToConsole: true,
        	outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        // OR
        // .pipe(sass().on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.styles));
});

/** Process JS files */
gulp.task('build-js', function () {
    return gulp.src(input.js)
    	.pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        // .pipe(gulp.dest(output.js))
        .pipe(rename('main.min.js'))
        .pipe(terser())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.js));
});

/** Default task */
gulp.task('default', gulp.parallel('build-html', 'build-styles', 'build-js'));
