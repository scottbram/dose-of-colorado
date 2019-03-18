var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Process Sass files
var sass_files_src = ['src/styles/*.scss', 'src/styles/**/*.scss'],
    sass_files_dest = 'dist/styles/';

gulp.task('sass', function () {
    gulp.src(sass_files_src)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(sass_files_dest));
});

// Process JS files
var js_files_src = 'src/js/**/*.js',
    js_files_dest = 'dist/js';

gulp.task('js', function() {
    return gulp.src(js_files_src)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(js_files_dest))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(js_files_dest));
});

// Default task
gulp.task('default', function () {
    gulp.start(['sass', 'js']);
});

exports.default = default;
