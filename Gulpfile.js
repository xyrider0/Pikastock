/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    jshint = require('gulp-jshint');
    sass = require('gulp-sass');

// create a default task and just log a message
gulp.task('default', ['watch']);

gulp.task('jshint', function(){
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function(){
    return gulp.src('src/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['jshint']);
});

gulp.task('build-js', function()
{
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('bundle.js'))
            //only uglify if gulp is ran with '--type production'
            .pipe(gutuil.env.type === 'production' ? uglify(): gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});
