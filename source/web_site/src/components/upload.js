import React, { Component } from 'react';
import {Container, Row, Col} from 'reactstrap';
import {withAuthenticator} from 'aws-amplify-react';
import UploadCollection from './UploadCollection';

class Upload extends Component {
  /**
   * @inheritdoc
   */
  render() {
    return (
      <Container>
        <Row>
          <Col xs="12">
            <h1 className="display-6 font-size--35">Add to Collection</h1>
            <hr className="my-2" />
            <p className="lead font-size--18">Upload new images of faces to be indexed in your Amazon Rekognition collection</p>
          </Col>
        </Row>

        <UploadCollection />
      </Container>
    );
  }
}

export default withAuthenticator(Upload);
