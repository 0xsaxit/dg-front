import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './IceDelegatedCheckedInTooltip.module.scss';

const IceDelegatedCheckedInTooltip = () => {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.imgDiv}>
        <img
          className={styles.img}
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637210248/checked_in_kkxwqv.png"
        />
        <Popup
          trigger={
            <span
              className={styles.tooltip}
              style={{ height: '12px', width: '12px' }}
            ></span>
          }
          position="top left"
          hideOnScroll={true}
          className={cn('p2e_enabled_tooltip', styles.popup)}
        >
          <Popup.Content className={styles.tooltipContent}>
            <img
              className={styles.popup_info}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg"
            />
            <p className={styles.popup_content}>
              This wearable has been
              <br /> checked in today. If you would
              <br /> like to undelegate your
              <br /> wearable, the withdrawal will be
              <br /> scheduled for after 12AM UTC.
            </p>
          </Popup.Content>
        </Popup>
      </div>
    </div>
  );
};

export default IceDelegatedCheckedInTooltip;
