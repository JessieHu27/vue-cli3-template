const {GZIP_ON, DLL_DIR} = require('./webpack.config')
const projectName = require('./package.json').name;
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
const {DllReferencePlugin} = require('webpack')
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin"); // 给 index.html 注入 dll 生成的链接库
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const fs = require('fs')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const isProd = process.env.NODE_ENV === 'production'


/*根据环境配置不同的plugin*/
const plugins = [ new CleanWebpackPlugin() ];

if(isProd && fs.existsSync(DLL_DIR)){
	fs.readdirSync(DLL_DIR).forEach(file => {
		if (/.*\.dll\.js$/.test(file)) {
			plugins.push(
				new AddAssetHtmlWebpackPlugin({
					filepath: path.join( DLL_DIR, file),
					outputPath: "js", // 输出路径，相对于默认的输出路径（dist）
					publicPath: "js" // 引入文件路径
				})
			);
		}
		if (/.*\.manifest.json/.test(file)) {
			plugins.push(
				new DllReferencePlugin({
					manifest: path.join(DLL_DIR, file)
				})
			);
		}
	});
}

module.exports = {
	/*history router, hash router 设置为'./'*/
	publicPath:`/${projectName}/`,
	outputDir:'dist',
	devServer:{
		port:8888,
		host:'0.0.0.0',
		https: false,
		open: false,
	},
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('assets', resolve('src/assets'))
			.set('utils', resolve('src/utils'))
		config.module.rule("svg").uses.clear();
		config.module
			.rule("svg")
			.test(/\.svg$/)
			.include.add(path.join(__dirname, "src/icons")) //处理svg目录
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]"
			})
			.end();
		// 修改images loader 添加svg处理
		config.module
			.rule("images")
			.test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
			.exclude.add(path.join(__dirname, "src/icons"))
			.end();
		if(isProd){
			/*移除preload prefetch*/
			config.plugins.delete('preload').delete('prefetch');
			/*压缩 index.html 中的css*/
			config.plugin("html").tap(args => {
				args[0].minify.minifyCSS = true;
				return args;
			});
			/* 注意：gzip需要nginx进行配合 */
			if (GZIP_ON) {
				config
					.plugin("compression")
					.use(CompressionWebpackPlugin)
					.tap(() => [
						{
							test: /\.js$|\.html$|\.css/, //匹配文件名
							threshold: 10240, //超过10k进行压缩
							deleteOriginalAssets: false //是否删除源文件
						}
					]);
			}

		}


	},
	/*
	configureWebpack: {
		optimization:{
			minimizer: [
				new UglifyJsWebpackPlugin({
					sourceMap:false,
					uglifyOptions: {
						warnings: false,
						compress: {
							drop_console: true,//console
							drop_debugger: false,
							pure_funcs: ['console.log']//移除console
						},
					},
				})
			]
		},
		plugins
	},
	*/
	configureWebpack: config => {
		config.optimization.minimizer = [
			new UglifyJsWebpackPlugin({
				sourceMap:false,
				uglifyOptions: {
					warnings: false,
					compress: {
						drop_console: true,//console
						drop_debugger: false,
						pure_funcs: ['console.log']//移除console
					},
				},
			})
		];
		config.plugins = config.plugins.concat(plugins)
	}

}