const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssnano = require('gulp-cssnano');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const watch = require('gulp-watch');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cached');


gulp.task('scripts', function() {
    return gulp.src(['./dev/components/**/*.js', './dev/js/common.js'])
        .pipe(plumber({ errorHandler: handleErrors }))
        .pipe(named())
        .pipe(webpackStream({
            watch: true,
            module: {
                loaders: [{
                    test: /.js?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015']
                    }
                }]
            },
            plugins: [
                new webpack.NoErrorsPlugin()
            ]
        }))
        .pipe(gulp.dest('./public/'));
});



gulp.task('clean:styles', function() {
    return del(['./public/css/*.css']);
});

gulp.task('clean:script', function() {
    return del(['./public/js/*.js']);
});

gulp.task('postcss', function() {
    return gulp.src('./dev/**/*.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(sass({
       errLogToConsole: true,
       outputStyle: 'expanded'
    }))
    .pipe(postcss([
       autoprefixer({ browsers: ['last 2 version'] }),
    ]))
    .pipe(cache('postcss'))
    .pipe(sourcemaps.write())
    .pipe(rename(function (path) {
        path.dirname = "";
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.stream());
});

gulp.task('cssnano', ['postcss'],  function() {
    return gulp.src('./public/css/*.css')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(cssnano({ safe: true }))
    .pipe(rename(function (path) {
        path.basename = path.basename + '.min';
    }))
    .pipe(gulp.dest('./public/css/'));
});


let startBuild = true;
gulp.task('scripts', function(callback) {
    return gulp.src(['./dev/components/**/*.js', './dev/js/common.js'])
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(named())
    .pipe(webpackStream({
        watch: true,
        devtool: 'cheap-module-inline-source-map',
        module: {
            loaders: [{
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }]
        },
        plugins: [
            new webpack.NoErrorsPlugin()
        ]
    }, null, function(err, stats) {
        if (startBuild) {
            startBuild = false;
            callback();
        }
    }))
    .pipe(gulp.dest('./public/js/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['postcss', 'scripts', 'assets', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: './public/'
        },
    });
    watch('./dev/**/*.scss', function () {
        gulp.start('postcss');
    });
    watch(['./dev/**/*.js'], function () {
        gulp.start('scripts');
    });
    watch(['./dev/{fonts,svg}/**/*', './dev/*.html', './lib/*'], function () {
        gulp.start('assets');
    });
    watch(['./dev/images/**/*'], function () {
        gulp.start('images');
    });
});

gulp.task('assets', function() {
    return gulp.src(['./dev/{fonts,svg}/**/*', './dev/*.html', './lib/*'])
    .pipe(changed('./public/'))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
    return gulp.src('./dev/images/**/*')
    .pipe(changed('./public/images/'))
    .pipe(imagemin())
    .pipe(gulp.dest('./public/images/'))
    .pipe(browserSync.stream());
});

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Task Failed [<%= error.message %>',
        message: 'See console.',
        sound: 'Sosumi'
    }).apply(this, args);
    gutil.beep();
    this.emit('end');
}


gulp.task('clean:build', function() {
    return del(['./public/*']);
});

gulp.task('scripts-build', function() {
    return gulp.src(['./dev/components/**/*.js', './dev/js/common.js'])
        .pipe(plumber({ errorHandler: handleErrors }))
        .pipe(named())
        .pipe(webpackStream({
            module: {
                loaders: [{
                    test: /.js?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015']
                    }
                }]
            },
            plugins: [
                new webpack.NoErrorsPlugin()
            ],
            output: {
                library: ["library", "[name]"],
            },
        }))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('postcss-build', function() {
    return gulp.src('./dev/**/*.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sass({
       errLogToConsole: true,
       outputStyle: 'expanded'
    }))
    .pipe(postcss([
       autoprefixer({ browsers: ['last 2 version'] }),
    ]))
    .pipe(rename(function (path) {
        path.dirname = "";
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.stream());
});

gulp.task('assets-build', function() {
    return gulp.src(['./dev/{fonts,svg}/**/*', './dev/*.html', './dev/lib/*'])
    .pipe(gulp.dest('./public/'))
});

gulp.task('images-build', function() {
    return gulp.src('./dev/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/images/'))
});


gulp.task('rebuild', ['clean:build'], function() {
    gulp.start('scripts-build');
    gulp.start('postcss-build');
    gulp.start('assets-build');
    gulp.start('images-build');
    return true;
});


const template = 'jumedica';

const path = {
            'breadcrumbs': 'bitrix/breadcrumb/.default',
            'catalog-categories': 'bitrix/catalog/catalog/bitrix/catalog.section.list/.default',
            'catalog-list': 'bitrix/catalog.section/.default',
            'product-detail': 'bitrix/catalog.element/.default',
            'news-list': 'bitrix/news/news/bitrix/news.list/.default',
            'news-detail': 'bitrix/news/news/bitrix/news.detail/.default',
            'other-news': 'bitrix/news.list/other-news',
            'exhibitions-list': 'bitrix/news/exhibitions/bitrix/news.list/.default',
            'exhibition-detail': 'bitrix/news/exhibitions/bitrix/news.detail/.default',
            'gallery-slider': 'bitrix/news.list/gallery-slider',
            }

const pathExcludeJS = [];
const pathExcludeCSS = [];

gulp.task('compile', function() {
    for (let name in path) {
        if (pathExcludeJS.indexOf(name) == -1) {
            gulp.src('public/js/'+name+'.js')
            .pipe(rename('script.js'))
            .pipe(gulp.dest('public/'+template+'/components/'+path[name]));
        }

        if (pathExcludeCSS.indexOf(name) == -1) {
            gulp.src('public/css/'+name+'.css')
            .pipe(rename('style.css'))
            .pipe(gulp.dest('public/'+template+'/components/'+path[name]));
        }
    }

    gulp.src('public/css/common.css')
        .pipe(rename('common.css'))
        .pipe(gulp.dest('public/'+template+'/css/'));

    return true;
});
