import React from 'react';
import PropTypes from 'prop-types';
import audioImageSrc from './../img/audio.png';

class PreviewReact extends React.Component {
  static propTypes = {
    mediaType: PropTypes.string,
    fileData: PropTypes.string,
  }

  render() {
    const {mediaType, fileData} = this.props;

    return (
      <div>
        {mediaType === "image" &&
          <img src={fileData} className="img-fluid border" alt="preview"/>
        }
        {mediaType === "video" &&
          <video src={fileData} controls autoPlay className="img-fluid border"/>
        }
        {mediaType === "audio" &&
          <div>
            <img src={audioImageSrc} className="img-fluid border" alt="preview"/>
            <audio id="audio_preview" src={fileData} controls autoPlay />
          </div>
        }
      </div>
    );
  }
}

export default PreviewReact;