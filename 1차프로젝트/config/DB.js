const mysql = require("mysql") // 프로그램과 연결할수 있는 mysql이란  모듈을 사용하겠다

// let conn = mysql.createConnection({
//    host : '127.0.0.1', //ip 주소
//    user : 'root', // id
//    password : '1234', // 비밀번호
//    port : '3306', // 포트 번호
//    database : 'pin1' // 저장할 데이터베이스 이름
// });

let conn = mysql.createConnection({
   host : 'project-db-stu.ddns.net', //ip 주소
   user : 'campus_g_0325_4', // id
   password : 'smhrd4', // 비밀번호
   port : '3307', // 포트 번호
   database : 'campus_g_0325_4' // 저장할 데이터베이스 이름
});

conn.connect();

module.exports = conn;  // 모든 연결이끝나고 외부에서 쓸수있게 밖으로 보내줌