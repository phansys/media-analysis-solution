import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';
import Amplify, {Storage} from 'aws-amplify';
import UploadFormComponent from './UploadForm';
import UploadLoading from './UploadLoading';

class UploadFormContainer extends React.Component {
  static propTypes = {
    acceptInput: PropTypes.string,
    filename: PropTypes.string,
    fileData: PropTypes.string,
    mediaType: PropTypes.string,
    isFormData: PropTypes.func,
    fetchCallback: PropTypes.func,
    onInputChange: PropTypes.func,
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
    const {children, mediaType, fileData, onInputChange, acceptInput, filename} = this.props;

    return (
      <div>
        <Alert name="error" color="danger" isOpen={showError} toggle={this.dismiss}>{errorMsg}</Alert>
        <UploadLoading isLoading={isLoading} />

        <UploadFormComponent
          acceptInput={acceptInput}
          filename={filename}
          onSubmit={this.onSubmit}
          isLoading={isLoading}
          onChange={onInputChange}
          mediaType={mediaType}
          fileData={fileData}
        >
          {children}
        </UploadFormComponent>
      </div>
    );
  }
}

export default UploadFormContainer;
