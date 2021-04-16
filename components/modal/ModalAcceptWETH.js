import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Divider, Icon, Checkbox } from 'semantic-ui-react';
import { GlobalContext } from '../../store';
import ButtonApproveWETH from '../button/buttonApproveWETH';

const ModalAcceptWETH = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function isCheckedOne() {
    if (checkedOne === true) {
      setCheckedOne(false);
    } else {
      setCheckedOne(true);
    }
  }

  function isCheckedTwo() {
    if (checkedTwo === true) {
      setCheckedTwo(false);
    } else {
      setCheckedTwo(true);
    }
  }

  return (
    <Modal
      className="menu-info-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <Button
          className="balances-authorize-button"
          id="balances-padding-correct"
        >
          ENABLE WETH
        </Button>
      }
    >
      <div style={{ margin: '21px 30px 0px 30px' }}>
        <span className="mailchimp-close" onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <p className="mailchimp-header-text"> Terms of Service </p>

      <Divider style={{ marginTop: '-15px' }} />

      <div style={{ padding: '10px 30px 30px 30px' }}>
        <p>
          {' '}
          Please take a few minutes to read and understand our{' '}
          <a href="https://docs.decentral.games/disclaimer"> disclaimer</a>. To
          continue, you'll need to accept the following Terms of Service by
          checking each box.{' '}
        </p>

        <Checkbox
          style={{ padding: '0px 0px 0px 0px' }}
          onClick={() => isCheckedOne()}
          label="I am at least 18 years old"
        />

        <Checkbox
          style={{ padding: '12px 0px 24px 0px' }}
          onClick={() => isCheckedTwo()}
          label="I reside in a jurisdiction where online gaming is permitted"
        />

        {checkedOne === true && checkedTwo === true ? (
          <span onClick={() => setOpen(false)}>
            <ButtonApproveWETH />
          </span>
        ) : (
          <Button
            className="balances-authorize-button"
            id="balances-padding-correct"
            disabled
          >
            ENABLE WETH
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ModalAcceptWETH;