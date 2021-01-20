const gulp = require("gulp"),
  sass = require("gulp-sass"),
  browsersync = require("browser-sync").create(),
  notify = require("gulp-notify"),
  nunjucksRender = require("gulp-nunjucks-render"),
  minify = require("cssnano"),
  webp = require("gulp-webp"),
  imagemin = require("gulp-imagemin"),
  rename = require("gulp-rename");

const src = {
  SCSS_FILES: "src/sass/**/*.scss",
  html: "src/nunjucks/pages/*.njk",
  img: "src/img/**/*",
};

const dist = {
  css: "dist/css",
  html: "dist",
  img: "dist/img",
};

function browserSync(done) {
  browsersync.init({
    files: "/dist",
    server: {
      baseDir: "./dist",
    },
    port: 4000,
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// for converting sass to css
function css() {
  return (
    gulp
      .src(src.SCSS_FILES)
      .pipe(
        sass({
          outputStyle: "expanded",
        })
      )
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(gulp.dest(dist.css))
      // .pipe(
      //   notify({
      //     message: "CSS compiled successfully!!",
      //   })
      // )
      .pipe(browsersync.stream())
  );
}

function html() {
  return gulp
    .src(src.html)
    .pipe(
      nunjucksRender({
        path: [
          // "src/nunjucks/layout/*.njk",
          // "src/nunjucks/components/*.njk",
          // "src/nunjucks/pages/*.njk",
          "src/nunjucks/",
        ],
      })
    )
    .pipe(gulp.dest(dist.html));
}

// for converting image format to webp
function imgConverter() {
  return gulp
    .src(src.img)
    .pipe(
      imagemin()
      // imagemin([
      //   imagemin.gifsicle({ interlaced: true }),
      //   imagemin.mozjpeg({ quality: 75, progressive: true }),
      //   imagemin.optipng({ optimizationLevel: 5 }),
      // ])
    )
    .pipe(webp())
    .pipe(gulp.dest(dist.img));
}

function watch() {
  gulp.watch("src/sass", gulp.series("css", browserSyncReload));
  // gulp.watch("src/img", gulp.series("image", browserSyncReload));
  gulp.watch("src/html", gulp.series("html", browserSyncReload));
}

const build = gulp.parallel(
  html,
  css,
  // imgConverter,
  watch,
  browserSync,
  browserSyncReload
);

exports.css = css;
exports.watch = watch;
// exports.image = imgConverter;
exports.build = build;
exports.html = html;
exports.default = build;
