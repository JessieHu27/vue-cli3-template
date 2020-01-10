module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ["plugin:vue/essential", "@vue/prettier", 'eslint:recommended'],
	rules: {
		"indent": ["warn", "tab"],
	},
	parserOptions: {
		parser: "babel-eslint"
	}
};