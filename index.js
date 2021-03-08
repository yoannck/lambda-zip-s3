'use strict';

const AWS = require('aws-sdk');
const s3Zip = require('s3-zip');

exports.handler = function (event, context, callback) {
  console.log('event received', event)

  const region = event.region
  const bucket = event.bucket
  const folder = event.folder
  const files = event.files
  const zipFileName = event.zipFileName
  const keepOrderAndRename = event.keepOrderAndRename || null;

  const formatNumber = function(number, pad) {
    var s = number.toString();
    while (s.length < (pad || 2)) { s = "0" + s; }
    return s;
  }

  try {
    let order = 1;
    const archiveFiles = files.map( fileName => {
      const nb_truncated = 25;
      let parts = fileName.split('.');
      let extension = parts.pop();
      let rename = parts.join(' ').substring(0, nb_truncated);
      rename = rename.replace(/[\[\],]/g, '');
      return {
        name: (keepOrderAndRename && keepOrderAndRename.rename) ? `[${formatNumber(order++, keepOrderAndRename.pad)}] ${keepOrderAndRename.rename.replace(/[\[\],]/g, '').substring(0, nb_truncated)}.${extension}` : `[${formatNumber(order++, keepOrderAndRename.pad)}] ${rename}.${extension}`
      }}
    );

    const body = s3Zip.archive({ region: region, bucket: bucket}, folder, files, archiveFiles)
    const zipParams = { params: { Bucket: bucket, Key: folder + zipFileName } }
    const zipFile = new AWS.S3(zipParams)
    zipFile.upload({ Body: body })
      .on('httpUploadProgress', function (evt) { console.log(evt) })
      .send(function (e, r) {
        if (e) {
          const err = 'zipFile.upload error ' + e
          console.log(err)
          context.fail(err)
        }
        context.succeed(r)
        callback(null, `ZIP Created`);
      });
  } catch (e) {
    const err = 'catched error: ' + e
    console.log(err)
    context.fail(err)
    callback(err);
  }

}
