import { useState, useEffect } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import DepositFunds from './DepositFunds';
import WithdrawFunds from './WithdrawFunds';

const ModalFunds = (props) => {
  // define local variables
  const [gameTypeInt, setGameTypeInt] = useState(0);

  useEffect(() => {
    if (props.gameType == 'Slots') {
      setGameTypeInt(1);
    } else if (props.gameType == 'Roulette') {
      setGameTypeInt(2);
    } else if (props.gameType == 'Backgammon') {
      setGameTypeInt(3);
    } else if (props.gameType == 'Blackjack') {
      setGameTypeInt(4);
    }
  }, []);

  return (
    <Modal
      trigger={
        <Button color="blue" className="balances-play-button">
          {props.modalType}
        </Button>
      }
      closeIcon
    >
      <Modal.Content>
        {props.modalType === 'deposit' ? (
          <DepositFunds gameTypeInt={gameTypeInt} />
        ) : (
          <WithdrawFunds gameTypeInt={gameTypeInt} />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default ModalFunds;
