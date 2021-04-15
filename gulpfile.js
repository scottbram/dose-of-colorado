const gulp 		= require('gulp'),
	
	/** Plug-ins */
	// concat 		= require('gulp-concat'),
	htmlmin 	= require('gulp-htmlmin'),
	rename 		= require('gulp-rename'),
	sass 		= require('gulp-sass'),
	sourcemaps 	= require('gulp-sourcemaps'),
	terser 		= require('gulp-terser'),
	imagemin 	= require('gulp-imagemin'),
	
	/** Paths */
	in_root		= 'src',
	out_root	= 'dist',

	input = {
		'html': in_root + '/**/*.html',
	 	'styles': in_root + '/styles/**/*.scss',
		'js': in_root + '/js/**/*.js',
		'images': in_root + '/assets/**/*',
		// 'redir': in_root + '/_redirects'
	},
	output = {
		'html': out_root,
		'styles': out_root + '/styles',
		'js': out_root + '/js',
		'images': out_root + '/assets',
		// 'redir': out_root
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
        .pipe(rename('stew.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.styles));
});

/** Process JS files */
gulp.task('build-js', function () {
    return gulp.src(input.js)
    	.pipe(sourcemaps.init())
        // .pipe(concat('stew.js'))
        .pipe(terser({
			keep_fnames: false,
			mangle: {
				toplevel: true
			}
	    }))
	    // .pipe(rename('stew.min.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.js));
});

/** Process image files */
gulp.task('imagemin', function () {
	return gulp.src(input.images)
		.pipe(imagemin(
			[
				imagemin.jpegtran({
					progressive: true
				})
			]
		))
		.pipe(gulp.dest(output.images));
});

/** Copy _redirect file */
gulp.task('copy_redir', function () {
	return gulp.src(in_root + '/_redirects')
		.pipe(gulp.dest(out_root));
});

/** Copy video files to output directory */
gulp.task('copy_videos', function () {
	return gulp.src(in_root + '/assets/videos/**/*')
		.pipe(gulp.dest(out_root + '/assets/videos'));
});

/** Default task */
gulp.task('default', gulp.parallel('imagemin', 'copy_redir', 'copy_videos', 'build-html', 'build-styles', 'build-js'));
