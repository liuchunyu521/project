const fs = require('fs');
const path = require('path');
const rm = require('rimraf');
const cpr = require('cpr').cpr;
const fis3 = require('fis3');
const uglifyjs = require('uglify-js');
const CleanCSS = require('clean-css');
const cssMinify = new CleanCSS();
const crypto = require('crypto');
const config = require('../config');
const pkg = require('../package.json');
const pkgName = pkg.name;

// paths
const srcBasePathApps = __dirname + '/../src/apps/';
const distBasePath = __dirname + '/../dist/' + pkgName;
// others related: assets, common
const srcBasePathAssets = __dirname + '/../src/apps/assets/';
const srcBasePathCommon = __dirname + '/../src/apps/common/';
const distBasePathCommon = __dirname + '/../dist/' + pkgName + '/common';
const distBasePathAssets = __dirname + '/../dist/' + pkgName + '/assets';
// widget related
const srcBasePathWidget = __dirname + '/../src/widget/';
const distBasePathWidget = __dirname + '/../dist/' + pkgName + '/widget/';

// 遍历pages下面的index.js，将对应的文件合并
const srcBasePathPages = __dirname + '/../src/apps/pages/';
const distBasePathPages = __dirname + '/../dist/' + pkgName + '/pages';
const outputBasePath = __dirname + '/../dist/' + pkgName + '/output';
const outputPagesBasePath = __dirname + '/../dist/' + pkgName + '/output' + '/pages';
const distWidgetCssBasePath = __dirname + '/dist/' + pkgName + '/widget';
const outputWidgetBasePath = __dirname + '/../dist/' + pkgName + '/output' + '/src/widgetVue/';
const distWidgetCommonBasePath = __dirname + '/../dist/' + pkgName + '/output' + '/src/widgetVue/commonVue/common';

// aquire process args
let same_path_flag = '';
const processArgv = process.argv;
// console.log(processArgv);
if (!Array.isArray(processArgv) || processArgv.length <= 2) {
	// console.log('nothing to build');
	return;
}
let _filesToBuild = processArgv.slice(2);
try {
	_filesToBuild = JSON.parse(_filesToBuild[0]);
} catch (error) {
	_filesToBuild = '';
}
console.log('====> build args: ', _filesToBuild);
if (!_filesToBuild) {
	console.log('nothing to build');
	return;
}
// build widget
const widgetsToBuild = _filesToBuild.widget;
// build pages
const pagesToBuild = _filesToBuild.appPages;
let pageConfigs = fs.readFileSync(path.resolve(distBasePath + '/config.js'), 'utf8');
try {
	pageConfigs = JSON.parse(pageConfigs);
} catch (error) {
	pageConfigs = {};
	pageConfigs[pkgName] = {};
}
// if (Array.isArray(pagesToBuild) && pagesToBuild.length) {
	fis3Release();
// }

// build assets and commons
function buildAppOthers() {
	console.log('====> start building app others');

	// remove assets dir
	rm(path.resolve(distBasePathAssets), err => {
		if (err) {
			throw err;
			process.exit();
		}
		console.log('----> assets dir removed');
		// remove common dir
		rm(path.resolve(distBasePathCommon), err => {
			if (err) {
				throw err;
				process.exit();
			}
			console.log('----> common dir removed');
			// copy assets
			cpr(path.resolve(srcBasePathAssets), path.resolve(distBasePathAssets), {}, err => {
				if (err) {
					throw err;
					process.exit();
				}
				console.log('----> assets dir copied');
				// build common files
				fs.mkdirSync(path.resolve(distBasePathCommon));
				const commonJsPath = path.join(distBasePathCommon, '/index.js');
				const commonCssPath = path.join(distBasePathCommon, '/index.css');
				fs.writeFileSync(commonJsPath, '');
				fs.writeFileSync(commonCssPath, '');
				console.log('----> building common file');
				parseOtherFile('', '');
				console.log('----> common file built');
				// console.log('----> building common min file');
				// let md5jsFileName = minJsFun(distBasePathCommon, '/index');
				// let md5cssFileName = minCssFun(distBasePathCommon, '/index');
				// console.log('----> common min file built');
				console.log('----> building common md5 file');
				let md5jsFileName = md5Fun(distBasePathCommon, '/index', 'js');
				let md5cssFileName = md5Fun(distBasePathCommon, '/index', 'css');
				console.log('----> common md5 file built');
				pageConfigs[pkgName]['common'] = {};
				pageConfigs[pkgName]['common']['js'] = md5jsFileName.slice(1);
				pageConfigs[pkgName]['common']['css'] = md5cssFileName.slice(1);
				fs.writeFileSync(distBasePath + '/config.js', JSON.stringify(pageConfigs));
				console.log('====> app others built');
			});
		});
	});
}

// fis3 打包
function fis3Release() {
	if (fs.existsSync(path.resolve(outputBasePath))) {
		console.log('----> output dir exists');
		rm(path.resolve(outputBasePath), err => {
			if (err) {
				throw err;
				process.exit();
			}
			console.log('----> output dir removed');
			runFis3Release();
		});
		// emptyDir(path.resolve(outputBasePath));
		// rmEmptyDir(path.resolve(outputBasePath));
	} else {
		runFis3Release();
	}
}

function runFis3Release() {
	console.log('----> fis3 running');
	fis3.cli.run({
		_: ['release'],
		d: './dist/' + pkgName + '/output'
	}, {
		cwd: path.resolve(__dirname, '../'),
		configPath: path.resolve(__dirname, '../fis-conf.js'),
	});
	// build others
	if (_filesToBuild.appOthers === true) {
		buildAppOthers();
	}
	// build pages
	if (Array.isArray(pagesToBuild) && pagesToBuild.length) {
		buildAppPages();
	}
	// build widget
	if (Array.isArray(widgetsToBuild) && widgetsToBuild.length) {
		buildWidget();
	}
}

function buildWidget() {
	console.log('====> start building widget');
	// widgetsToBuild.forEach(widget => {
	// 	console.log('----> start building widget: ', widget);
	// 	parseWidgetFile(widget, '');
	// 	console.log('----> ' + widget + ' built');
	// });
	rm(path.resolve(distBasePathWidget), err => {
		if (err) {
			throw err;
			process.exit();
		}
		cpr(path.resolve(srcBasePathWidget), path.resolve(distBasePathWidget), {}, err => {
			if (err) {
				throw err;
				process.exit();
			}
			parseWidgetFile('', '');
			console.log('====> widget built');
		});
	});
}

// 记录路由与js css的对应关系
function buildAppPages() {
	console.log('====> start building app pages');
	pagesToBuild.forEach(page => {
		console.log('----> start building page: ', page);
		parsePagesFile(page, '');
		console.log('----> ' + page + ' built');
	});
	fs.writeFileSync(distBasePath + '/config.js', JSON.stringify(pageConfigs));
	console.log('====> app pages built');
}


/**
 *  build assets and commons
 */
function parseOtherFile(curPath, name) {
	let filePath = path.join(outputBasePath, curPath, name)
	if (curPath === '/pages' || curPath === '/src') {
		return;
	}
	let state = fs.statSync(filePath);
	if (state.isDirectory()) {
		let dir = fs.readdirSync(filePath);
		if (name.length > 0) {
			curPath = curPath + '/' + name;
		}
		dir.forEach((index) => {
			parseOtherFile(curPath, index);
		});
	} else {
		let c = fs.readFileSync(filePath);
		let p;
		if (endsWith(filePath, 'js')) {
			p = path.join(distBasePathCommon, '/index.js');
		} else if (endsWith(filePath, 'css')) {
			p = path.join(distBasePathCommon, '/index.css');
		}
		if (p) {
			let b = fs.readFileSync(p);
			fs.writeFileSync(p, b.toString() + ' \n ' + c.toString());
		}

	}
}

/**
 * build pages
 */
function parsePagesFile(curPath, name) {
	let filePath = path.join(srcBasePathPages, curPath, name);
	let state = fs.statSync(filePath);
	if (state.isDirectory()) {
		let dir = fs.readdirSync(filePath);
		if (name.length > 0) {
			curPath = curPath + '/' + name;
		}
		dir.forEach((index) => {
			if (index != 'src') {
				parsePagesFile(curPath, index);
			}
		});
	} else if (name === 'index.js') {
		// console.log('get index.js in ' + curPath)
		buildPagesFile(curPath);
	}
}
function buildPagesFile(curPath) {
	// 合并目录下的文件
	let jsPath = path.join(distBasePathPages, curPath + '.js');
	let cssPath = path.join(distBasePathPages, curPath + '.css');

	fs.writeFileSync(jsPath, '');
	fs.writeFileSync(cssPath, '');
	concatFile(curPath, '', 'js');
	concatFile(curPath, '', 'css');
	// 压缩产出的js及css
	// let md5jsFileName = minJsFun(distBasePathPages, curPath)
	// let md5cssFileName = minCssFun(distBasePathPages, curPath)
	let md5jsFileName = md5Fun(distBasePathPages, curPath, 'js');
	let md5cssFileName = md5Fun(distBasePathPages, curPath, 'css');
	let routerFile = require(path.join(srcBasePathPages, curPath, 'index.js'));
	pageConfigs[pkgName][curPath] = {};
	pageConfigs[pkgName][curPath]['js'] = md5jsFileName;
	pageConfigs[pkgName][curPath]['css'] = md5cssFileName;
	for (let i in routerFile.routes) {
		let oldComponent = routerFile.routes[i]['component'];
		if (oldComponent.indexOf('.') === 0) {
			oldComponent = oldComponent.substring(1);
		}
		routerFile.routes[i]['realComponent'] = curPath + oldComponent;
		routerFile.routes[i]['pkgName'] = pkgName;
		routerFile.routes[i]['curPage'] = curPath;
	}
	pageConfigs[pkgName]['routers'] = pageConfigs[pkgName]['routers'].concat(routerFile.routes);
}


function concatFile(srcBasePath, curPath, type) {
	let filePath = path.join(outputPagesBasePath, srcBasePath, curPath);
	let state = fs.statSync(filePath);
	if (state.isDirectory()) {
		let dir = fs.readdirSync(filePath);
		dir.forEach((index) => {
			concatFile(srcBasePath, curPath + '/' + index, type);
		});
	} else {
		if (endsWith(filePath, type) && !endsWith(curPath, 'index.js')) {
			// console.log('get (' + type + ') at :' + filePath)
			// console.log('srcBasePath:' + srcBasePath + '\n\n')
			let c = fs.readFileSync(filePath);
			let p;
			if (type === 'js') {
				p = path.join(distBasePathPages, srcBasePath + '.js');
			} else if (type === 'css') {
				p = path.join(distBasePathPages, srcBasePath + '.css');
			}
			let b = fs.readFileSync(p);
			let cReplacedAssets = c.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
			let bReplacedAssets = b.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
			fs.writeFileSync(p, bReplacedAssets + ' \n ' + cReplacedAssets);
		}
	}
}

/**
 * build widget
 */
function parseWidgetFile(curPath, name) {
	let filePath = path.join(srcBasePathWidget, curPath, name);
	let state = fs.statSync(filePath);
	if (state.isDirectory()) {
		let dir = fs.readdirSync(filePath);
		if (name.length > 0) {
			curPath = curPath + '/' + name;
		}
		dir.forEach((index) => {
			if (index != 'pages') {
				parseWidgetFile(curPath, index);
			}
		});
	} else if (name == 'index.vue') {
		// console.log('get a.txt in ' + curPath)
		buildWidgetFile(curPath);
	}
}
function buildWidgetFile(curPath) {
	fs.mkdirSync(path.resolve(distWidgetBasePath + curPath));
	let jsPath = path.join(distWidgetBasePath + curPath, curPath + '.js');
	let cssPath = path.join(distWidgetBasePath + curPath, curPath + '.css');
	fs.writeFileSync(jsPath, '');
	fs.writeFileSync(cssPath, '');
	concatFileWidget(curPath, '', 'js');
	same_path_flag = '';
	concatFileWidget(curPath, '', 'css');
}

//读取output代码 写入ifbp-fe/zh-cn目录
function concatFileWidget(srcBasePathWidget, curPath, type) {
	let filePath = path.join(outputWidgetBasePath, srcBasePathWidget, curPath);
	let state = fs.statSync(filePath);
	if (state.isDirectory()) {
		let dir = fs.readdirSync(filePath);
		dir.forEach((index) => {
			concatFileWidget(srcBasePathWidget, curPath + '/' + index, type);
		});
	} else {
		if (endsWith(filePath, type)) {
			// console.log('get (' + type + ') at :' + filePath)
			// console.log('srcBasePathWidget:' + srcBasePathWidget + '\n\n')
			let c = fs.readFileSync(filePath);
			let p,common;
			if (type === 'js') {
				p = path.join(distWidgetBasePath, srcBasePathWidget + srcBasePathWidget + '.js');
				common = path.join(distWidgetCommonBasePath + '.js');
			} else if (type === 'css') {
				p = path.join(distWidgetBasePath, srcBasePathWidget + srcBasePathWidget + '.css');
				common = path.join(distWidgetCommonBasePath + '.css');
			}
			let b = fs.readFileSync(p);
			let com, d;
			if (type === 'js' && same_path_flag != srcBasePathWidget + srcBasePathWidget) {
				com = fs.readFileSync(common);
				d = `
					define(function () {
						function init(el) {
							require(['${ pkgName }^./widgetVue${ srcBasePathWidget }/index.vue','css!/${ pkgName + '/widget' + srcBasePathWidget + srcBasePathWidget }.css'], function (obj) {
										 var comp = Vue.extend(obj.default);
										 var newComp = new comp();
							 var compMount = newComp.$mount();
							 $('#' + el).html('');
							 $('#' + el)[0].appendChild(compMount.$el);
							});
						}
						return {
							init: init
						}
					});
				`
			} else {
				d = '';
				com = '';
			}
			if (type === 'css' && same_path_flag != srcBasePathWidget + srcBasePathWidget) {
				com = fs.readFileSync(common);
			}
			let bReplacedAssets = b.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
			let cReplacedAssets = c.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
			fs.writeFileSync(p, bReplacedAssets + ' \n ' + cReplacedAssets + com.toString() + d);
			same_path_flag = srcBasePathWidget + srcBasePathWidget;
		}
	}
}

/**
 * utils
 */
function concatFile(srcBasePath, curPath, type) {
	let filePath = path.join(outputPagesBasePath, srcBasePath, curPath)
	let state = fs.statSync(filePath)
	if (state.isDirectory()) {
		let dir = fs.readdirSync(filePath)
		dir.forEach((index) => {
			concatFile(srcBasePath, curPath + '/' + index, type)
		})
	} else {
		if (endsWith(filePath, type) && !endsWith(curPath, 'index.js')) {
			// console.log('get (' + type + ') at :' + filePath)
			// console.log('srcBasePath:' + srcBasePath + '\n\n')
			let c = fs.readFileSync(filePath)
			let p
			if (type === 'js') {
				p = path.join(distBasePathPages, srcBasePath + '.js')
			} else if (type === 'css') {
				p = path.join(distBasePathPages, srcBasePath + '.css')
			}
			let b = fs.readFileSync(p)
			let cReplacedAssets = c.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
			let bReplacedAssets = b.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
			fs.writeFileSync(p, bReplacedAssets + ' \n ' + cReplacedAssets)
		}
	}
}
function minJsFun(basePath, name) {
	let b = fs.readFileSync(path.join(basePath, name + '.js'))
	let minJs = uglifyjs.minify(b.toString())
	let md5js = crypto.createHash('md5')
	let md5jsStr = md5js.update(minJs.code).digest('hex')
	let md5jsFileName = name + '.' + md5jsStr + '.js'
	fs.writeFileSync(path.join(basePath, md5jsFileName), minJs.code)
	return md5jsFileName
}

function minCssFun(basePath, name) {
	let data = fs.readFileSync(path.join(basePath, name + '.css'))
	let minCss = cssMinify.minify(data.toString())
	let md5css = crypto.createHash('md5')
	let md5cssStr = md5css.update(minCss.styles).digest('hex')
	let md5cssFileName = name + '.' + md5cssStr + '.css'
	fs.writeFileSync(path.join(basePath, md5cssFileName), minCss.styles)
	return md5cssFileName
}

function md5Fun(basePath, name, type) {
	let b = fs.readFileSync(path.join(basePath, name + '.' + type))
	let md5js = crypto.createHash('md5')
	let md5jsStr = md5js.update(b.toString()).digest('hex')
	let md5jsFileName = name + '.' + md5jsStr + '.' + type
	fs.writeFileSync(path.join(basePath, md5jsFileName), b.toString())
	return md5jsFileName
}
function endsWith(str, endStr) {
	return str.slice(-endStr.length) == endStr
}

function emptyDir(fileUrl) {
	let files = fs.readdirSync(fileUrl); //读取该文件夹
	files.forEach(function (file) {
		let stats = fs.statSync(fileUrl + '/' + file);
		if (stats.isDirectory()) {
			emptyDir(fileUrl + '/' + file);
		} else {
			fs.unlinkSync(fileUrl + '/' + file);
			//  console.log('删除文件'+fileUrl+'/'+file+'成功');
		}
	});
}
function rmEmptyDir(fileUrl) {
	let files = fs.readdirSync(fileUrl);
	if (files.length > 0) {
		let tempFile = 0;
		files.forEach(function (fileName) {
			tempFile++;
			rmEmptyDir(fileUrl + '/' + fileName);
		});
		if (tempFile == files.length) { //删除母文件夹下的所有字空文件夹后，将母文件夹也删除
			fs.rmdirSync(fileUrl);
			// console.log('删除空文件夹'+fileUrl+'成功');
		}
	} else {
		fs.rmdirSync(fileUrl);
		// console.log('删除空文件夹'+fileUrl+'成功');
	}
}