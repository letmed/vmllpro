var { src , dest , series , parallel , watch } = require('gulp');
var clean = require('gulp-clean');
var fileInclude = require('gulp-file-include');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');

function cleanTask(){
    return src('/dist' , {allowEmpty : true})
           .pipe( clean() );
}

function fileIncludeTask(){
    return src ('./src/view/*.html')
    .pipe(fileInclude({
        prefix : '@',
        basepath : './src/view/templates'
    }))
    .pipe(dest('./dist/view'));
}

function webserverTask(){
    return src('./dist')
            .pipe( webserver({
                host : 'localhost',
                port : 4000,
                open : './view/index.html',
                livereload : true   
            }));
}

function sassTask(){
    return src('./src/css/*.scss')
            .pipe(sass())
            .pipe(dest('./dist/css'));
}

function staticTask(){   //把src中的静态资源同步到dist下
    return src('./src/static/**')
            .pipe(dest('./dist/static'));
}

function watchTask(){
    watch('./src/view/**' , fileIncludeTask);
    watch('./src/css/**' , sassTask);
    watch('./src/static/**' , staticTask);
}

module.exports = {
    //开发环境下的命令
    dev : series(cleanTask , parallel(fileIncludeTask , sassTask , staticTask) , parallel(webserverTask , watchTask) ) ,
    //生产环境下的命令
    build : series(cleanTask) 
};