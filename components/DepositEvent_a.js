class DepositEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
  }

  componentDidMount() {
    const data = {
      id: 1,
      method: 'eth_subscribe',
      params: ['newDeposits', {}],
    };

    // this is an "echo" websocket service
    this.connection = new WebSocket('wss://ws-mumbai.matic.today?id=1');

    // this.connection.addEventListener('message', function (event) {
    //   console.log('Message from server ', event.data);
    // });

    // listen to onmessage event
    this.connection.onmessage = (evt) => {
      // add the new message to state
      this.setState({
        messages: this.state.messages.concat([evt.data]),
      });
    };

    // for testing purposes: sending to the echo service which will send it back back
    setInterval((_) => {
      this.connection.send(Math.random());
    }, 2000);
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
