let
	gulp = require('gulp'),
	cleanCss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	includeTag = require('gulp-include-tag'),
	sourcemaps = require('gulp-sourcemaps'),
	prettify = require('gulp-prettify'),
	myth = require('gulp-myth'),
	replace = require('gulp-replace'),
	del = require('del');

const
	SRC_PATH = 'src/',
	SRC_HTML_PATH = SRC_PATH + '*.html',
	SRC_TEMPLATE_PATH = SRC_PATH + 'template/*.html',
	SRC_CSS_PATH = SRC_PATH + 'css/*.css',
	SRC_JS_PATH = SRC_PATH + 'js/*.js',
	SRC_IMG_PATH = SRC_PATH + 'img/*',
	BUILD_PATH = './',
	BUILD_HTML_PATH = BUILD_PATH,
	BUILD_CSS_PATH = BUILD_PATH + 'css/',
	BUILD_JS_PATH = BUILD_PATH + 'js/',
	BUILD_IMG_PATH = BUILD_PATH + 'img/',
	SOURCEMAP_PATH = './';

gulp.task('default', ['html', 'css', 'js', 'img']);

gulp.task('html', function () {
	del(BUILD_HTML_PATH + '*.html').then(function () {
		gulp.src(SRC_HTML_PATH, {
			base: SRC_PATH
		})
			.pipe(includeTag())
			.pipe(replace('../lib', 'lib'))
			.pipe(prettify({
				indent_with_tabs: true,
				preserve_newlines: true,
				extra_liners: []
			}))
			.pipe(gulp.dest(BUILD_PATH));
	});
});

gulp.task('css', function () {
	del(BUILD_CSS_PATH).then(function () {
		gulp.src(SRC_CSS_PATH, {
			base: SRC_PATH
		})
			.pipe(sourcemaps.init())
			.pipe(myth())
			.pipe(cleanCss())
			.pipe(sourcemaps.write(SOURCEMAP_PATH))
			.pipe(gulp.dest(BUILD_PATH));
	});
});

gulp.task('js', function () {
	del(BUILD_JS_PATH).then(function () {
		gulp.src(SRC_JS_PATH, {
			base: SRC_PATH
		})
			.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(uglify())
			.pipe(sourcemaps.write(SOURCEMAP_PATH))
			.pipe(gulp.dest(BUILD_PATH));
	});
});

gulp.task('img', function () {
	del(BUILD_IMG_PATH).then(function () {
		gulp.src(SRC_IMG_PATH, {
			base: SRC_PATH
		})
			.pipe(gulp.dest(BUILD_PATH));
	});
});

gulp.task('watch', ['default'], function () {
	gulp.watch([SRC_HTML_PATH, SRC_TEMPLATE_PATH], ['html']);
	gulp.watch(SRC_CSS_PATH, ['css']);
	gulp.watch(SRC_JS_PATH, ['js']);
	gulp.watch(SRC_IMG_PATH, ['img']);
});