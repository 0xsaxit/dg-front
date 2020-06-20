import React from 'react';

class DepositEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [], depositCount: 0 };

    this.userAddress = '';
    this.connection = {};
  }

  componentDidMount() {
    this.userAddress = window.web3.currentProvider.selectedAddress;
    this.connection = new WebSocket('wss://ws-mumbai.matic.today/');

    const data = {
      id: 1,
      method: 'eth_subscribe',
      params: ['newDeposits', { Did: 21 }],
    };

    // params: ['newDeposits', { Contract: this.userAddress }],

    console.log('data...');
    console.log(data);

    this.connection.onopen = (event) => {
      console.log('WebSocket now open...');

      this.connection.send(JSON.stringify(data));
    };

    // listen to onmessage event
    this.connection.onmessage = (event) => {
      console.log('incoming event...');
      console.log(event);

      console.log('event data...');
      console.log(event.data);

      this.setState({
        messages: this.state.messages.concat([event.data]),
      });
    };
  }

  render() {
    console.log('render message...');
    console.log(this.state.messages);

    // slice(-5) gives us the five most recent messages
    return (
      <ul>
        {this.state.messages.slice(-5).map((message, id) => (
          <li key={id}>
            message {id}: {message}
          </li>
        ))}
      </ul>
    );
  }
}

export default DepositEvent;
