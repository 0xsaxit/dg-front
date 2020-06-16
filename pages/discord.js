import React from 'react';
import Global from '../components/constants';

export default class extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.writeHead(301, {
        Location: Global.DISCORD_URL,
      });
      res.end();
    } else {
      window.location = Global.DISCORD_URL;
    }
    return {};
  }
}
