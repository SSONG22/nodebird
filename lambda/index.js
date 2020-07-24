const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

//s3 업로드가되면 람다가 실행되게끔
exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; //cheering99
  const Key = event.Records[0].s3.object.key; //파일명 original/123.png
  console.log(Bucket, Key);
  const filename = Key.split("/")[Key.split("/").length - 1]; //추출
  const ext = Key.split(".")[Key.split(".").length - 1]; // 확장자
  const requireFormat = ext === "jpg" ? "jpeg" : ext;
  console.log("filename", filename, "ext", ext);

  try {
    //getObject, putObject 권한 허용이유
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log("original", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: "inside" })
      .toFormat(requireFormat)
      .toBuffer();

    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        Body: resizedImage,
      })
      .promise(); // 다시 가져오기
    console.log("put", resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error);
    return callback(error); //passport 의 done 이랑 비슷
  }
};
