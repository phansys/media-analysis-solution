import React, {useState} from 'react';
import {Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Button} from 'reactstrap';

export default class TranscriptTab extends React.Component {
  /**
   * @inheritdoc
   */
  state = {
    tab: 0,
  }

  /**
   * @param {number} tab
   */
  setTab = (tab) => {
    this.setState({tab});
  }

  /**
   * @inheritdoc
   */
  render() {
    const {tab} = this.state;
    const {transcript = {}} = this.props;

    let navItems = [];
    let content = [];
    const languages = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'Frances',
      'zh': 'Chinese',
      'tr': 'Turkish',
      'pt': 'Portuguese',
    };

    const transcriptKeys = Object.keys(transcript);

    if (0 === transcriptKeys.length) {
      return 'Transcript unavailable';
    }

    transcriptKeys.forEach((lang, index) => {
      navItems = [
        ...navItems,
        <NavItem key={index}>
          <NavLink active={tab === index} onClick={() => this.setTab(index)} style={{cursor:  tab === index ? 'default' : 'pointer'}}>
            {languages[lang]}
          </NavLink>
        </NavItem>
      ];

      content = [
        ...content,
        <TabPane tabId={index} key={index}>
          <Row>
            <Col sm="12">
              <div className="text-left">{transcript[lang]}</div>
            </Col>
          </Row>
        </TabPane>
      ];

    });

    return (
      <div style={{display: 'flex'}}>
        <Nav pills vertical >
          {navItems}
        </Nav>
        <TabContent activeTab={tab} style={{padding: 8}}>
          {content}
        </TabContent>
      </div>
    );
  }
}
