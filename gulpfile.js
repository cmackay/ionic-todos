
'use strict';

/**
 * Module dependencies.
 */
var gulp      = require('gulp'),
  plugins     = require('gulp-load-plugins')({ lazy: false }),
  buffer      = require('vinyl-buffer'),
  source      = require('vinyl-source-stream'),
  watchify    = require('watchify'),
  runSequence = require('run-sequence'),
  connect     = require('connect'),
  livereload  = require('connect-livereload'),
  config      = require('./config');

gulp.task('clean', function () {
  // clean temp and dist
  return gulp.src([
      '.tmp',
      'dist'
    ], {
      read: false
    })
    .pipe(plugins.clean());
});

gulp.task('clean-all', function () {
  // clean all
  return gulp.src([
      '.tmp',
      'dist',
      'node_modules'
    ], {
      read: false
    })
    .pipe(plugins.clean());
});

gulp.task('jshint', function () {
  // lint scripts
  return gulp.src([
      'lib/**/*.js'
    ])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
  return gulp.src('lib/*.scss')
    .pipe(plugins.sass())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('ng-templates', function () {
  // create an angular templates.js file from html files in lib
  return gulp.src('lib/**/*.html')
    .pipe(plugins.angularTemplatecache('templates.js', {
      module: config.ngModule
    }))
    .pipe(gulp.dest('.tmp/js'));
});

gulp.task('watchify', function () {
  var bundler = watchify('./lib/index.js');

  var rebundle = function () {
    return bundler.bundle({
        insertGlobals: true,
        debug: true,
      })
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(gulp.dest('.tmp/'))
      .on('end', plugins.util.log)
      .on('error', plugins.util.log);
  };

  bundler
    .on('update', rebundle)
    .on('error', plugins.util.log);

  return rebundle();
});

gulp.task('watch', function (done) {
  runSequence(
    'sass',
    'livereload',
    'watchify',
    'connect',
    'open'
  );
  gulp.watch('lib/*.scss', ['sass']);
});

gulp.task('test', function () {

});

gulp.task('open', function () {
  // open the browser
  require('open')('http://localhost:' + config.www.port);
});

gulp.task('connect', function (done) {
  // start connect server
  connect()
    .use(connect.logger('dev'))
    .use(livereload({
      port: config.livereload.port
    }))
    .use('/cordova.js', function (req, res) {
      res.setHeader('Content-Type', 'application/javascript');
      res.end('(function(){})();');
    })
    .use(connect.static('.tmp'))
    .use(connect.static('lib'))
    .use('/fonts', connect.static('node_modules/ionic/release/fonts'))
    .listen(config.www.port);
  done();
});

gulp.task('livereload', function () {
  // start the live reload server
  var livereloadServer = plugins.livereload();
  // reload static files when changed
  return gulp.watch([
    'lib/*',
    '!lib/*.scss',
    '.tmp/*'
  ], function (event) {
    livereloadServer.changed(event.path);
  });
});

gulp.task('bump', function () {
  // increment project version
  return gulp.src([
      './package.json'
    ])
    .pipe(plugins.bump())
    .pipe(gulp.dest('.'));
});

gulp.task('git-tag', function () {
  // tag the release in git
  var pkg = require('./package.json'),
    version = 'v' + pkg.version,
    message = 'Release ' + version;

  return gulp.src('.')
    .pipe(plugins.git.commit(message))
    .pipe(plugins.git.tag(version, message))
    .pipe(plugins.git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('.'));
});

gulp.task('npm-publish', function (done) {
  // publish npm
  require('child_process')
    .spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('default', function () {
  gulp.start('watch');
});
