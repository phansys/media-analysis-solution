import React, { Component } from 'react';
import Amplify, { Auth, Storage, API } from 'aws-amplify';
import { BrowserRouter as Router, Switch, Route, NavLink as RRNavLink, Link} from 'react-router-dom';
import { NavbarBrand, Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import Upload from './upload';
import Browse from './browse';
import Settings from './settings';
import Live from './Live';
import Result from './result';
import nubityIcon from './../img/nubity-icon.png';
import './../styles/navbar.css';
import Layout from './layout';
import VimeoBimbo from './VimeoBimbo';
declare var media_analysis_config;

Amplify.configure({
  Auth: {
    region: media_analysis_config.SOLUTION_REGION,
    userPoolId: media_analysis_config.SOLUTION_USERPOOLID,
    userPoolWebClientId: media_analysis_config.SOLUTION_USERPOOLWEBCLIENTID,
    identityPoolId: media_analysis_config.SOLUTION_IDENTITYPOOLID
  },
  Storage: {
        bucket: media_analysis_config.SOLUTION_BUCKET,
        region: media_analysis_config.SOLUTION_REGION,
        identityPoolId: media_analysis_config.SOLUTION_IDENTITYPOOLID
    },
  API: {
      endpoints: [
        {
            name: "MediaAnalysisApi",
            region: media_analysis_config.SOLUTION_REGION,
            endpoint: media_analysis_config.SOLUTION_ENDPOINT
        }
      ]
  }
});

class App extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path='/bimbo-live' component={VimeoBimbo} />
            <Layout>
              <Route exact path='/' component={Browse} />
              <Route path='/collection' component={Upload} />
              <Route path='/Live' component={Live} />
              <Route path='/settings' component={Settings} />
              <Route path='/result/:objectid' component={Result} />
            </Layout>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
