const { resolveInclude } = require("ejs");
const { response, application } = require("express");
const express = require("express") // router에서도 express 라는 걸 쓰겠다라는걸 알려줌
const router = express.Router(); // express 안에서 Router 사용하겠다
const conn = require("../config/DB.js")  // 저 경로의 파일안에 있는 내용을 가져온다
// const {request} = require("express");
const fs = require("fs");




// 첫 페이지 
router.get("/home", function(request, response){

    response.render("login", {        // -> ejs파일 실행      render는 파일의 이름만!!
        user : request.session.user     // 로그인x : null / 로그인o : 회원정보
    
    
    }) 
    
})

router.get("/index", function(request, response){

    response.render("index",{

    })
    const image =response.file;
    console.log(image);
})


// 회원가입
router.post("/join", function (request, response) {

    let user_id = null;
    let email = request.body.email;
    let pw = request.body.pw;
    let name = request.body.name;
    let age = request.body.age;
    let nickname = request.body.nickname;
    let region_id = request.body.region_id;
    let myimg_url = null;
    
    let sql = "insert into user values(?,?,?,?,?,?,?,?)";
    
    conn.query(sql,[user_id, region_id, email, pw, nickname, age, name, myimg_url],function(err, rows){  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
           //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
        if(rows) { //만약 rows 값이 트루면
            response.render("login",{
  
            })
            //response.redirect("http://127.0.0.1:3000/login")
        }else{ // 실패시 
           console.log(err);
        }
    })
})


// 로그인
router.post("/login", function(request, response){         // post방식

    let email = request.body.email;
    let pw = request.body.pw;

    let sql = "select * from user where email = ? and password = ?";    // sql 자체에있는 세미콜론은 안가져와도됨 !!!   // 물음표에 사용자가 입력한값 들어감

      
    conn.query(sql,[email,pw],function(err, rows){  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
        //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
        console.log(rows.length);

        if(rows.length > 0){

            request.session.user = {
                "user_id" : rows[0].user_id,
                "email" : rows[0].email,
                "region_id" : rows[0].region_id,
                "myimg_url" : rows[0].myimg_url,
                "password" : rows[0].password,
                "nickname" : rows[0].nickname,
                "name" : rows[0].name
            }
            console.log("유저번호");
            console.log(email);
            console.log(request.session.user.user_id);
            console.log(request.session.user.user_id);
            response.redirect("http://127.0.0.1:3000/main");
        }else{

            response.redirect("http://127.0.0.1:3000/public/loginF.html")
            
        }
    })
 
})

// 메인페이지
router.get("/main", function(request, response){

    let sql = "select * from pin";

    conn.query(sql, function(err, rows){  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
        //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
        

        if(rows){

            // request.session.pin = {
            //     "pin_id" : rows.pin_id,
            //     "user_id" : rows.user_id,
            //     "img_url" : rows.img_url,
            //     "title" : rows.title,
            //     "link" : rows.link,
            //     "detail" : rows.detail,
            //     "date" : rows.end_date 
            // }
            request.session.pin ={
                "rows" :rows
            }

            response.render("main", {        // -> ejs파일 실행      render는 파일의 이름만!!
                user : request.session.user,     // 로그인x : null / 로그인o : 회원정보
                rows : rows
            }) 
           
            
            //response.redirect("http://127.0.0.1:3000/main");
        }else{

            //response.redirect("http://127.0.0.1:3000/public/loginF.html")
            
        } console.log(request.session.user.myimg_url);
    })

})

router.get("/pin", function(request, response){
    
    let pin_id = request.session.pin_all.pin_if[0].pin_id;
    let sql = "select * from comment where pin_id=?";
    conn.query(sql,[request.session.pin_all.pin_if[0].pin_id], function(err,comment_if){
        
        
        if (comment_if) {
            conn.query("select * from user", function (err, user_data) {
                response.render("pin", {
                    pin_all: request.session.pin_all,
                    comment_if: comment_if,
                    user: request.session.user,
                    user_data: user_data
                })
            })
        }    
    })
});

// 게시물 상세 페이지

router.post("/pin", function (request, response) {

    let pin_id = request.body.pin_id;

    let sql = "select * from pin where pin_id=?";

    conn.query("select * from pin where pin_id =" + pin_id, function (err, rows) {

        if (rows) {
            //에러 err선언해서 봐보기!!
            conn.query("select * from user where user_id =" + rows[0].user_id, function (err, writer) {
                conn.query("select * from follow where user_id =" + rows[0].user_id, function (err, follower_cnt) {
             
                if (writer) {

                    conn.query("select * from `like`", function (err, like_C) {


                        conn.query("select * from comment where pin_id =" + pin_id, function (err, comment) {

                            if (comment) {
                                let likeList = [];

                                for (let i = 0; i < comment.length; i++) {
                                    sum = 0;
                                    k = 0;
                                    while (k != like_C.length) {
                                        if (comment[i].comment_id == like_C[k].comment_id) {
                                            sum++;
                                        };
                                        k++;
                                    };
                                    likeList.push(sum);
                                }

                                request.session.pin_all = {
                                    "pin_if": rows,
                                    "user_if": request.session.user,
                                    "writer": writer,
                                    "likeList": likeList,
                                    "follower_cnt": follower_cnt
                                    // "comment_if" : comment
                                };
                                response.redirect("pin");


                            } else {
                                console.log(err);
                            }

                        });



                    });

                    console.log("닉네임: " + writer[0].nickname);

                }
                else {
                    console.log(err);
                }

                })
            });

        } else { // 실패시 
            console.log(err);
        }
    })

});

// 댓글
router.post("/comment",function(req, res){

    let content = req.body.content;
    let pin_id = req.session.pin_all.pin_if[0].pin_id;
    let comment_id = null;
    let nickname = req.session.user.nickname;
    console.log("댓글달려는 핀번호:"+req.session.pin_all.pin_if[0].pin_id);

    let sql = "insert into comment values(?,?,?,now(),?)";
    
    // console.log(pin_id);
    // console.log(content);
    // console.log("댓글 달려는 게시물 번호:"+req.session.selectpin.pin_id);
    // console.log(req.body.content);

    // conn.query("insert into comment values('"+comment_id+"','"+pin_id+"','"+content+"')", function(err, rows){
    conn.query(sql,[comment_id, pin_id, content,nickname], function(err, rows){
        if(rows){
            // res.render("pin",{

            // });
            res.redirect("http://127.0.0.1:3000/pin");
        }else{
            console.log(err);
        }
    })

});

router.post("/PwUpdate",function(request,response){

    let pw = request.body.PwUpdate;
    let email = request.session.user.email;
    // let name = request.session.user.name;
    // let age = request.session.user.age;

    console.log(email);
    console.log(request.session.user.name);
    console.log(request.session.user.age);
    console.log(pw);

    let sql = "update user set password =? where email = ?";

    conn.query(sql,[request.body.PwUpdate, email],function(err, rows){  
        
        response.redirect("http://127.0.0.1:3000/main");
        // alert("수정되었습니다.")
    });
});

router.get("/PwFind", function(request, response){         

    response.render("PwFind", {
                    
    }) 

});

router.post("/PwFind_exe", function(request, response){ // update를 시켜주는 라우터
    
    let email = request.body.findemail;
    let name = request.body.findname;
    let age = request.body.findage;

    let sql = "select * from user where email = ? and name = ? and age = ?";    // sql 자체에있는 세미콜론은 안가져와도됨 !!!   // 물음표에 사용자가 입력한값 들어감
    
    console.log(email);
    console.log(name);
    console.log(age);

    conn.query(sql,[email, name, age],function(err, rows){  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
        //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
        console.log(rows.length);

        if(rows.length > 0){

            request.session.user = {
                "email" : rows[0].email,
                "name" : rows[0].name,
                "age" : rows[0].age
            }

            response.redirect("http://127.0.0.1:3000/pwupdate.html");
            
        }else{

            response.redirect("http://127.0.0.1:3000/LoginF.html")
            
        }
    })

});

router.post("/login_pw_update", function (request, response) {

    let pw = request.body.update_pw;
    let email = request.session.user.email;
    // let name = request.session.user.name;
    // let age = request.session.user.age;

    console.log(email);
    console.log(request.session.user.name);
    console.log(request.session.user.age);
    console.log(pw);

    let sql = "update user set password = ? where email = ?";

    conn.query(sql, [request.body.update_pw, email], function (err, rows) {

        response.redirect("http://127.0.0.1:3000/home");
        // alert("수정되었습니다.")
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { NULL } = require("node-sass");
const { writer } = require("repl");

// uploads 폴더 없으면 생성
// fs.readdir("uploads", (err) => {
    //     if (err) {
        //       fs.mkdirSync("uploads");
        //     }
        //   });
        
const upload = multer({
    storage: multer.diskStorage({	// 파일이 저장될 경로
        destination(req, file, cb) {
            cb(null, "uploads/pin_img");
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);	// 파일 확장자
            const timestamp = new Date().getTime().valueOf();	// 현재 시간
            // 새 파일명(기존파일명 + 시간 + 확장자)
            const filename = path.basename(file.originalname, ext) + ext;
            cb(null, filename);
        },
    }),
});
        
router.get('/upload', function(req, res){
    res.render('게시물 작성 페이지',{
        user: req.session.user
    });
    console.log(req.session.pin);
    // console.log(req.session);
    // console.log(req.body);
});
        
 // 게시물 작성
router.post("/upload", upload.single("img_url"), (req, res) => {
    try {
        sharp(req.file.path)  // 압축할 이미지 경로
            .resize({ width: 600 }) // 비율을 유지하며 가로 크기 줄이기
            .withMetadata()	// 이미지의 exif데이터 유지
            .toBuffer((err, buffer) => {
                if (err) throw err;
                // 압축된 파일 새로 저장(덮어씌우기)
                fs.writeFile(req.file.path, buffer, (err) => {
                    if (err) throw err;
                });

                let pin_id = null;
                let user_id = req.session.user.user_id;

                let group_id = req.body.group_id;
                let img_url = req.file.filename;
                let board_id = 0;
                let title = req.body.title;
                let link = req.body.link;
                let detail = req.body.detail;

                console.log(req.file);
                let sql = "insert into pin values(?,?,?,?,?,?,?,?,now(),now())";

                conn.query(sql, [pin_id, user_id, group_id, img_url, board_id, title, link, detail], function (err, rows) {  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 

                });

            });
        } catch (err) {
            console.log(err);
        }
        res.redirect("http://127.0.0.1:3000/Main")
        
        // res.json({
        //     filename: `${req.file.filename}`,
        //     filepath: `${req.file.path}`
        // });
        
        // res.render("main",{
        //     rows : req.session.pin
        // })
});

            const upload1 = multer({
                storage: multer.diskStorage({   // 파일이 저장될 경로
                  destination(request, file, cb) {
                    cb(null, "uploads/profile_img");
                },
                  filename(request, file, cb) {
                    const ext = path.extname(file.originalname);   // 파일 확장자
                    // 새 파일명(기존파일명 + 확장자)
                    const filename = path.basename(file.originalname, ext) + ext;
                    cb(null, filename);
                },
            }),
        });
        
        router.get("/info1", function(request, response){
            response.render("개인정보 수정",{
                user: request.session.user
            })
        })

        router.get("/info2",function(request, response){
            response.render("계정관리",{
                user: request.session.user
            })
        })

router.post("/info2", function(request, response){

            console.log(request.session.user.user_id);
            let user_id = request.session.user.user_id;

            let sql = "delete from user where user_id = ?";    // sql 자체에있는 세미콜론은 안가져와도됨 !!!   // 물음표에 사용자가 입력한값 들어감

            
            conn.query(sql,[user_id],function(err, rows){  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
                //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
                if(rows) { //만약 rows 값이 트루면
                    response.redirect("http://127.0.0.1:3000/home")
                }else{ // 실패시 
                    console.log(err);
                }
            })
        })

        router.get("/info3", function(request, response){

            response.render("공개 프로필",{
                user: request.session.user,
            })
        })

        router.get("/mypage1",function(request,response){

            console.log(request.session.user.user_id);
            let user_id = request.session.user.user_id;

            let sql = "select * from pin where user_id = ?"

            conn.query(sql,[user_id],function(err, rows){  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
                //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
                console.log(rows.length);
        
                if(rows.length > 0){

                    let sql = "select user_id from follow where follower_id = ?"
                    conn.query(sql, [request.session.user.user_id], function (err, follow_cnt) {
                        response.render("프로필 게시물 표현", {

                            user: request.session.user,
                            rows: rows,
                            follow_cnt: follow_cnt

                        });
                        console.log(follow_cnt.length);
                    })
                    

                    console.log(request.session.user.email);
                    console.log(rows[0].img_url);
                    // response.redirect("http://127.0.0.1:3000/main");
                }else{
                    console.log(err);
                    // response.redirect("http://127.0.0.1:5500/0330message/public/LoginF.html")
                    
                }
            })
        })

router.get("/mypage2", function (req, res) {

    let sql = "select * from follow where follower_id = ?"
    let user_id = req.session.user.user_id;
    let follower_list = [];

    console.log("로그인한 사람 정보: " + req.session.user.user_id);
    console.log(req.session);
    // 내가 팔로우하고 있는 유저들번호
    conn.query(sql, [user_id], function (err, follower) {

        if (follower) {

            let sql2 = "select * from pin where user_id = ?"
            // 내가 팔로우하고 있는 유저 게시물들
            for (let i = 0; i < follower.length; i++) {
                conn.query(sql2, [follower[i].user_id], function (err, follower_pin) {

                    if (follower_pin) {

                        console.log(follower_pin[0]);
                        for (let j = 0; j < follower_pin.length; j++) {

                            console.log(follower_pin[j]);
                            follower_list.push(follower_pin[j]);
                        };

                    } else {
                        console.log(err);
                    };
                });
            };

            function log1(arg) {
                console.log(follower_list[0]);
                res.render("프로필 페이지", {
                    follower: follower,
                    follower_list: follower_list,
                    user: req.session.user
                });
            };
            setTimeout(log1, 1000, 'funky');
        } else {
            console.log(err);
        }
    })
})

        // 프로필 이미지 변경
        router.get("/profile", function(request, response){
        
            response.render("공개 프로필",{
                user: request.session.user,
            })
            
        })
router.post("/profile", upload.single("myimg_url"), (req, res) => {
    try {
        sharp(req.file.path)  // 압축할 이미지 경로
            .resize({ width: 30 }) // 비율을 유지하며 가로 크기 줄이기
            .withMetadata()	// 이미지의 exif데이터 유지
            .toBuffer((err, buffer) => {
                if (err) throw err;
                // 압축된 파일 새로 저장(덮어씌우기)
                fs.writeFile(req.file.path, buffer, (err) => {
                    if (err) throw err;
                });

                let user_id = req.session.user.user_id;

                let img_url = req.file.filename;
  

                console.log(req.file);
                let sql = "update user set myimg_url = ?  where user_id = ?";

                conn.query(sql, [img_url,user_id], function (err, rows) {  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 

                });

            });
    } catch (err) {
        console.log(err);
    }
    res.redirect("http://127.0.0.1:3000/Main")

    // res.json({
    //     filename: `${req.file.filename}`,
    //     filepath: `${req.file.path}`
    // });

    // res.render("main",{
    //     rows : req.session.pin
    // })
});
router.post("/select_pin", function (request, response) {

    let text = request.body.select_text;
    let text2 = request.body.select_text2;

    console.log("검색어가 무엇이더냐?? " + text);
    console.log("검색어가 무엇이더냐?? " + text2);

    if (text) {
        console.log("직접검색");
        let sql = "select * from pin where title like ? or detail like ? or group_id like ?"

        conn.query(sql, [text, text, text], function (err, rows) {  //sql 실행되면 만들었던 nodejs_member 테이블로 가서 입력함  그다음에 명령이 성공하든 실패하든 이쪽 뻥션으로 들어옴 실패하면 err 에 뭔가들어가고 성공하면 rows 변수에 들어감 
            //sql,[id,pw,nick] 사용자가 입력할값 순서대로 넣어준다
            if (rows) { //만약 rows 값이 트루면

                console.log(rows);
                response.render("select_pin", {
                    rows: rows,
                    user: request.session.user
                })
            } else { // 실패시 
                console.log(err);
            }
        })
    } else {
        console.log("카테고리검색");
        let sql2 = "select * from pin where title like ? or detail like ? or group_id like ?"
        conn.query(sql2, [text2, text2, text2], function (err, rows) {
            if (rows) {

                response.render("select_pin", {
                    rows: rows,
                    user: request.session.user
                })
            } else {
                console.log(err);
            }
        })
    }
})
router.get("/follow", function (request, response) {

    let pin_id = request.session.pin_all.pin_if[0].pin_id;
    console.log("댓글" + pin_id);
    console.log("로그인한 회원정보:" + request.session.user.user_id);
    let sql = "select * from comment where pin_id=?";
    let follow_id = null;
    let follower_id = request.session.user.user_id;
    let user_id = request.session.pin_all.writer[0].user_id;
    console.log("follower_id:" + follower_id);
    console.log("user_id:" + user_id);
    conn.query(sql, [request.session.pin_all.pin_if[0].pin_id], function (err, comment_if) {

        if (comment_if) {
            conn.query("select * from user", function (err, user_data) {
                response.render("pin", {
                    pin_all: request.session.pin_all,
                    comment_if: comment_if,
                    user: request.session.user,
                    user_data: user_data
                })
                conn.query("select * from pin where pin_id =" + pin_id, function (err, rows) {
                    if (rows) {
                        //에러 err선언해서 봐보기!!
                        let chksql = "select * from follow where follower_id=? and user_id=?"

                        conn.query(chksql, [follower_id, user_id], function (err, chk) {
                            if (chk.length>=1) {
                                console.log("팔로우 되있으면:" + chk);


                                console.log("이미 팔로우 돼있음");

                            } else {
                                console.log("팔로우 안되있으면:" + err);
                                let followsql = "insert into follow values(?,?,?)";
                                conn.query(followsql, [follow_id, request.session.pin_all.writer[0].user_id, request.session.user.user_id], function (err, rows) {
                                    if (rows) {

                                    } else { // 실패시 
                                        console.log(err);
                                    }
                                })

                            }

                        })
                    }
                })
                console.log("바보" + request.session.user.user_id);


            })
        }




    })

})
router.post("/likeup", function (request, response) {

    let likeup = request.body.likeup;
    let user_id = request.session.user.user_id;

    console.log(request.session.user.user_id);



    let sql = "insert into `like` values(" + null + ",?,?)";

    conn.query(sql, [user_id, likeup], function (err, rows) {
        if (rows) {
            console.log("좋아요한 유저 아이디:" + request.session.user.user_id);
            console.log("좋아요된 댓글 아이디:" + likeup);

            console.log(request.session.pin_all);
            request.session.likeup = {
                "likeup": likeup,
            }
            response.redirect("http://127.0.0.1:3000/pin");


        } else {
            console.log(err);
        }
    })
})
router.get("/logout", function (request, response) {

    delete request.session.user;

    response.redirect("http://127.0.0.1:3000/home");

})

module.exports = router;