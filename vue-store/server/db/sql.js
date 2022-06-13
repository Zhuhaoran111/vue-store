const mysql = require('mysql');
let conection = mysql.createConnection({
    host: '127.0.0.1', // 数据库的 IP 地址
    user: 'root', // 登录数据库的账号
    password: '123456', // 登录数据库的密码
    database: 'vuestore', // 指定要操作哪个数据库
    port: '3366',  //端口号
})
module.exports = conection;
