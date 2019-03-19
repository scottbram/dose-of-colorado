const gulp 		= require('gulp'),
	
	/** Plug-ins */
	concat 		= require('gulp-concat'),
	htmlmin 	= require('gulp-htmlmin'),
	rename 		= require('gulp-rename'),
	sass 		= require('gulp-sass'),
	sourcemaps 	= require('gulp-sourcemaps'),
	terser 		= require('gulp-terser'),
	
	/** Paths */
	in_root		= 'src',
	out_root	= 'dist',
	input = {
		'html': in_root + '/**/*.html',
	 	'styles': in_root + '/styles/**/*.scss',
		'js': in_root + '/js/**/*.js',
		'redir': in_root + '/_redirects'
	},
	output = {
		'html': out_root,
		'styles': out_root + '/styles',
		'js': out_root + '/js',
		'redir': out_root
	};

/** Process HTML files */
gulp.task('build-html', function () {
	return gulp.src(input.html)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
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

/** Copy _redirect file for subdomains */
gulp.task('copy_redir', function () {
	return gulp.src(input.redir)
		.pipe(gulp.dest(output.redir));
});

/** Default task */
gulp.task('default', gulp.parallel('build-html', 'build-styles', 'build-js', 'copy_redir'));
