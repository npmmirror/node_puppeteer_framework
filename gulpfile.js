// ----------------------------------------------------------------------
// ES6 转 ES5 相关配置（前端自动化配置）
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

// 能够优化前端工作流程
var gulp = require('gulp');
// 用于循序执行任务
var sequence = require('run-sequence');
// 监听文件变化
var watchify = require('watchify');


// ----------------------------------------------------
// JS
// ----------------------------------------------------
var babel = require("gulp-babel"); // es6转es5
var jshint = require('gulp-jshint'); // 校验js的工具
// ----------------------------------------------------


// ----------------------------------------------------
// SCSS
// ----------------------------------------------------
var sass = require('gulp-sass'); // 实现编译
var autoprefixer = require('gulp-autoprefixer'); // 补全浏览器兼容的css
var cssmin = require('gulp-clean-css'); // 压缩css

// 这个 task 负责调用其他 task
gulp.task('default', function () {
    // 顺序执行指定任务
    sequence('start');
});


// ----------------------------------------------------
//      JS 编成es5
// ----------------------------------------------------
var js_es6_dir = 'es6'; // 书写的文件
var js_es5_dir = 'es5'; // 编译成浏览器兼容前的临时区

var path_l1 = js_es6_dir + '/*';
var path_l2 = js_es6_dir + '/*/*';
var path_l3 = js_es6_dir + '/*/*/*';
var path_l4 = js_es6_dir + '/*/*/*/*';

gulp.task('compile_js_l1', function () {
    gulp.src(path_l1)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});
gulp.task('compile_js_l2', function () {
    gulp.src(path_l2)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});
gulp.task('compile_js_l3', function () {
    gulp.src(path_l3)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});
gulp.task('compile_js_l4', function () {
    gulp.src(path_l4)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});

// ----------------------------------------------------
//      SCSS
// ----------------------------------------------------
var scss_src = 'public_raw/libs/scss/*.scss'; // 监听scss文件
var css_dst_dir = 'public/libs/css';
// SCSS 编译与压缩 
gulp.task('compile_scss', function () {
    return gulp.src(scss_src)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions', 'Android >= 4.0'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(css_dst_dir));
});



// ----------------------------------------------------
//  监听对应目录所有文件的变化，如果变化， 则执行任务
// ----------------------------------------------------
gulp.task('watch', function () {
    gulp.watch(path_l1, ['compile_js_l1']);
    gulp.watch(path_l2, ['compile_js_l2']);
    gulp.watch(path_l3, ['compile_js_l3']);
    gulp.watch(path_l4, ['compile_js_l4']);
    gulp.watch(scss_src, ['compile_scss']);
});


// ----------------------------------------------------
gulp.task('start', function () {
    sequence(
        'compile_js_l1', 'compile_js_l2', 'compile_js_l3', 'compile_js_l4',
        'compile_scss', 'watch'
    );
});