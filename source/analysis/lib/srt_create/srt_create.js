/*********************************************************************************************************************
 *  Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance        *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://aws.amazon.com/asl/                                                                                    *
 *                                                                                                                    *
 *  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/

/**
 * @author Solution Builders
 */

'use strict';
let AWS = require('aws-sdk');
let upload = require('../upload');
let tsToSrt = require('aws-transcription-to-srt');

const s3Bucket = process.env.S3_BUCKET;

/**
 * Creates a SRT file from transcribe content
 *
 * @class srt_create
 */

let srt_create = (function () {

  /**
   * @class srt_create
   * @constructor
   */
  let srt_create = function () { };

  /**
   * Starts text translation job
   * @param {JSON} event_info - information about the text file
   * @param {startTranslation~callback} cb - The callback that handles the response.
   */

  srt_create.prototype.startConvertStr = function (event_info, cb) {
    console.log('Executing SRT creation');

    const key = event_info.results.transcript.key;

    console.log('Key:: ', key);

    const transcript_params = {
      Bucket: s3Bucket,
      Key: key
    };

    getTranscript(transcript_params, function (err, data) {
      if (err) {
        return cb(err, null);
      }

      const transcript = JSON.parse(data.Body.toString('utf-8'));

      const source_text = transcript.results.transcripts[0].transcript;

      convertTsToSrt(source_text)
        .then((results) => {
          storageS3(event_info, results, cb);
        });

    });
  };

  const storageS3 = function (event_info, srt, cb) {
    let text_key = ['private', event_info.owner_id, 'media', event_info.object_id, 'results', 'transcript.srt'].join('/');

    let s3_params = {
      Bucket: s3Bucket,
      Key: text_key,
      Body: srt,
      ContentType: 'text/plain'
    };

    upload.respond(s3_params, function (err, response) {
      if (err) {
        return cb(err, null);
      }

      const text_response = {'key': text_key, 'status': "COMPLETE"};

      return cb(null, text_response);
    });
  }

  const getTranscript = function (params, cb) {
    let s3 = new AWS.S3();
    s3.getObject(params, function (err, data) {
      if (err) {
        console.log(err);
        return cb(err, null);
      } else {
        return cb(null, data);
      }
    });
  };

  const convertTsToSrt = function (ts) {
    return new Promise(resolve => {
      const srt = tsToSrt(ts);
      resolve(srt);
    });
  };

  return srt_create;
})();

module.exports = srt_create;
