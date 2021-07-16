import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Icon, Modal, Divider } from 'semantic-ui-react';
import Global from '../Constants';

import styles from './ModalAffiliates.module.scss';

const ModalAffiliates = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const referralLink = Global.CONSTANTS.BASE_URL + '/' + state.userInfo.id;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const onCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  return (
    <Modal
      className={styles.referral_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          <b className={styles.account_hover}>REFERRALS</b>
        </span>
      }
    >
      <div className={styles.mailchimp_margin}>
        <span className={styles.mailchimp_close} onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <p className={styles.mailchimp_header_text}>Refer a Friend</p>

      <Divider style={{ marginTop: '-15px' }} />

      <p style={{ margin: '21px 30px 15px 30px' }}>
        {' '}
        Copy your unique referral link and share it far and wide. Any time a new
        user deposits crypto, you'll earn 10% of the $DG they mine.
      </p>
      <p style={{ margin: '12px 30px 30px 30px' }}>
        {' '}
        <b>Please Note:</b> This link will only earn you $DG when shared with a
        user who has not yet registered an account.
      </p>
      <p className={styles.welcome_text} style={{ marginLeft: '15px' }}>
        {' '}
        Referral Link{' '}
      </p>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          border: '1px solid rgb(229, 232, 235',
          borderRadius: '4px',
          margin: '6px 30px 30px 30px',
          padding: '3px 6px 6px 6px',
        }}
      >
        <p>{referralLink}</p>
        {copied == false ? (
          <Icon
            className={styles.affiliate_icon}
            onClick={() => onCopy()}
            name="copy"
          />
        ) : (
          <Icon
            className={styles.affiliate_icon}
            onClick={() => onCopy()}
            name="check"
          />
        )}
      </span>
    </Modal>
  );
};

export default ModalAffiliates;
