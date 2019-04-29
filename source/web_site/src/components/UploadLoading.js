import React from 'react';
import PropTypes from 'prop-types';
import {Modal, ModalHeader, ModalBody, Progress} from 'reactstrap';

class UploadLoading extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
  }

  render() {
    const {isLoading} = this.props;

    return (
      <Modal isOpen={isLoading}>
        <ModalHeader>Upload Progress</ModalHeader>
        <ModalBody>
          <div>Uploading</div>
          <Progress animated color="warning" value="100" />
        </ModalBody>
      </Modal>
    )
  }
}

export default UploadLoading;
