import React from 'react';
import {FormGroup, Label, InputGroupAddon, InputGroup, Modal, Alert} from 'reactstrap';
import UploadForm from './UploadForm';
import previewImage from './../img/preview.png';
import StatusModal from './statusmodal';
import uuidv4 from 'uuid/v4';

class UploadMedia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'en-US',
      mediaType: 'image',
      fileData: previewImage,
      isOpenModal: false,
      showError: false,
      file: null,
    };
  }

  isFormData = () => {
    const {file, language} = this.state;

    let value = {data: null, errorMsg: '', isValid: true};

    if (null === file) {
      value = {...value, errorMsg: 'File is required', isValid: false};

      return value;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = file.name.split(`.${fileExt}`).shift();
    const contentType = UploadForm.CONTENT_TYPE[fileExt.toLowerCase()];
    
    let uuid = uuidv4();
    const filename = `media/${uuid}/content/${fileName}.${language}.${fileExt}`;

    this.setState({uuid, fileExt});

    value = {...value, data: {filename, file, parameter: {level: 'private', contentType}}};

    return value;
  }

  fetchCallback = (data, isSuccessSubmit) => {
    if (isSuccessSubmit) {
      this.setState({
        fileData: previewImage,
        file: null,
        mediaType: 'image',
        isOpenModal: true,
      });
    }
  }

  /**
   * @param {Object} data
   */
  onInputChange = ({file, fileData}) => {
    let update = {
      file: file,
      fileData: previewImage,
      mediaType: 'image',
    };

    if (file.size <= 200000000) {
      update = {
        ...update,
        fileData: fileData.currentTarget.result,
        mediaType: UploadForm.getFileType(file).type,
        showError: false,
      };
    } else {
      update = {
        ...update,
        showError: true,
        errorMsg: 'File previews are limited to 200MB or less for this demo page. Please upload file directly to media analysis S3 bucket using the following naming convention: private/<Cognito Identity ID>/media/<UUID v4>/content/filename.ext',
      };
    }

    this.setState({...update});
  }

  toggle = () => {
    this.setState((prev) => ({isOpenModal: !prev.isOpenModal}));
  }

  dismiss = () => {
    this.setState({showError: false});
  }

  render() {
    const {language, mediaType, fileData, isOpenModal, fileExt, uuid, file} = this.state;
    const {showError, errorMsg} = this.state;

    return (
      <div>
        <Alert name="error" color="danger" isOpen={showError} toggle={this.dismiss}>{errorMsg}</Alert>
        <Modal isOpen={isOpenModal} toggle={this.toggle}>
          <StatusModal format={fileExt} objectid={uuid}/>
        </Modal>
      
        <UploadForm
          acceptInput="image/png, image/jpeg, audio/mp3, audio/flac, audio/wav, video/quicktime, video/mp4"
          filename={file ? file.name : ''}
          mediaType={mediaType}
          fileData={fileData}
          isFormData={this.isFormData}
          fetchCallback={this.fetchCallback}
          onInputChange={this.onInputChange}
        >
          {
            ('video' === mediaType) && (
              <FormGroup>
                <Label for="exampleEmail">Language</Label>
                <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <i className="fa fa-language"></i>
                  </span>
                </InputGroupAddon>
                  <select type="select" className="form-control" value={language} onChange={(e) => this.setState({language: e.target.value})}>
                    <option value="en-US" >American English</option>
                    <option value="en-GB">British English</option>
                    <option value="es-US">Spanish</option>
                  </select>
                </InputGroup>
              </FormGroup>
            )
          }
        </UploadForm>
      </div>
    );
  }
}

export default UploadMedia;