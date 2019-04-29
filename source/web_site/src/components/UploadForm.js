import React from 'react';
import PropTypes from 'prop-types';
import FormComponent from './FormComponent';
import PreviewReact from './PreviewMedia';
import {Row, Col, FormGroup, FormText, Label} from 'reactstrap';
import InputUpload from './InputUpload';

class UploadFormComponent extends React.Component {
  static propTypes = {
    filename: PropTypes.string,
    acceptInput: PropTypes.string,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    fileData: PropTypes.string,
    mediaType: PropTypes.string,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: () => {},
    onChange: () => {},
  }

  static getFileType(file) {
    const [type, format] = file.type.split('/');

    return {type, format};
  }

  static get CONTENT_TYPE() {
    return  {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'mp3': 'audio/mp3',
      'wav': 'audio/wav',
      'wave': 'audio/wav',
      'flac': 'audio/flac',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    }
  }
  
  render() {
    const {onChange, children, isDisabled, acceptInput, mediaType, fileData} = this.props;
    const {isLoading, onSubmit, filename} = this.props;

    return (
      <Row>
        <Col lg="4" md={{size: 5, order: 0}} xs={{order: 2}}>
          <FormComponent onSubmit={onSubmit} submitText="Upload Media" isDisabled={isDisabled}>
            <FormGroup>
              <Label for="exampleEmail">File</Label>
              <InputUpload
                filename={filename}
                isLoading={isLoading}
                accept={acceptInput}
                onChange={onChange}
              />
              <FormText color="muted">
                Media will be uploaded with the same name
              </FormText>
            </FormGroup>
            {children}
          </FormComponent>
        </Col>
        <Col lg="8" md="7">
          <PreviewReact
            mediaType={mediaType}
            fileData={fileData}
          />
        </Col>
      </Row>
    );
  }
}

export default UploadFormComponent;
