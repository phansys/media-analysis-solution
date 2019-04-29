import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Button} from 'reactstrap';

/**
 * This component renders a form with a submit button
 */
class FormComponent extends React.Component {
  /**
   * @inheritdoc
   */
  static propTypes = {
    submitText: PropTypes.string,
    isDisabled: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  /**
   * @inheritdoc
   */
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
