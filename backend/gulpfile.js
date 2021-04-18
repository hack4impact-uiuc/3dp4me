const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs = require('fs');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const log = require('fancy-log');
var exec = require('child_process').exec;

const paths = {
    prod_build: '../prod-build',
    server_file_name: 'server.bundle.js',
    react_src: '../frontend/build/**/*',
    react_dist: '../prod-build/frontend/build',
    zipped_file_name: 'full-application.zip',
};

paths.server_source_dest = `${paths.prod_build}/bin`;

function clean() {
    log('removing the old files in the directory');
    del('build/**', { force: true });
    return del('../prod-build/**', { force: true });
}

function createProdBuildFolder() {
    const dir = paths.prod_build;
    log(`Creating the folder if not exist  ${dir}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        log('📁  folder created:', dir);
    }

    const server_dir = paths.server_source_dest;
    if (!fs.existsSync(server_dir)) {
        fs.mkdirSync(server_dir);
        log('📁  folder created:', server_dir);
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

function buildServerCodeTask(cb) {
    log('building server code into the directory');
    return exec('yarn build', function (err, stdout, stderr) {
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
    src('build/index.js')
        .pipe(rename('www'))
        .pipe(dest(`${paths.server_source_dest}`));
    src(['build/index.js.map']).pipe(dest(`${paths.server_source_dest}`));
    return src(['package.json', '.env', '.npmrc']).pipe(
        dest(`${paths.prod_build}`),
    );
}

function zippingTask() {
    log('zipping the code ');
    return src(`${paths.prod_build}/**`, { dot: true })
        .pipe(zip(`${paths.zipped_file_name}`))
        .pipe(dest(`${paths.prod_build}`));
}

exports.default = series(
    clean,
    createProdBuildFolder,
    parallel(buildReactCodeTask, buildServerCodeTask),
    parallel(copyReactCodeTask, copyNodeJSCodeTask),
    zippingTask,
);
