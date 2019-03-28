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
let request = require('request');

const s3Bucket = process.env.S3_BUCKET;

/**
 * Performs operations for text translation using
 * Amazon Translate.
 *
 * @class translate
 */

let translate = (function () {

  /**
   * @class translate
   * @constructor
   */
  let translate = function () {};

  /**
   * Starts text translation job
   * @param {JSON} event_info - information about the text file
   * @param {startTranslation~callback} cb - The callback that handles the response.
   */

  translate.prototype.startTranslation = function (event_info, cb) {
    console.log('Executing text translation');

    let key = event_info.results.transcript.key;
    let language_code = (event_info.ai_options || {}).language_code || 'en-US';
    let source_text = (event_info.ai_options || {}).source_text || '';
    let target_language_code = (event_info.ai_options || {}).target_language_code || 'es-US';

    let source_file_uri = '';
    if ('us-east-1' === process.env.AWS_REGION) {
      source_file_uri = ['https://s3.amazonaws.com', s3Bucket, '/', key].join('');
    } else {
      source_file_uri = ['https://s3-', process.env.AWS_REGION, '.amazonaws.com', '/', s3Bucket, '/', key].join('');
    }
    console.log('File:: ', source_file_uri, 'language_code:: ', language_code);

    function getFileContents(source_file_uri) {
      return new Promise(function (resolve, reject) {
        request(source_file_uri, function (err, data, body) {
          if (err) {
            reject(err);

            return cb(err, null);
          }

          resolve(body);
        });
      });
    }

    getFileContents(source_file_uri).then(function (body) {
      source_text = body;
    });

    let params = {
      SourceLanguageCode: language_code,
      TargetLanguageCode: target_language_code,
      Text: source_text
    };

    let translate = new AWS.Translate();
    translate.translateText(params, function (err, data) {
      if (err) {
        return cb(err, null);
      } else {

        var translatedText = data.TranslatedText;

        let text_key = ['private', event_info.owner_id, 'media', event_info.object_id, 'results', 'translated_text_' + params.TargetLanguageCode + '.json'].join('/');

        let s3_params = {
          Bucket: s3Bucket,
          Key: text_key,
          Body: JSON.stringify(data),
          ContentType: 'application/json'
        };

        upload.respond(s3_params, function (err, response) {
          if (err) {
            return cb(err, null);
          } else {
            let text_response = {'key': text_key, 'text': translatedText, 'status': "COMPLETE"};
            return cb(null, text_response);
          }
        });
      }
    });
  };

  return translate;
})();

module.exports = translate;
