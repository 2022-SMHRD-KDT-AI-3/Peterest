var multer = require('multer');	

//multer 의 diskStorage를 정의
var storage = multer.diskStorage({
  //경로 설정
  destination : function(req, file, cb){    

    cb(null, 'uploads/');
  },

  //실제 저장되는 파일명 설정
  filename : function(req, file, cb){
	//파일명 설정을 돕기 위해 요청정보(req)와 파일(file)에 대한 정보를 전달함
    var testSn = req.body.TEST_SN;
    var qSn = req.body.Q_SN;

    //Multer는 어떠한 파일 확장자도 추가하지 않습니다. 
    //사용자 함수는 파일 확장자를 온전히 포함한 파일명을 반환해야 합니다.        
    var mimeType;

    switch (file.mimetype) {
      case "image/jpeg":
        mimeType = "jpg";
      break;
      case "image/png":
        mimeType = "png";
      break;
      case "image/gif":
        mimeType = "gif";
      break;
      case "image/bmp":
        mimeType = "bmp";
      break;
      default:
        mimeType = "jpg";
      break;
    }

    cb(null, testSn + "_" + qSn + "." + mimeType);
  }
});

var upload = multer({storage: storage});

//파일이 여러개이므로 두번째 인자에 upload.array(name) 을 이용
//혹시 파일이 한개인 경우는 upload.single(name)을 이용

router.post('/test/save', upload.single('IMG_FILE'), function (req, res) {
  
    var testSn = req.body.TEST_SN;
    var qSnArr = req.body.Q_SN;
    var imgFile = req.file; //파일 객체를 배열 형태로 리턴함.
    //var imgFile = req.file; //파일이 1개인 경우(upload.single()을 이용한 경우)
    console.log(imgFileArr);

});