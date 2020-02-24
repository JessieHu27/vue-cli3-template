import svgIcon from "./svg-icon";
import Vue from "vue";

/*全局注册svg组件*/
Vue.component("icon-svg", svgIcon);

/*导入所有svg图标*/
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context("./svg", false, /\.svg$/);

requireAll(req);
