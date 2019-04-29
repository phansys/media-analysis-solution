import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Button} from 'reactstrap';

class FormComponent extends React.Component {
  static propTypes = {
    submitText: PropTypes.string,
    isDisabled: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  render() {
    const {children, onSubmit, submitText, isDisabled} = this.props;

    return (
      <Form onSubmit={onSubmit}>
        {children}
        <Row>
          <Col className="text-right">
            <Button type="submit" disabled={isDisabled} >{submitText}</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default FormComponent;
