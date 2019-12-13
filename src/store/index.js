import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

/*动态导入所有的modules*/
const files = require.context("./modules", false, /\.js$/);
const modules = {};

files.keys().forEach(key => {
	console.log(key)
	modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});

export default new Vuex.Store({
	modules
})
