var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');

gulp.task('server', function () {
 nodemon({
   script: 'server.js',
   ext: 'js',
   ignore: ['ng*', 'gulp*', 'public*']
 });
});

gulp.task('js:build', function () {
 return gulp.src(['./ng/**/module.js', 'ng/**/*.js'])
   .pipe(ngAnnotate())
   .pipe(concat('main.js'))
   .pipe(gulp.dest('./public/js'))
});

gulp.task('default', ['js:build', 'server'], function () {
 gulp.watch('./ng/**/*.js', ['js:build'])
});
