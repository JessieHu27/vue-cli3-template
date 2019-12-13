const path = require('path')
const {DLL_DIR} =  require('./webpack.config')
/*dll 打包需要单独进行js压缩*/
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
const DllPlugin = require('webpack/lib/DllPlugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
	mode:'production',
	/*添加dll打包*/
	entry: {
		vue: ["vue", 'vuex', 'vue-router'],
		utils: ["axios"]
	},
	output: {
		path: DLL_DIR,
		filename: "[name].dll.js",
		// 库全局变量的名字，如何暴露模块
		library: "[name]"
	},
	optimization: {
		minimizer: [
			// 删除类库文件中的log
			new UglifyJsWebpackPlugin({
				sourceMap: false,
				uglifyOptions: {
					warnings: false,
					compress: {
						drop_debugger: true,
						drop_console: true
					}
				}
			})
		]
	},

	plugins: [
		//删除dll目录
		new CleanWebpackPlugin(),
		new DllPlugin({
			//必须和全局变量即library名字相同，否则DllPlugin插件找不到第三方库
			name: "[name]",
			path: path.join(DLL_DIR, "/[name].manifest.json")
		})
	]
}