var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../rm-qna-bot-app.zip');
var kuduApi = 'https://rm-qna-bot-app.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$rm-qna-bot-app';
var password = '2yhlejfgPFB9bc90wyEKRSFnHvmu6as474weHuoBALZfy3Ya7v1F2aqjS0KG';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('rm-qna-bot-app publish');
  } else {
    console.error('failed to publish rm-qna-bot-app', err);
  }
});