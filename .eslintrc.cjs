module.exports = {
  root: true,
  // 环境
  env: {
    browser: true, // 浏览器环境
    es2021: true // ES12
  },
  // 全局变量
  globals: {},
  // 继承规则
  extends: [
    'standard',
    './.eslintrc-auto-import.json',
    'plugin:vue/vue3-recommended',
    'plugin:vue-scoped-css/vue3-recommended'
  ],
  // 重写规则
  overrides: [],

  // 解析器
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  // 插件
  plugins: ['vue'],

  // 规则
  rules: {
    // Possible Errors
    // 要求使用 let 或 const 而不是 var
    'no-var': 'warn',
    // 强制 "for" 循环中更新子句的计数器朝着正确的方向移动
    'for-direction': 'warn',
    // 强制 getter 函数中出现 return 语句
    'getter-return': 'warn',
    // 禁止在嵌套的块中出现变量声明或 function 声明
    'no-inner-declarations': 'warn',
    // 禁止由于 await 或 yield的使用而可能导致出现竞态条件的赋值
    'require-atomic-updates': 'warn',
    // console 警告
    'no-console': 'warn',
    // 禁止出现未使用过的变量
    'no-unused-vars': [
      'warn',
      {
        args: 'all',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all'
      }
    ],
    // 关闭名称校验
    'vue/multi-word-component-names': 'off',
    // 非生产环境启用 debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Best Practices
    eqeqeq: 'off',

    // Stylistic Issues
    // 强制可嵌套的块的最大深度
    'max-depth': ['warn', 5],
    // 强制函数最大代码行数
    'max-lines-per-function': [
      'warn',
      {
        max: 150,
        skipBlankLines: true
      }
    ],
    // 强制回调函数最大嵌套深度
    'max-nested-callbacks': ['warn', {max: 10}],
    // 强制函数定义中最多允许的参数数量
    'max-params': ['warn', {max: 5}],
    // 强制每一行中所允许的最大语句数量
    'max-statements-per-line': ['warn', {max: 1}],
    // 三目运算符换行
    'multiline-ternary': ['warn', 'never'],
    // 传值给组件时的使用 kebab-case
    'vue/v-on-event-hyphenation': ['warn', 'always', {
      autofix: true,
      ignore: []
    }],
    // 禁用 object-curly-spacing 规则
    'object-curly-spacing': 'off',
    // 禁用 quotes 规则
    'quotes': 'off',
    // 禁用 semi 规则
    'semi': 'off',
    // 禁用 space-before-function-paren 规则
    'space-before-function-paren': 'off',
    // 禁用 no-multiple-empty-lines 规则
    'no-multiple-empty-lines': 'off',
    'no-trailing-spaces': 'off'
  },

  // 忽略文件
  ignorePatterns: [
    'build/',
    'dist/',
    'static/',
    'compo.d.ts',
    '.eslintrc-auto-import.json',
    'vite.config.js',
  ]
}
