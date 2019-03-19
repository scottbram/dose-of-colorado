var gulp = require('gulp'),
	
	/** Plug-ins */
	sourcemaps 	= require('gulp-sourcemaps'),
	concat 		= require('gulp-concat'),
	rename 		= require('gulp-rename'),
	sass 		= require('gulp-sass'),
	terser 		= require('gulp-terser'),
	
	/** Path objects */
	input = {
	 	'styles': 'src/styles/**/*.scss',
		'js': 'src/js/**/*.js'
	},
	output = {
		'styles': 'dist/styles',
		'js': 'dist/js'
	};

/** Copy the homepage file */
gulp.task('incl-index', function () {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('dist'));
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
gulp.task('default', gulp.parallel('incl-index', 'build-styles', 'build-js'));
