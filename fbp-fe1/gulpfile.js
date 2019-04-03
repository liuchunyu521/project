
var gulp = require('gulp'),
nodemon = require('gulp-nodemon'),
path = require('path');
const exec = require('child_process').exec

gulp.task('node-build', function() {
  nodemon({
    script: 'build/build.js',
    watch: [
      'src/apps/**/*.*'
    ]
  });
})


gulp.task('node-dev', function() {
  exec('node build/dev-server.js')
})



let _filesToBuild = {
  appOthers: false, // 是否需要 build others
  appPages: [], // 需要 build 的 pages 列表
  widget: [], // 需要 build 的 widget 列表
};
let watcherTimer = null;

gulp.task('watch', ['node-dev'], function() {
  nodemon({
    script: 'build/build-watch.js',
    watch: [
      'src/**/*.*'
    ]
  })
  .on('restart', function(changedFiles) {
    // console.log(changedFiles);
    changedFiles.forEach(file => {
      file = file.replace(/Src/g, 'src');
      let watchPath = path.normalize(file).replace(/\\/g, '/');
      // let execStr = 'npm run build --- ' + watchPath;
      // console.log(watchPath);
      if (watchPath.indexOf('src/') === -1) {
        return;
      }
      // 截取 'src/' 之后的路径
      let srcPath = watchPath.slice(watchPath.indexOf('src/')).replace('src/', '');
      let pathType = srcPath.split('/')[0]; // apps, widget or widgetVue
      let subDir = srcPath.split('/')[1];
      if (!pathType || !subDir) {
        return;
      }
      // 需要 build 的 widget
      if (pathType === 'widget' && _filesToBuild.widget.indexOf(subDir) === -1) {
          _filesToBuild.widget.push(subDir);
      } else if (pathType === 'apps') {
        if (subDir === 'assets' || subDir === 'common') { // 是否需要 build app 里的 others
          _filesToBuild.appOthers = true;
        } else if (subDir === 'pages') { // 需要 build 的 pages
          let pageDir = srcPath.split('/')[2];
          if (pageDir && _filesToBuild.appPages.indexOf(pageDir) === -1) {
            _filesToBuild.appPages.push(pageDir);
          }
        }
      } else if (pathType === 'widgetVue') {
        console.log('******* widgetVue need build');
      }
      clearTimeout(watcherTimer);
      watcherTimer = setTimeout(() => {
        const execStr = 'node build/build-watch.js ' + JSON.stringify(JSON.stringify(_filesToBuild));
        console.log('***** execStr ***** ', execStr);
        let cp = exec(execStr, (error, stdout, stderr) => {
          // console.log('***** build stdout ***** \n', stdout);
          if (error) {
            console.log('***** build error ***** \n', error);
          }
          if (stderr) {
            console.log('***** build stderr ***** \n', stderr);
          }
          console.log('***** build done *****');
          // 重置各属性
          _filesToBuild = {
            appOthers: false, // 是否需要 build others
            appPages: [], // 需要 build 的 pages 列表
            widget: [], // 需要 build 的 widget 列表
          };
        });
        cp.stdout.on('data', data => {
          // 过滤 fis 打包的输出的 '.'
          if (data.length && data.length !== 11) {
            console.log(data);
          }
        });
      }, 1000);
    });
  });
});

gulp.task('default',['node-build','node-dev']);