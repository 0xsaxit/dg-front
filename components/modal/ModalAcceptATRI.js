import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Divider, Icon, Checkbox, Loader } from 'semantic-ui-react';
import { GlobalContext } from '../../store';
import ButtonApproveATRI from '../button/buttonApproveATRI';

const ModalAcceptATRI = () => {
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
        <span>
          {!state.atriLoading ? (
            <Button
              className="balances-authorize-button"
              id="balances-padding-correct"
            >
              Enable ATRI
            </Button>
          ) : (
            <Button
              className="balances-authorize-button"
              id="balances-padding-correct"
            >
              <Loader
                active
                inline
                size="tiny"
                className="auth-loader"
                style={{
                  fontSize: '12px',
                }}
              />
            </Button>  
          )}
        </span> 
      }
    >
      <div style={{ marginTop: '-32px' }}>
        <span className="mailchimp-close" onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <h3 style={{ textAlign: 'left', margin: '42px 0px 8px 30px' }}>  Terms of Service </h3>

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
            <ButtonApproveATRI/>
          </span>
        ) : (
          <Button
            className="balances-authorize-button"
            id="balances-padding-correct"
            disabled
          >
            Enable ATRI
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ModalAcceptATRI;