const fs = require('fs');
const uglifyJS = require("uglify-js");
const minify = require('html-minifier').minify;

const file = "./redis-module/index.html";
const confHtml = { //主要压缩配置
    processScripts: ['text/html'],
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true,
    removeComments: true, // 删除注释
    removeCommentsFromCDATA: true, // 从脚本和样式删除的注释
};

fs.readFile(file, "utf8", function(err, data) {
    if (err) throw err;

    const html = minify(data, confHtml).replace(/<script><\/script>/ig, "");
    fs.writeFile(file, html, () => console.log("index.html success"));
});
