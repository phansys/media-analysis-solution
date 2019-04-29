import React from 'react';
import PropTypes from 'prop-types';
import {Input, InputGroup, InputGroupAddon} from 'reactstrap';

class InputUpload extends React.Component {
  /**
   * @inheritdoc
   */
  static propTypes = {
    isLoading: PropTypes.bool,
    accept: PropTypes.string,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    }
  }

  fileReader = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = resolve;
      FileReader.onerror = reject;
    });
  }

  onInputChange = (inputData) => {
    inputData.preventDefault();
    let file = inputData.target.files[0];
    this.setState(
      {isLoading: true},
      () => {
        this.fileReader(file)
          .then((fileData) => {
            this.setState(
              {isLoading: false},
              () => this.props.onChange({file, fileData})
            );
          });
      }
    );
  }

  /**
   * @inheritdoc
   */
  render() {
    const {accept, filename} = this.props;
    const {isLoading} = this.state;

    if (isLoading) {
      return (
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <a className="btn btn-secondary text-white pointer">
            <i className="fa fa-folder"></i>
            <Input addon type="file" className="input-file" accept={accept} onChange={this.onInputChange} />
          </a>
        </InputGroupAddon>
        <Input placeholder="no file was chosen" value={filename} disabled />
      </InputGroup>
    );
  }
}

export default InputUpload;
