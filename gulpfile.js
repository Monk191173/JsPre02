const gulp = require('gulp');
const { series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const gulpCopy = require('gulp-copy');

const html = () => {
  return gulp.src('src_files/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('build'))
}

const styles = () => {
  return gulp.src('src_files/styles/*.scss')
    .pipe(sass().on('err', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest('build/css'))
}

const images = () => {
  return gulp.src('src_files/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'))
}

const copyfont = () => {
  return gulp.src('src_files/fonts/*.*')
  .pipe(gulp.dest('build/fonts'))
    .pipe(gulpCopy('./'))
}

const copycss = () => {
  return gulp.src('src_files/styles/fonts.css')
  .pipe(gulp.dest('build/css'))
    .pipe(gulpCopy('./'))
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    notify: false
  });
  browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
  return del('build/**').then(() => { cb() })
}

const watch = () => {
  gulp.watch('src_files/*.pug', html);
  gulp.watch('src_files/styles/*.scss', styles);
  gulp.watch('src_files/images/**/*.*', images);
}

exports.default = series(
  deleteBuild,
  parallel(html, styles, images, copyfont, copycss),
  parallel(watch, server)
);
