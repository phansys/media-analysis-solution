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

    console.log('Key:: ', key, 'language_code:: ', language_code);

    let transcript_params = {
        Bucket: s3Bucket,
        Key: key
    }

    getTranscript(transcript_params, function (err, data) {
      if (err) {
        return cb(err, null);
      } else {
        if (JSON.parse(data.Body.toString('utf-8')).status == 'MP4 FAILED') {
          source_text = '';
        } else {
          source_text = JSON.parse(data.Body.toString('utf-8')).results.transcripts[0].transcript;
        }

        if ('' === source_text) {
          console.log('No words available for translation');
        } else {
          let translate_params = {
            SourceLanguageCode: language_code,
            TargetLanguageCode: target_language_code,
            Text: source_text
          }

          getTranslatedText(translate_params, function (err, data) {
            if (err) {
              return cb(err, null);
            } else {
              console.log(data.TranslatedText);

              let text_key = ['private', event_info.owner_id, 'media', event_info.object_id, 'results', 'translated_text_' + data.TargetLanguageCode + '.json'].join('/');

              let s3_params = {
                Bucket: s3Bucket,
                Key: text_key,
                Body: data.TranslatedText,
                ContentType: 'application/json'
              };

              upload.respond(s3_params, function (err, response) {
                if (err) {
                  return cb(err, null);
                } else {
                  let text_response = {'key': text_key, 'text': data.TranslatedText, 'status': "COMPLETE"};
                  return cb(null, text_response);
                }
              });
            }
          });

          return cb(null, source_text);
        }
      }
    });
  };

  let getTranscript = function (params, cb) {
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

  let getTranslatedText = function (params, cb) {
    let translate = new AWS.Translate();
    translate.translateText(params, function (err, data) {
      if (err) {
        return cb(err, null);
      } else {
        return cb(null, data);
      }
    });
  };

  return translate;
})();

module.exports = translate;
