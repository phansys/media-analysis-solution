import React from 'react';

export default class Loading extends React.Component {
  /**
   * @inheritdoc
   */
  render () {
    return (
      <div className="spinner-border text-secondary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
}