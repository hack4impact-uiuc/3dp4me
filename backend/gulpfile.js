const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
var exec = require('child_process').exec;

const paths = {
    prod_build: '../prod-build',
    server_file_name: 'server.bundle.js',
    react_src: '../frontend/build/**/*',
    react_dist: '../prod-build/frontend/build',
    zipped_file_name: 'full-application.zip',
};

function clean() {
    log('removing the old files in the directory');
    return del('../prod-build/**', { force: true });
}

function createProdBuildFolder() {
    const dir = paths.prod_build;
    log(`Creating the folder if not exist  ${dir}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        log('📁  folder created:', dir);
    }

    return Promise.resolve('the value is ignored');
}

function buildReactCodeTask(cb) {
    log('building React code into the directory');
    return exec('cd ../frontend && yarn build', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
}

function copyReactCodeTask() {
    log('copying React code into the directory');
    return src(`${paths.react_src}`).pipe(dest(`${paths.react_dist}`));
}

function copyNodeJSCodeTask() {
    log('building and copying server code into the directory');
    return src(['package.json', 'app.js']).pipe(dest(`${paths.prod_build}`));
}

function zippingTask() {
    log('zipping the code ');
    return src(`${paths.prod_build}/**`)
        .pipe(zip(`${paths.zipped_file_name}`))
        .pipe(dest(`${paths.prod_build}`));
}

exports.default = series(
    clean,
    createProdBuildFolder,
    buildReactCodeTask,
    parallel(copyReactCodeTask, copyNodeJSCodeTask),
    zippingTask,
);
