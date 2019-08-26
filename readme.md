## 起步

> 安装依赖

~~~bash
# 安装依赖包，安装过程中，如果提示 chromium 安装失败，可以不用管。最后配置文件指向你的 chrome.exe 路径即可
npm install
# 安装 gulp 
npm install -g gulp
# 生成兼容es5语法的node文件
gulp start
~~~

> 配置

将 `es6/conf.sample` 复制到 `es6/conf`  

请到目录 `es6/conf/db/mysql.js` 配置 `mysql`、`redis`、浏览器应用地址
本次表结构请看目录 `sql/`


### 目录介绍

`es6` 源代码路径
`es5` node 可直接运行路径

### 运行

~~~bash
# 运行应用 
node es5/app.js
~~~

### 示例
[示例地址](https://www.jianshu.com/p/aa2159356fbd)  

### 多进程爬取

- TODO