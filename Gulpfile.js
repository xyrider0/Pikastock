var gulp          = require('gulp');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var browserSync   = require('browser-sync').create();
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');
var concat        = require('gulp-concat');
var nodemon       = require('gulp-nodemon');

// Where our files are located
var jsFiles   = "src/main/app/**/*.js";
var viewFiles = "src/main/app/**/*.html";
var cssFiles = "src/main/app/**/**.cs";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

gulp.task('browserify', ['views'], function() {
  return browserify('src/main/app/app.js', {bare: true, browserField: false})
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)
      .bundle()
      .on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('src/main/build/'));
});

gulp.task('html', function() {
  return gulp.src("src/main/index.html")
      .on('error', interceptErrors)
      .pipe(gulp.dest('src/main/build/'));
});

gulp.task('pack-css', function(){
  return gulp.src(['src/main/assets/css/index.css'])
        .on('error', interceptErrors)
        .pipe(concat('stylesheet.css'))
        .pipe(gulp.dest('src/main/build/'))
})

gulp.task('views', function() {
  return gulp.src(viewFiles)
      .pipe(templateCache({
        standalone: true
      }))
      .on('error', interceptErrors)
      .pipe(rename("app.templates.js"))
      .pipe(gulp.dest('./src/main/app/config/'));
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['html', 'browserify'], function() {
  var html = gulp.src("src/main/build/index.html")
                 .pipe(gulp.dest('dist/'));

  var js = gulp.src("src/main/build/main.js")
               .pipe(uglify())
               .pipe(gulp.dest('dist/'));

  return merge(html,js);
});

gulp.task('nodemon', function(cb){
  var callbackCalled = false;
  return nodemon({script: './src/main/server.js'}).on('start', function(){
    if(!callbackCalled){
      callbackCalled = true;
      cb();
    }
  })
})

gulp.task('browser-sync', ['nodemon'], function(){
  browserSync.init(null, {
    proxy: "http://localhost:8000", // port of node server
  });
})

gulp.task('default', ['html', 'browserify', 'pack-css', 'browser-sync'], function() {

  // browserSync.init(['src/main/build/**/**.**'], {
  //   server: "src/main/build",
  //   port: 4000,
  //   notify: false,
  //   ui: {
  //     port: 4001
  //   }
  // });

  gulp.watch("src/main/index.html", ['html']);
  gulp.watch(viewFiles, ['views']);
  gulp.watch(jsFiles, ['browserify']);
  gulp.watch(cssFiles, ['pack-css'])
});