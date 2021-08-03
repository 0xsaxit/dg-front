import { useContext, useState } from 'react';
import cn from 'classnames';
import { Modal, Button, Checkbox, Loader } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import ButtonApproveUSDT from 'components/button/ButtonApprove/USDT';
import OpenIcon from 'assets/svg/open.svg';

import styles from './ModalAccept.module.scss';

const USDT = () => {
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
          {!state.usdtLoading ? (
            <Button className={styles.disabled_enable}>Enable USDT</Button>
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
      <div className={styles.terms_modal_open_icon}>
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <OpenIcon />
        </span>
      </div>

      <h4 className={styles.title}> Terms of Service </h4>

      <div>
        <p className={styles.subtitle}>
          Please read our&nbsp;
          <a
            className={styles.terms_a}
            href="https://docs.decentral.games/disclaimer"
          >
            Disclaimer
          </a>
          . To continue, you'll need to accept the following&nbsp;
          <a
            className={styles.terms_a}
            href="https://docs.decentral.games/disclaimer"
          >
            Terms of Service
          </a>
          &nbsp; by checking each box.
        </p>

          <span className="d-flex">
            <Checkbox
              onClick={() => isCheckedOne()}
            />
            <p className={styles.subtitle_2}> I am at least 18 years old </p>
          </span>

          <span className={cn("d-flex", styles.terms_modal_second)}>
            <Checkbox
              className={styles.terms_modal_checkbox}
              onClick={() => isCheckedTwo()}
            />
            <p className={styles.subtitle_2}> I reside in a jurisdiction where online gambling is permitted </p>
          </span>

          <span classNAme={cn("d-flex", styles.terms_modal_three)}>
            <Checkbox
              className={styles.terms_modal_checkbox}
              onClick={() => isCheckedThree()}
            />
            <p className={styles.subtitle_2}> I have read and accepted the <a className={styles.terms_a} href="https://docs.decentral.games/disclaimer"> Terms of Service </a></p>
          </span>

        <span onClick={() => setOpen(false)}>
          <ButtonApproveUSDT
            passed={
              checkedOne === true &&
              checkedTwo === true &&
              checkedThree === true
            }
          />
        </span>
      </div>
    </Modal>
  );
};

export default USDT;
