// npm install browser-sync gulp --save-dev
// npm install gulp-sass --save-dev
// npm install --save-dev gulp-clean
// npm install run-sequence --save-dev
// npm install --save-dev browser-sync gulp-sass gulp-clean run-sequence

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	clean = require('gulp-clean'),
	runSequence = require('run-sequence');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch('app/scss/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('app/js/*.js').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
        console.log("RUNNING SASS")
});

//Watch
gulp.task('watch', function() {
   gulp.watch('app/scss/*.scss').on('change', browserSync.reload);
   gulp.watch('app/*.html').on('change', browserSync.reload);
   gulp.watch('app/js/*.js').on('change', browserSync.reload);
});


//Clean 
gulp.task('clean', function(){
	return gulp.src('app/css/style.css')
	.pipe(clean())
});

//Build
gulp.task('build', function (callback){
  runSequence(['clean', 'sass'], callback)
  console.log('Building files');
})

gulp.task('default', ['serve']);
