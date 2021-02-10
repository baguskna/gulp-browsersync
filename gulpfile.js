const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass task
function scssTask() {
  return src('app/scss/styles.scss', { sourcemaps: true })
  .pipe(sass())
  .pipe(postcss([cssnano()]))
  .pipe(dest('dist', { sourcemaps: '.' }));
}

// Js task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
  .pipe(terser())
  .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync task
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(['app/scss/**/*.scss', 'app/scss/**/*.js'], series(scssTask, jsTask, browserSyncReload))
}

// Default gulp task
exports.default = series(
  scssTask,
  jsTask,
  browserSyncServe,
  watchTask
);
