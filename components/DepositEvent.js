import React from 'react';

class DepositEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] };

    this.connection = {};
  }

  componentDidMount() {
    const data = {
      id: 1,
      method: 'eth_subscribe',
      params: ['newDeposits', {}],
    };
    this.connection = new WebSocket('wss://ws-mumbai.matic.today/');

    // this.connection.addEventListener(
    //   { id: 1, method: 'eth_subscribe', params: ['newDeposits', { Did: 21 }] },
    //   function (event) {
    //     console.log('Message from server ', event.data);
    //   }
    // );

    this.connection.onopen = (event) => {
      console.log('WebSocket is open now.');

      this.connection.send(
        '{"id": 1, "method": "eth_subscribe", "params": ["newDeposits", {}]}'
      );
    };

    // listen to onmessage event
    this.connection.onmessage = (evt) => {
      this.setState({
        messages: this.state.messages.concat([evt.data]),
      });
    };

    // for testing purposes: sending to the echo service which will send it back back
    // setInterval((_) => {
    //   this.connection.send(Math.random());
    // }, 2000);
  }

  render() {
    // slice(-5) gives us the five most recent messages
    return (
      <ul>
        {this.state.messages.slice(-5).map((msg, idx) => (
          <li key={'msg-' + idx}>{msg}</li>
        ))}
      </ul>
    );
  }
}

export default DepositEvent;
