var gulp = require('gulp'),
	sass = require('gulp-sass'),
	tinypng = require('gulp-tinypng-compress'),
	iconfont = require('gulp-iconfont'),
	autoprefixer = require("gulp-autoprefixer"),
	browserSync = require("browser-sync"),
	iconfontCss = require('gulp-iconfont-css');

gulp.task('iconfont', function(){
	var runTimestamp = Math.round(Date.now()/1000);

	return gulp.src(['./img/icons/*.svg'])
		.pipe(iconfontCss({
			fontName: 'iconfont',
			path: './scss/utils/_icons_template.scss',
			targetPath: '../scss/utils/_icons.scss',
			fontPath: '../fonts/',
			firstGlyph: 0xf120 
		})).pipe(iconfont({
			fontName: 'iconfont',
			formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
			normalize: true,
			prependUnicode: true,
			fontHeight: 1001,
			timestamp: runTimestamp
		})).pipe(gulp.dest('./fonts/'));
});

gulp.task('tinypng', function () {
	return gulp.src('img/**/*.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'iygQs1jIfIYTCxQ36Zsw_comvbPlm0kk',
			sigFile: 'img/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest('img'));
});

gulp.task('scss', function () {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer(
			["last 30 versions"]
		))
		.pipe(gulp.dest('./css/'));
});

gulp.task("reload", function(done) {
	browserSync.create()
	browserSync.init({
		server: "./"
	})
	browserSync.reload();
	done()
})

gulp.task('default', function () {
	gulp.watch('./**/*.html', gulp.series('reload'));
	gulp.watch('./scss/**/*.scss', gulp.series('scss', 'reload'));
	gulp.watch('./img/**/*.{png,jpg,jpeg}', gulp.series('tinypng'));
	gulp.watch('./img/icons/*.svg', gulp.series('iconfont'));
});