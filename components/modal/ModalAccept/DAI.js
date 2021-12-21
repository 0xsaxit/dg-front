import { useContext, useState } from 'react';
import {
  Modal,
  Button,
  Checkbox,
  Loader,
} from 'semantic-ui-react';
import { GlobalContext } from 'store';
import styles from './ModalAccept.module.scss';
import ButtonApproveDAI from 'components/button/ButtonApprove/DAI';

const DAI = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [checkedThree, setCheckedThree] = useState(false);

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

  function isCheckedThree() {
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
          {!state.daiLoading ? (
            <Button className={styles.disabled_enable}>Enable DAI</Button>
          ) : (
            <Button className={styles.disabled_enable}>
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
      <div
        style={{
          marginTop: '-60px',
          marginBottom: '45px',
          marginLeft: '-30px',
        }}
      >
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
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

        <span style={{ display: 'flex' }}>
          <Checkbox onClick={() => isCheckedOne()} />
          <p className={styles.subtitle_2} style={{ paddingTop: '3px' }}>
            I am at least 18 years old
          </p>
        </span>

        <span style={{ display: 'flex', paddingTop: '16px' }}>
          <Checkbox
            style={{ padding: '8px 0px 0px 0px' }}
            onClick={() => isCheckedTwo()}
          />
          <p className={styles.subtitle_2}>
            I reside in a jurisdiction where online gambling is permitted
          </p>
        </span>

        <span
          style={{ display: 'flex', paddingTop: '16px', paddingBottom: '24px' }}
        >
          <Checkbox
            style={{ padding: '8px 0px 0px 0px' }}
            onClick={() => isCheckedThree()}
          />
          <p className={styles.subtitle_2}>
            I have read and accept the&nbsp;
            <a
              className={styles.terms_a}
              href="https://docs.decentral.games/disclaimer"
            >
              Terms of Service
            </a>
          </p>
        </span>

        <span onClick={() => setOpen(false)}>
          <ButtonApproveDAI
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

export default DAI;
