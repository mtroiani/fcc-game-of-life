var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var babel = require('gulp-babel');

gulp.task('default', ['watch']);

gulp.task("browserSync", function() {
  browserSync.init({
    server: true
  });
});

gulp.task("build-css", function() {
  return gulp.src("public/src/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/dist"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("babel", function () {
  return gulp.src('public/src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest("public/dist"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("watch", ["browserSync"], function() {
  gulp.watch("public/src/**/*.scss", ["build-css"]);
  gulp.watch('public/src/**/*.js', ['babel']);
  gulp.watch("index.html").on('change', browserSync.reload);
  gulp.watch("public/src/**/*.js").on("change", browserSync.reload);
});
