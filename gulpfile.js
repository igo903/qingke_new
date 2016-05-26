let
	gulp = require('gulp'),
	changed = require('gulp-changed'),
	includeTag = require('gulp-include-tag'),
	prettify = require('gulp-prettify'),
	myth = require('gulp-myth');

const
	SRC_PATH = 'src/',
	SRC_HTML_PATH = SRC_PATH + '*.html',
	SRC_TEMPLATE_PATH = SRC_PATH + 'template/*.html',
	SRC_CSS_PATH = SRC_PATH + '**/*.css',
	BUILD_PATH = './';

gulp.task('default', ['html', 'css']);

gulp.task('html', function () {
	return gulp.src(SRC_HTML_PATH)
		.pipe(includeTag())
		.pipe(prettify({
			indent_with_tabs: true,
			preserve_newlines: true,
			extra_liners: []
		}))
		.pipe(gulp.dest(BUILD_PATH));
});

gulp.task('css', function () {
	return gulp.src(SRC_CSS_PATH)
		.pipe(changed(BUILD_PATH))
		.pipe(myth())
		.pipe(gulp.dest(BUILD_PATH));
});

gulp.task('watch', ['default'], function () {
	gulp.watch([SRC_HTML_PATH, SRC_TEMPLATE_PATH], ['html']);
	gulp.watch(SRC_CSS_PATH, ['css']);
});