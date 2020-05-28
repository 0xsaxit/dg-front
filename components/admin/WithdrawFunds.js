import React from 'react';
import { Form, Input } from 'semantic-ui-react';

let Global;

class WithdrawFunds extends React.Component {
  constructor(props) {
    super(props);

    let gameTypeInt = 0;
    if (props.gameType == 'MANA Slots') {
      gameTypeInt = 1;
    } else if (props.gameType == 'MANA Roulette') {
      gameTypeInt = 2;
    }

    this.state = { gameTypeInt: gameTypeInt, amount: 0 };
  }

  componentDidMount() {
    Global = require('../constants').default;
  }

  inputChange = (e) => {
    const valueWei = e.target.value * 1000000000000000000;
    this.setState({ amount: valueWei });
  };

  withdrawFunds = () => {
    Global.withdrawFromParent(
      this.state.gameTypeInt,
      this.state.amount,
      'MANA'
    );
  };

  render() {
    return (
      <div>
        <Form.Field>
          <Input
            placeholder={'ENTER AMOUNT'}
            action={{
              color: 'blue',
              labelPosition: 'right',
              content: 'WITHDRAW',
              icon: 'ethereum',
              onClick: this.withdrawFunds,
            }}
            onChange={this.inputChange}
          />
        </Form.Field>
      </div>
    );
  }
}

export default WithdrawFunds;
