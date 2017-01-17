const del          = require('del')
const gulp         = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cssnano      = require('gulp-cssnano')
const gulpif       = require('gulp-if')
const imagemin     = require('gulp-imagemin')
const notify       = require('gulp-notify')
const plumber      = require('gulp-plumber')
const pug          = require('gulp-pug')
const rename       = require('gulp-rename')
const sass         = require('gulp-sass')
const sourcemaps   = require('gulp-sourcemaps')
const uglify       = require('gulp-uglify')

var out = 'dev';
if ((process.env.NODE_ENV != undefined) && process.env.NODE_ENV == "production")
    out = 'public'

// various scss files
var scssFiles = [
    'sass/default.scss',
    'sass/type.scss',
    'sass/noscript.scss',
    'sass/homepage.scss',
    'sass/article.scss',
    'sass/team.scss'
];
var scssOut = out + '/assets/css'

// taken, and modified from bootstrap 3.3.7
var autoprefixerBrowsers = [
    "Android >= 4",
    "last 5 Chrome versions",
    "last 10 Firefox versions",
    "last 5 Opera versions",
    "Explorer > 8",
    "iOS >= 6",
    "Safari >= 6",
];
if (out == 'dev') {
    autoprefixerBrowsers = [ "last 2 versions" ];
}

// various img files
var imagesFiles = 'assets/images/**/*.{png,jpg,jpeg,gif}'
var imagesOut   = out + '/assets/images'

// various html files
var pugFiles = ['pug/**/*.pug', '!pug/_errorpages/**/*.pug']
var pugErrFiles = ['pug/_errorpages/**/*.pug']
var pugOut   = out

// various fonts
var fontFiles = 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg,otf}';
var fontOut = out + '/assets/fonts';

var audioFiles = 'assets/audio/**/*';
var audioOut = out + '/assets/audio';

var jsFiles = [
    'js/common.js',
    'js/root.js',
    'js/team.js'
];

var errorHandler = function(err) {
    notify.onError({
        title: "Gulp error in " + err.plugin,
        message:  err.toString()
    })(err);

    this.emit('end');
};

var gplumber = function() {
    return plumber({
        errorHandler: errorHandler
    });
}

// sass compilation
gulp.task('sass', function () {
    return gulp.src(scssFiles)
        .pipe(gplumber())
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(gulpif( (out != 'dev'), cssnano({
            safe: true
        }) ))
        .pipe(autoprefixer({
            browsers: autoprefixerBrowsers
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(scssOut))
});

// pug compilation
gulp.task('pug', function() {
    var pugopts = {}
    if (out == 'dev') {
        pugopts.pretty = true;
    }

    return gulp.src(pugFiles)
        .pipe(gplumber())
        .pipe(pug(pugopts))
        .pipe(gulp.dest(out))
});

gulp.task('pugerr', function() {
    var pugopts = {}
    if (out == 'dev')
        pugopts.pretty = true;

    return gulp.src(pugErrFiles)
        .pipe(gplumber())
        .pipe(pug(pugopts))
        .pipe(gulp.dest(out + '/_errorpages/'))
});

// assets:images
gulp.task('assets:images', function() {
    var gifopts = {
        interlaced: true,
        optimizationLevel: 3
    };
    var pngopts = {
        optimizationLevel: 7
    }
    if (out == 'dev') {
        gifopts.optimizationLevel = 1;
        pngopts.optimizationLevel = 1;
    }

    return gulp.src(imagesFiles)
        .pipe(gplumber())
        .pipe(imagemin([
            imagemin.gifsicle(gifopts),
            imagemin.jpegtran(),
            imagemin.optipng(pngopts),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest(imagesOut))
});

// assets:favicon
gulp.task('assets:favicon', function() {
    return gulp.src('assets/favicon/**/*')
        .pipe(gulp.dest(out))
});

// assets:fonts
gulp.task('assets:fonts', function() {
    return gulp.src(fontFiles)
        .pipe(gulp.dest(fontOut));
});

// assets:audio
gulp.task('assets:audio', function() {
    return gulp.src(audioFiles)
        .pipe(gulp.dest(audioOut));
})

gulp.task('assets:cv', function() {
    return gulp.src('assets/cv/**/*.pdf')
        .pipe(gulp.dest(out + '/cv'));
});

gulp.task('assets:misc', function() {
    return gulp.src('assets/misc/**/*')
        .pipe(gulp.dest(out + '/misc'));
});

gulp.task('assets', gulp.parallel(
    'assets:images',
    'assets:favicon',
    'assets:fonts',
    'assets:audio',
    'assets:cv',
    'assets:misc')
);

gulp.task('js', function(done) {
    return gulp.src(jsFiles)
        .pipe(gulp.dest(out + '/assets/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(out + '/assets/js'))
        .pipe(gulpif( (out != 'dev'), uglify() ))
        .pipe(gulp.dest('js'));
});

gulp.task('css', gulp.parallel('sass'));

gulp.task('html', gulp.parallel('pug'));

gulp.task('bower', function(done) {
    return gulp.src('./bower_components/**/*')
        .pipe(gulp.dest(out + '/bower')) && done();;
});

// add watchers
gulp.task('init', function(done) {
    // sass
    gulp.watch('sass/**/*.{scss,sass}', gulp.parallel('sass'));

    // pug
    gulp.watch(pugFiles, gulp.parallel('pug'));
    gulp.watch(jsFiles, gulp.series('js', 'pug'));

    // assets
    gulp.watch('assets/favicon/**/*', gulp.parallel('assets:favicon'));
    gulp.watch(imagesFiles, gulp.parallel('assets:images'));
    gulp.watch(fontFiles, gulp.parallel('assets:fonts'));
    gulp.watch(audioFiles, gulp.parallel('assets:audio'));

    done();
});

// clean only html,css for now
gulp.task('clean', function (done) {
    del.sync([
        out + '/**/*.css',
        out + '/**/*.html',
        '!' + out + '/.git'
    ]);
    done();
});

gulp.task('default', gulp.series(
    'clean', gulp.parallel(
        'css', 'js', 'html', 'bower', 'assets'
    ),
    'init'
));
