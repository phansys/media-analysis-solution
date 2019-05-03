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
  let translate = function () { };

  /**
   * Starts text translation job
   * @param {JSON} event_info - information about the text file
   * @param {startTranslation~callback} cb - The callback that handles the response.
   */

  translate.prototype.startTranslation = function (event_info, cb) {
    console.log('Executing text translation');

    let key = event_info.results.transcript.key;
    let language_code = (event_info.ai_options || {}).language_code.split('-')[0] || 'en';
    let source_text = (event_info.ai_options || {}).source_text || '';
    let target_language_codes = ((event_info.ai_options || {}).target_language_codes || ['en', 'es', 'pt', 'fr', 'zh', 'tr']);

    console.log('Key:: ', key, 'language_code:: ', language_code);

    let transcript_params = {
      Bucket: s3Bucket,
      Key: key
    }

    getTranscript(transcript_params, function (err, data) {
      if (err) {
        return cb(err, null);
      }

      const transcript = JSON.parse(data.Body.toString('utf-8'));
      const transcriptResults = getPhrasesFromTranscript(transcript);

      source_text = transcriptResults ? transcript.results.transcripts[0].transcript : '';

      let tsCollection = {
        accountId: transcript.accountId,
      };

      for (let target_language_code of target_language_codes) {
        results[target_language_code] = {
          transcripts: [],
          items: [],
        };

        let results = {};

        let localizedTs = {
          results,
        };

        if ('' === source_text) {
          storageS3(event_info, localizedTs, cb);
        } else {
          // Skip the translate if the source lang is the same as target lang
          if (target_language_code === language_code) {
            localizedTs = {
              transcripts: transcript.results.transcripts,
              items: transcript.results.items,
            };

            continue;
          }

          const translate_params = {
            SourceLanguageCode: language_code,
            TargetLanguageCode: target_language_code,
            Text: source_text
          }

          getTranslatedText(translate_params)
            .then(({TranslatedText}) => {
              const tsItem = {transcript: TranslatedText};
              results = Object.assign({}, results, {transcripts: [tsItem]});

              const allPromises = transcriptResults.map((item) => {
                return getTranslatedTextItem(item, language_code, target_language_code);
              });

              Promise.all(allPromises)
                .then((items) => {
                  results = Object.assign({}, results, {items});
                  localizedTs = Object.assign({}, localizedTs, {results});

                  storageS3(event_info, localizedTs, cb);
                });
                // @todo: missing catch
            });
            // @todo: missing catch
        }
      }
    });
  };

  const storageS3 = function (event_info, localizedTs, cb) {
    let text_key = ['private', event_info.owner_id, 'media', event_info.object_id, 'results', 'transcript-intl.json'].join('/');

    let s3_params = {
      Bucket: s3Bucket,
      Key: text_key,
      Body: JSON.stringify(localizedTs),
      ContentType: 'application/json'
    };

    upload.respond(s3_params, function (err, response) {
      if (err) {
        return cb(err, null);
      }

      let text_response = {'key': text_key, 'translate_json': localizedTs, 'status': "COMPLETE"};
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

  const getTranslatedText = function (params) {
    const translate = new AWS.Translate();
    return new Promise((resolve, reject) => {
      translate.translateText(params, function (err, data) {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  };

  const getTranslatedTextItem = function (item, SourceLanguageCode, TargetLanguageCode) {
    const Text = item.words.join(' ');
    const translate = {
      SourceLanguageCode,
      TargetLanguageCode,
      Text
    };

    return new Promise((resolve, reject) => {
      getTranslatedText(translate)
        .then(({TranslatedText}) => {
          const newItem = {
            start_time: item.start_time,
            end_time: item.end_time,
            alternatives: [
              {
                confidence: 1,
                content: TranslatedText,
              }
            ],
            type: 'pronunciation'
          };

          resolve(newItem)
        });
        // missing catch
    });
  }

  function getPhrasesFromTranscript(transcript) {
    if (transcript.status === 'MP4 FAILED') {
      return null;
    }

    const items = transcript.results.items;

    // set up some variables for the first pass
    let phrases = [];
    let phrase = {words: []};
    const filteredItems = items
      .filter((item) => 'pronunciation' === item.type);
    filteredItems
      .forEach((item, index) => {
        if (0 === phrase.words.length) {
          phrase = Object.assign({}, phrase, {start_time: item.start_time});
        }

        phrase = Object.assign({}, phrase, {words: [...phrase.words, item.alternatives[0].content]});

        if (10 === phrase.words.length || index === filteredItems.length - 1) {
          phrase = Object.assign({}, phrase, {end_time: item.end_time});
          // phrases.push(phrase);
          phrases = [...phrases, {...phrase}];
          phrase = {words: []};
        }
      });

    return phrases;
  }

  return translate;
})();

module.exports = translate;
