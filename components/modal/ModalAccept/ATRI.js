import { useEffect, useContext, useState } from 'react';
import { Modal, Button, Checkbox, Loader } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import styles from './ModalAccept.module.scss';
import ButtonApproveATRI from 'components/button/ButtonApprove/ATRI';
import OpenIcon from 'assets/svg/open.svg';


const ATRI = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [checkedThree, setCheckedThree] = useState(false);

  const isCheckedOne = () => {
    if (checkedOne === true) {
      setCheckedOne(false);
    } else {
      setCheckedOne(true);
    }
  }

  const isCheckedTwo = () => {
    if (checkedTwo === true) {
      setCheckedTwo(false);
    } else {
      setCheckedTwo(true);
    }
  }

  const isCheckedThree = () => {
    if (checkedThree === true) {
      setCheckedThree(false);
    } else {
      setCheckedThree(true);
    }
  }

  return (
    <Modal
      className={styles.terms_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          {!state.atriLoading ? (
            <Button className={styles.disabled_enable}>
              Enable ATRI
            </Button>
          ) : (
            <Button className={styles.disabled_enable}>
              <Loader
                active
                inline
                size="tiny"
                className={styles.auth_loader}
              />
            </Button>
          )}
        </span>
      }
    >
      <div
        style={{
          marginTop: '-60px',
          marginBottom: '45px',
          marginLeft: '-30px',
        }}
      >
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <OpenIcon />
        </span>
      </div>

        <h4 className={styles.title}> Terms of Service </h4>

        <div>
          <p className={styles.subtitle}>
            {' '}
            Please read our{' '}
            <a className={styles.terms_a} href="https://docs.decentral.games/disclaimer"> Disclaimer</a>. To continue, you'll need to accept the following <a className={styles.terms_a} href="https://docs.decentral.games/disclaimer"> Terms of Service </a> by checking each box.
          </p>

          <span classname="d-flex">
            <Checkbox
              onClick={() => isCheckedOne()}
            />
            <p className={styles.subtitle_2} style={{ paddingTop: '3px' }}> I am at least 18 years old </p>
          </span>

          <span style={{ display: 'flex', paddingTop: '16px' }}>
            <Checkbox
              style={{ padding: '8px 0px 0px 0px' }}
              onClick={() => isCheckedTwo()}
            />
            <p className={styles.subtitle_2}> I reside in a jurisdiction where online gambling is permitted </p>
          </span>

          <span style={{ display: 'flex', paddingTop: '16px', paddingBottom: '24px' }}>
            <Checkbox
              style={{ padding: '8px 0px 0px 0px' }}
              onClick={() => isCheckedThree()}
            />
            <p className={styles.subtitle_2}> I have read and accepted the <a className={styles.terms_a} href="https://docs.decentral.games/disclaimer"> Terms of Service </a></p>
          </span>

        {checkedOne === true && checkedTwo === true && checkedThree === true ? (
          <span onClick={() => setOpen(false)}>
            <ButtonApproveATRI />
          </span>
        ) : (
          <Button className={styles.disabled_enable} disabled>
            Enable ATRI
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ATRI;
