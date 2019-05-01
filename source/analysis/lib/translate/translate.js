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
    let language_code = (event_info.ai_options || {}).language_code.split('-')[0] || 'en';
    let source_text = (event_info.ai_options || {}).source_text || '';
    let target_language_code = ((event_info.ai_options || {}).target_language_code || 'es').split('-')[0];

    console.log('Key:: ', key, 'language_code:: ', language_code);

    let transcript_params = {
        Bucket: s3Bucket,
        Key: key
    }

    getTranscript(transcript_params, function (err, data) {
      if (err) {
        return cb(err, null);
      } else {
        let transcriptResults;
        if (JSON.parse(data.Body.toString('utf-8')).status == 'MP4 FAILED') {
          transcriptResults = null;
        } else {
          transcriptResults = getPhrasesFromTranscript(JSON.parse(data.Body.toString('utf-8')));
        }

        source_text = transcriptResults ? transcriptResults.transcripts[0].transcript : '';

        if ('' === source_text) {
          console.log('No words available for translation');
        } else {

          let newTs = {
            results: {
              accountId: transcriptResults.accountId,
              transcripts: [],
              items: []
            }
          };
          let newItem = {};
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

              let tsItem = {transcript: data.TranslatedText};

              newTs.results.transcripts.push(tsItem);

              return cb(null, data.TranslatedText);
            }
          });

          for (let item in transcriptResults) {
            translate_params.Text = item.words.join(' ');

            getTranslatedText(translate_params, function (err, data) {
              if (err) {
                return cb(err, null);
              } else {
                console.log(data.TranslatedText);

                newItem = {
                  start_time: item.start_time,
                  end_time: item.end_time,
                  alternatives: [
                    {
                      confidence: 1,
                      content: data.TranslatedText,
                    }
                  ],
                  type: 'pronunciation'
                };

                newTs.results.items.push(newItem);

                return cb(null, newItem);
              }
            });
          }

          let text_key = ['private', event_info.owner_id, 'media', event_info.object_id, 'results', 'translated_text.json'].join('/');

          // @todo: ensure `newTs` is available and populated before trying to upload to S3
          let s3_params = {
            Bucket: s3Bucket,
            Key: text_key,
            Body: JSON.stringify(newTs),
            ContentType: 'application/json'
          };

          upload.respond(s3_params, function (err, response) {
            if (err) {
              return cb(err, null);
            } else {
              let text_response = {'key': text_key, 'translate_json': newTs, 'status': "COMPLETE"};
              return cb(null, text_response);
            }
          });
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

  function getPhrasesFromTranscript(transcript) {
    const items = transcript.results.items;

    // set up some variables for the first pass
    let phrase = {};
    let phrases = [];
    let nPhrase = true;
    let x = 0;
    let c = 0;

    console.log('Creating phrases from transcript...');

    for (let item in items) {
        // if it is a new phrase, then get the start_time of the first item
        if (nPhrase) {
            if ('pronunciation' === item.type) {
                phrase.start_time = item.start_time;
                nPhrase = false;
            }
            c += 1
        } else {
            // We need to determine if this pronunciation or puncuation here
            // Punctuation doesn't contain timing information, so we'll want
            // to set the end_time to whatever the last word in the phrase is.
            // Since we are reading through each word sequentially, we'll set
            // the end_time if it is a word
            if ('pronunciation' === item.type) {
                phrase.end_time = item.end_time;
            }
        }

        // in either case, append the word to the phrase...
        phrase.words.append(item.alternatives[0].content);
        x += 1;

        // now add the phrase to the phrases, generate a new phrase, etc.
        if (10 === x) {
            phrases.push(phrase);
            phrase = {};
            nPhrase = true;
            x = 0;
        }
    }

    return phrases;
  }

  return translate;
})();

module.exports = translate;
