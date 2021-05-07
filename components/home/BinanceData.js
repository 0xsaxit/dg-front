import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Button, Divider, Image, Icon, Modal, Checkbox } from 'semantic-ui-react';
import Aux from '../_Aux';
import { useRouter } from 'next/router';
import Fetch from '../../common/Fetch';

const BinanceData = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [utm, setUtm] = useState('');
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [binance, setBinance] = useState(false);
  const [open, setOpen] = useState(false);
  const [connectPressed, setConnectPressed] = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [checkedThree, setCheckedThree] = useState(false);

  const router = useRouter();
  let menuStyle = [];
  let listener = null;

  const realm = 'fenrir-amber';
  let buttonPlay = '';

  useEffect(() => {
    if (router.pathname.includes('binance')) {
      setBinance(true);
    } else {
      setBinance(false);
    }
  }, []);

  function pressed() {
    setConnectPressed(true);
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  async function openMetaMask() {
    if (metamaskEnabled) {
      // open MetaMask for login then get the user's wallet address
      await window.ethereum.enable();
      userAddress = window.ethereum.selectedAddress;

      // track MetaMask connect event
      analytics.track('Connected MetaMask', {
        userAddress: userAddress,
      });

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress,
      });

      // set global user status based on value stored in database
      // if new wallet update user status to 4 both locally and in the database
      // (/websiteLogin API call will return error with new wallet address)
      const response = await getUserStatus();

      if (response) {
        updateStatus(response, false);
      } else {
        updateStatus(4, true);
      }
    }
  }

  async function updateStatus(value, post) {
    if (post) {
      console.log('Posting user status to db: ' + value);

      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      // update user status in database
      await Fetch.REGISTER(userAddress, '', state.affiliateAddress);

      // update global state user status after fetch is complete
      dispatch({
        type: 'update_status',
        data: value,
      });
    } else {
      // update global state user status immediately
      dispatch({
        type: 'update_status',
        data: value,
      });
    }
  }

  async function getUserStatus() {
    console.log('Get user status: Connect');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      const responseStatus = await Fetch.USER_STATUS(userAddress, '');
      const jsonStatus = await responseStatus.json();

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: Connect');

      return false;
    }
  }

  useEffect(() => {
    buttonPlay = document.getElementById('play-now-button-home');
  }, []);

  useEffect(() => {
    if (buttonPlay) {
      analytics.trackLink(buttonPlay, 'Clicked PLAY NOW (home page)');
    }
  }, [buttonPlay]);

  useEffect(() => {
    if (typeof window.orientation !== 'undefined') {
      setVideoPlay(false);
    } else {
      setVideoPlay(true);
    }
  }, []);

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

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

  function isCheckedThree() {
    if (checkedThree === true) {
      setCheckedThree(false);
    } else {
      setCheckedThree(true);
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function homeVideo() {
    return (
      <div className="binance-video-container">
        <video
          id="my-video"
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1619719236/-Full_Screen_BG_nq4suo.mp4"
          type="video/mp4"
          frameBorder="0"
          autoPlay={videoPlay}
          loop
          muted
        ></video>
      </div>
    );
  }

  function modalOne() {
    return (
      <Aux>
        <Modal
          className="connect-metamask-modal"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={
            <Button
              color="blue"
              className={binance ? "metamask-button binance" : "metamask-button"}
            >
              Play Now
            </Button>
          }
        >
          <div style={{ margin: '-60px 0px 50px -30px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>

          <h3 style={{ textAlign: 'left' }}>  Connect Your Wallet </h3>

          <Button
            color="blue"
            className={binance ? "metamask-button binance big" : "metamask-button big"}
            onClick={() => {
              openMetaMask();
              pressed();
            }}
          >
            <span>
              <img 
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
                style={{ height: '36px', paddingRight: '24px', marginBottom: '-12px' }} 
              />
              Connect Metamask
            </span>
          </Button>

          <div>
            <p className="modal-text-small">
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io"> Metamask wallets </a>. We will never have access to your private keys and we can not access your funds without your direct confirmation.{' '}
            </p>
            <p className="modal-text-small" style={{ marginBottom: '-10px' }}>
              {' '}
              For the other casinos,{' '}
              <a className="modal-a" href="https://metamask.io"> click here </a>.
            </p>
          </div>
        </Modal>
      </Aux>
    );
  }

  function modalTwo() {
    return (
      <Aux>
        <Modal
          className="terms-of-service-modal"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={
            <Button
              color="blue"
              className={binance ? "metamask-button binance" : "metamask-button"}
              style={{ marginLeft: '16px' }}
            >
              Play Now
            </Button>
          }
        >
          <div style={{ margin: '-60px 0px 50px -30px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>

          <h3 style={{ fontSize: '24px', textAlign: 'left', margin: '42px 0px 8px 0px' }}>  Terms of Service </h3>

          <div>
            <p className="modal-text-medium">
              {' '}
              Please read our{' '}
              <a className="terms-a" href="https://docs.decentral.games/disclaimer"> Disclaimer </a>. To continue, you'll need to accept the following <a className="terms-a" href="https://docs.decentral.games/disclaimer"> Terms of Service </a> by checking each box
            </p>

            <Checkbox
              style={{ padding: '0px 0px 0px 0px' }}
              onClick={() => isCheckedOne()}
              label="I am at least 18 years old"
            />

            <Checkbox
              style={{ padding: '12px 0px 0px 0px' }}
              onClick={() => isCheckedTwo()}
              label="I reside in a jurisdiction where online gaming is permitted"
            />

            <Checkbox
              style={{ padding: '12px 0px 24px 0px' }}
              onClick={() => isCheckedThree()}
              label="I have read and accepted the Terms of Service"
            />

            {checkedOne && isCheckedTwo && checkedThree ? (
              <Button
                color="blue"
                className={binance ? "terms-button binance big" : "terms-button big"}
              >
                Continue
              </Button>
            ) : (
              <Button
                color="blue"
                className={binance ? "terms-button binance big" : "terms-button big"}
                disabled
              >
                Continue
              </Button>
            )}
          </div>
        </Modal>
      </Aux>
    );
  }

  function modalThree() {
    return (
      <Aux>
        <Modal
          className="connect-metamask-modal"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        >
          <div style={{ margin: '-60px 0px 50px -30px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>

          <h3 style={{ textAlign: 'left' }}>  TEST TEST TEST TEST </h3>

          <Button
            color="blue"
            className={binance ? "metamask-button binance big" : "metamask-button big"}
          >
            <span>
              <img 
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
                style={{ height: '36px', paddingRight: '24px', marginBottom: '-12px' }} 
              />
              Connect Metamask
            </span>
          </Button>

          <div>
            <p className="modal-text-small">
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io"> Metamask wallets </a>. We will never have access to your private keys and we can not access your funds without your direct confirmation.{' '}
            </p>
            <p className="modal-text-small" style={{ marginBottom: '-10px' }}>
              {' '}
              For the other casinos,{' '}
              <a className="modal-a" href="https://metamask.io"> click here </a>.
            </p>
          </div>
        </Modal>
      </Aux>
    );
  }

  function sectionOne() {
    return (
      <Aux>
        {homeVideo()}

        <div className="home-dashboard-content" style={{ marginTop: '-63px' }}>
          <img 
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1619577485/-Option_1_Play_sparkles_coins_high_res__1_a3qcxc_hswc38.gif"
            className="home-gif"
          />
          <h1
            className="home-dashboard-main-h1"
            style={{ marginBottom: '-32px' }}
          >
            Play at the Binance Casino with zero fees
          </h1>
          <span className="home-button-span">
          </span>
          <p className="home-dashboard-p centered">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis cursus placerat augue hendrerit nunc. Turpis et lorem aliquet amet senectus. 
          </p>
            <Button
              color="blue"
              className="demo-button-binance"
              href="https://www.youtube.com/embed/1NxYpUsxhC0"
              target="_blank"
            >
              Demo
            </Button>
            {state.userStatus === 0 ? (
              <span className="mobile-center-span">
                <Button
                  color="blue"
                  className="earn-dg-button"
                  id="mobile-button-hide"
                  href="https://www.youtube.com/embed/1NxYpUsxhC0"
                  target="_blank"
                  style={{ marginRight: '16px' }}
                >
                  Demo
                </Button>
                {modalOne()}
              </span>
            ) : (
              <span className="mobile-center-span">
                <Button
                  color="blue"
                  className="earn-dg-button"
                  href="https://docs.decentral.games/getting-started/play-to-mine"
                  target="_blank"
                >
                  Learn More
                </Button>
                {state.userAddress ? (
                  modalTwo()
                ) : null}
              </span>
            )}
        </div>
      </Aux>
    );
  }

  return (
    <div className="home-dashboard">
      {sectionOne()}
    </div>
  );
};

export default BinanceData;