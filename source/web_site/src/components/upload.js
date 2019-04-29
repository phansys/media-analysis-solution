import React, { Component } from 'react';
import {Container, Row, Col, Modal, ModalHeader, ModalBody} from 'reactstrap';
import {withAuthenticator} from 'aws-amplify-react';
import UploadMedia from './UploadMedia';
import UploadCollection from './UploadCollection';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
    }
  }

  toggleModal = () => {
    this.setState((prev) => ({isLoading: !prev.isLoading}))
  }

  render() {
    const {isLoading} = this.state;

    return (
      <Container>
        <Modal isOpen={isLoading} toggle={this.toggleModal} size="lg">
          <ModalHeader>Add to Collection</ModalHeader>
          <ModalBody>
            <p className="lead font-size--18">Upload new images of faces to be indexed in your Amazon Rekognition collection</p>
            <Row>
              <Col>
                <UploadCollection />
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Row>
          <Col xs="12">
            <div className="justify-content-between" style={{display: 'flex'}}>
              <h1 className="display-6 font-size--35">Analyze new Media</h1>
              <button className="btn btn-link" onClick={this.toggleModal}>Add image</button>
            </div>
            <hr className="my-2" />
            <p className="lead font-size--18">Upload new image, video, or audio file to be analyzed by the Media Analysis Solution</p>
          </Col>
        </Row>

        <UploadMedia />
      </Container>
    );
  }
}

export default withAuthenticator(Upload);
