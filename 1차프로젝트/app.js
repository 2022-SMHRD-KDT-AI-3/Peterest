// npm install express-session --save
//  npm install express-mysql-session --save 
// 설치하기

const express = require ("express");
const app = express();
const router = require("./router/router.js"); // 라우터.js 파일을 변수에 담아 사용
const bodyparser = require("body-parser"); // post방식을 사용하기 위해 작성 
const ejs = require("ejs");
const session = require("express-session"); // 세션기능을 사용하기 위한 모듈
const session_mysql_save = require("express-mysql-session"); // 세션기능을 저장하기 위한 모듈
const fs = require('fs');
var path = require('path'); // css를 적용하기 위해 path모듈 불러옴

//


// 1번째 세션정보 저장
let DB_info = {  // DB에 관한 정보를 'session_mysql_save'에 저장하기 위한 정보


//    host : '127.0.0.1', //ip 주소
//    user : 'root', // id
//    password : '1234', // 비밀번호
//    port : '3306', // 포트 번호
//    database : 'pin1' // 저장할 데이터베이스 이름


    host : 'project-db-stu.ddns.net', //ip 주소
    user : 'campus_g_0325_4', // id
    password : 'smhrd4', // 비밀번호
    port : '3307', // 포트 번호
    database : 'campus_g_0325_4' // 저장할 데이터베이스 이름
}

let s_m_s = new session_mysql_save(DB_info); // DB_info의 정보들을 'session_mysql_save'에 저장


app.use(express.static("./public"));  // 현재 프로젝트에 정적파일 폴더지정

// 2번째 미들웨어 역할
app.set("view engine", "ejs"); // express 내부적으로 engine이 설정되어있기 때문에 set기능 사용
app.use(session({
    secret : "smart",  // 비밀
    resave : false,    // 세션값을 저장할때 새롭게 저장할
    saveUninitialized : true,   // 세션값을 저장할껀지 안할껀지
    store : s_m_s    // 어디에 저장할껀지
}));


app.use(express.static(path.join(__dirname,'/')));  // css적용하기 위해 

app.use(bodyparser.urlencoded({extended:false})); // ????를 사용하지 않겠다라고 지정
app.use(router);
app.get('/imgs', function(request, response){
    fs.readFile('search-icon.png',function(request, response){
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.end(data);
    })
  
});
app.listen(3000);