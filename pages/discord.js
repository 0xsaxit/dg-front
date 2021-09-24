import React from 'react';
import Global from '../components/Constants';

export default class extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.writeHead(301, {
        Location: Global.CONSTANTS.DISCORD_URL,
      });
      res.end();
    } else {
      window.location = Global.CONSTANTS.DISCORD_URL;
    }
    return {};
  }
}