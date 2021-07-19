import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import { Modal, Icon, Button, Checkbox, Input } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import BinanaceMetaMask from 'assets/svg/binanacemetamask.svg';
import BinanaceWallet from 'assets/svg/binancewallet.svg';

import styles from './ModalDepositBinance.module.scss';

const ModalDepositBinance = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [safari, setSafari] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);
  const [connectPressed, setConnectPressed] = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [checkedThree, setCheckedThree] = useState(false);
  const [withdrawSelected, setWithdrawSelected] = useState(false);
  const [amountInput, setAmountInput] = useState('0 BUSD');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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

  useEffect(() => {
    if (!open) {
      setCheckedOne(false);
      setCheckedTwo(false);
      setCheckedThree(false);
    }
  }, [open, checkedOne, checkedTwo, checkedThree]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setAmountInput(e.target.value);
  }

  const pressed = () => {
    setConnectPressed(true);
  }

  console.log('!!!');
  console.log(amountInput);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  return (
    <span>
      <Modal
        className={styles.deposit_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <button className={cn('btn', styles.deposit_modal_binance)}>
            Play Now
          </button>
        }
      >
        <div className={styles.close_icon}>
          <span className={styles.mailchim_close} onClick={() => setOpen(false)}>
            <Icon name="close" />
          </span>
        </div>

        <h4 className={styles.title}> Terms of Service </h4>

        <div>
          <p className={styles.subtitle}>
            {' '}
            Please read our{' '}
            <a
              className={styles.terms_a}
              href="https://docs.decentral.games/disclaimer"
            >
              {' '}
              Disclaimer
            </a>
            . To continue, you'll need to accept the following{' '}
            <a
              className={styles.terms_a}
              href="https://docs.decentral.games/disclaimer"
            >
              {' '}
              Terms of Service{' '}
            </a>{' '}
            by checking each box.
          </p>

          <span className="d-flex">
            <Checkbox
              className={styles.modal_checkbox_first}
              onClick={() => isCheckedOne()}
            />
            <p className={styles.subtitle_2}>
              {' '}
              I am at least 18 years old{' '}
            </p>
          </span>

          <span className={cn("d-flex", styles.modal_checkbox_second)}>
            <Checkbox
              className={styles.modal_checkbox_second_padding}
              onClick={() => isCheckedTwo()}
            />
            <p className={styles.subtitle_2}>
              {' '}
              I reside in a jurisdiction where online gambling is permitted{' '}
            </p>
          </span>

          <span className={cn("d-flex", styles.modal_checkbox_third)}>
            <Checkbox
              className={styles.modal_checkbox_third_padding}
              onClick={() => isCheckedThree()}
            />
            <p className={styles.subtitle_2}>
              {' '}
              I have read and accepted the{' '}
              <a
                className={styles.terms_a}
                href="https://docs.decentral.games/disclaimer"
              >
                {' '}
                Terms of Service{' '}
              </a>
            </p>
          </span>

          {checkedOne && checkedTwo && checkedThree ? (
            <button
              className={cn('btn', styles.continue_binance)}
              onClick={() => {
                setOpen(false);
                setSecondOpen(true);
              }}
            >
              Continue
            </button>
          ) : (
            <button className={cn('btn', styles.continue_binance)} disabled>
              Continue
            </button>
          )}
        </div>
      </Modal>

      <Modal
        className={styles.busd_modal}
        onClose={() => setSecondOpen(false)}
        open={secondOpen}
        close
      >
        <div className={styles.busd_modal_second_open}>
          <span
            className={styles.mailchimp_close}
            onClick={() => setSecondOpen(false)}
          >
            <Icon name="close" />
          </span>
        </div>

        <span className="d-flex">
          <Button
            className={
              withdrawSelected
                ? styles.binance_deposit_button_grey
                : styles.binance_deposit_button
            }
            onClick={() => setWithdrawSelected(false)}
          >
            Deposit
          </Button>
          <Button
            className={
              withdrawSelected
                ? styles.binance_withdraw_button_grey
                : styles.binance_withdraw_button
            }
            onClick={() => setWithdrawSelected(true)}
          >
            Withdraw
          </Button>
        </span>

        {!withdrawSelected ? (
          <span>
            <h3 className={styles.title}> Send BUSD to your address </h3>

            <p className={cn("text-center", styles.subtitle)}>
              (The address below is your Metamask wallet)
            </p>

            <Button className={styles.outline_button}>
              <span className="d-flex flex-row">
                <img
                  className={styles.busd_img}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620415238/BUSD_ytjkgd.png"
                />
                <span className="d-flex flex-column">
                  <span className="d-flex">
                    <h3 className={styles.deposit_address}>
                      {state.userAddress.substr(0, 8) +
                        '...' +
                        state.userAddress.substr(-12)}
                    </h3>
                  </span>
                  <p className={styles.deposit_subtitle}>
                    Your Metamask Address
                  </p>
                </span>
                <BinanaceMetaMask />
              </span>
            </Button>

            <span className={cn("d-flex", styles.busd_modal_img)}>
              <img
                className={styles.busd_img_2}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620415238/BUSD_ytjkgd.png"
              />
              <span className="d-flex justify-content-between w-100">
                <span className={cn("d-flex flex-column", styles.busd_img_title)}>
                  <h3 className={styles.deposit_address}>BUSD</h3>
                  <p className={styles.deposit_subtitle_2}>Balance</p>
                </span>
                <span className={cn("d-flex flex-column", styles.busd_img_title)}>
                  <h3 className={cn("text-end", styles.deposit_address_2)}>
                    {state.userBalances[3][1].toFixed(2)} BUSD
                  </h3>
                  <p className={styles.deposit_subtitle_3}>
                    ${state.userBalances[3][1].toFixed(2)}
                  </p>
                </span>
              </span>
            </span>

            <button className={cn('btn', styles.copy_binance)}>
              <span className="d-flex justify-content-center">
                Copy Wallet Address
                <BinanaceWallet />
              </span>
            </button>

            <h3 className={styles.continue_subtitle}>Continue to Casino</h3>
          </span>
        ) : (
          <span>
            <span className={cn("d-flex justify-content-center", styles.busd_amount_title)}>
              <Input
                className={styles.withdraw_input}
                placeholder="Amount"
                value={amountInput}
                onChange={handleChange}
              />
            </span>

            <p className={cn("text-center", styles.subtitle)}>
              ${amountInput}
            </p>

            <button
              className={cn('btn', styles.max_button)}
              onClick={() => {
                setAmountInput(state.userBalances[3][1].toFixed(2));
                setContinuePressed(true);
              }}
            >
              Max
            </button>

            <Input
              className={styles.outline_input}
              fluid
              placeholder="To: Paste BUSD Address Here"
            />

            <span className={cn("d-flex", styles.busd_modal_img)}>
              <img
                className={styles.busd_img_2}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620415238/BUSD_ytjkgd.png"
              />
              <span className="d-flex justify-content-between w-100">
                <span className={cn("d-flex flex-column", styles.busd_img_title)}>
                  <h3 className={styles.deposit_address}>BUSD</h3>
                  <p className={styles.deposit_subtitle_2}>Balance</p>
                </span>
                <span className={cn("d-flex flex-column", styles.busd_img_title)}>
                  <h3
                    className={cn("text-end", styles.deposit_address_2)}
                    className={styles.deposit_address_2}
                  >
                    {state.userBalances[3][1].toFixed(2)} BUSD
                  </h3>
                  <p className={styles.deposit_subtitle_3}>
                    ${state.userBalances[3][1].toFixed(2)}
                  </p>
                </span>
              </span>
            </span>

            <button className={cn('btn', styles.copy_binance_metamask)}>
              Continue to Metamask
            </button>
          </span>
        )}
      </Modal>
    </span>
  );
};

export default ModalDepositBinance;
