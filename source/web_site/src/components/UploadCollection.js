import React from 'react';
import uuidv4 from 'uuid/v4';
import {FormGroup, Label, InputGroupAddon, InputGroup, Input, FormText} from 'reactstrap';
import UploadForm from './UploadForm';
import previewImage from './../img/preview.png';

class UploadCollection extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      file: null,
      fileData: previewImage,
    };
  }

  isFormData = () => {
    const {file, name} = this.state;

    let value = {data: null, errorMsg: '', isValid: true};

    if (null === file) {
      value = {...value, errorMsg: 'File is required', isValid: false};

      return value;
    }

    if ('' === name) {
      value = {...value, errorMsg: 'Name is required', isValid: false};

      return value;
    }

    const fileExt = file.name.split('.').pop();
    const contentType = UploadForm.CONTENT_TYPE[fileExt.toLowerCase()];
    
    let uuid = uuidv4();
    const filename = `collection/${uuid}/${name}`;

    this.setState({uuid});

    value = {...value, data: {filename, file, parameter: {level: 'private', contentType}}};

    return value;
  }

  /**
   * @param {Object} data
   * @param {boolean} isSuccessSubmit
   */
  fetchCallback = (data, isSuccessSubmit) => {
    if (isSuccessSubmit) {
      this.setState({
        fileData: previewImage,
        file: null,
      });
    }
  }

  /**
   * @param {File} file
   * @param {ProgressEvent} fileData
   */
  onInputChange = ({file, fileData}) => {
    let update = {
      file: file,
      fileData: fileData.currentTarget.result,
    };

    this.setState({...update});
  }

  /**
   * @inheritdoc
   */
  render() {
    const {fileData, name, file} = this.state;

    return (
      <UploadForm
        acceptInput="image/png, image/jpeg"
        filename={file ? file.name : ''}
        mediaType="image"
        fileData={fileData}
        isFormData={this.isFormData}
        fetchCallback={this.fetchCallback}
        onInputChange={this.onInputChange}
      >
        <FormGroup>
          <Label for="exampleEmail">Name</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <span className="input-group-text">
                <i className="fa fa-address-card-o"></i>
              </span>
            </InputGroupAddon>
              <Input type="text" value={name} pattern="[a-zA-Z0-9_.-]+" placeholder="who's this?" onChange={(input) => {this.setState({name: input.target.value})}} />
          </InputGroup>
          <FormText color="muted">
            Please provide a name for this face ('[a-zA-Z0-9_.-]+')
          </FormText>
        </FormGroup>
      </UploadForm>
    );
  }
}

export default UploadCollection;
