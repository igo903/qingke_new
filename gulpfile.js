let
	gulp = require('gulp'),
	htmlTagInclude = require('gulp-html-tag-include'),
	prettify = require('gulp-prettify'),
	babel = require('gulp-babel'),
	rollup = require('gulp-rollup'),
	uglify = require('gulp-uglify'),
	cleanCss = require('gulp-clean-css'),
	postcss = require('gulp-postcss'),
	cssnext = require('postcss-cssnext'),
	cssimport = require('postcss-import');

const
	SRC_PATH = 'src/',
	SRC_HTML_PATH = `${SRC_PATH}*.html`,
	SRC_TEMPLATE_PATH = `${SRC_PATH}template/*.html`,
	SRC_CSS_PATH = `${SRC_PATH}**/*.css`,
	SRC_JS_PATH = `${SRC_PATH}**/*.js`,
	SRC_IMG_PATH = `${SRC_PATH}**/*.*(png|jpg|jpeg|gif|svg)`,
	ROLLUP_ENTRY_PATH = `${SRC_PATH}js/`,
	BUILD_PATH = './';

function html() {
	return gulp.src(SRC_HTML_PATH)
		.pipe(htmlTagInclude())
		.pipe(prettify({
			indent_with_tabs: true,
			preserve_newlines: true,
			extra_liners: []
		}))
		.pipe(gulp.dest(BUILD_PATH));
}

function css() {
	return gulp.src([SRC_CSS_PATH, `!**/var.css`])
		.pipe(postcss([cssimport(), cssnext()]))
		.pipe(cleanCss())
		.pipe(gulp.dest(BUILD_PATH));
}

function js() {
	return gulp.src(SRC_JS_PATH)
		// .pipe(rollup({
		// 	entry: [
		// 		`${ROLLUP_ENTRY_PATH}java.js`
		// 	],
		// 	format: 'iife'
		// }))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(BUILD_PATH));
}

function img() {
	return gulp.src(SRC_IMG_PATH)
		.pipe(gulp.dest(BUILD_PATH));
}

function watch() {
	gulp.watch([SRC_HTML_PATH, SRC_TEMPLATE_PATH], html);
	gulp.watch(SRC_CSS_PATH, css);
	gulp.watch(SRC_JS_PATH, js);
	gulp.watch(SRC_IMG_PATH, img);
}

gulp.task('default', gulp.parallel(html, css, js, img));
gulp.task('watch', gulp.series('default', watch));