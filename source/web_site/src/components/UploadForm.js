import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Row, Col, FormGroup, FormText, Label} from 'reactstrap';
import Amplify, {Storage} from 'aws-amplify';
import FormComponent from './FormComponent';
import PreviewReact from './PreviewMedia';
import InputUpload from './InputUpload';
import UploadLoading from './UploadLoading';

class UploadForm extends React.Component {
  static propTypes = {
    acceptInput: PropTypes.string,
    filename: PropTypes.string,
    fileData: PropTypes.string,
    mediaType: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFormData: PropTypes.func,
    fetchCallback: PropTypes.func,
    onInputChange: PropTypes.func,
  }

  /**
   * @param {string} file
   *
   * @return {Object}
   */
  static getFileType(file) {
    const [type, format] = file.type.split('/');

    return {type, format};
  }

  /**
   * @returns {Object}
   */
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
      showError: false,
      isLoading: false,
      errorMsg: null,
    };
  }

  successFetch = (response) => {
    const {fetchCallback} = this.props;
    this.toggleLoading();
    this.setState({
      showError: false,
      errorMsg: null,
    });
    fetchCallback(response, true);
  }
  
  errorFetch = (error) => {
    const {fetchCallback} = this.props;
    this.toggleLoading();
    this.setState({
      showError: true,
      errorMsg: "Failed to upload file to Amazon S3"
    });
    fetchCallback(error, false);
  }

  request = (data) => {
    const {filename, file, parameter} = data;
    Storage.put(filename, file, parameter)
      .then((response) => this.successFetch(response))
      .catch((error) => this.errorFetch(error));
  }

  toggleLoading = () => {
    this.setState((prev) => ({isLoading: !prev.isLoading}));
  }

  onSubmit = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    const {isFormData} = this.props;
    const {isValid, data, errorMsg} = isFormData();

    if (!isValid) {
      this.setState({showError: true, errorMsg});

      return
    }

    this.toggleLoading();
    this.request(data);
  }

  dismiss = () => {
    this.setState({showError: false});
  }

  render() {
    const {isLoading, showError, errorMsg} = this.state;
    const {children, mediaType, fileData, onInputChange, acceptInput, filename, isDisabled} = this.props;

    return (
      <div>
        <Alert name="error" color="danger" isOpen={showError} toggle={this.dismiss}>{errorMsg}</Alert>
        <UploadLoading isLoading={isLoading} />

        <Row>
          <Col lg="4" md={{size: 5, order: 0}} xs={{order: 2}}>
            <FormComponent onSubmit={this.onSubmit} submitText="Upload Media" isDisabled={isDisabled}>
              <FormGroup>
                <Label for="exampleEmail">File</Label>
                <InputUpload
                  filename={filename}
                  isLoading={isLoading}
                  accept={acceptInput}
                  onChange={onInputChange}
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
      </div>
    );
  }
}

export default UploadForm;
