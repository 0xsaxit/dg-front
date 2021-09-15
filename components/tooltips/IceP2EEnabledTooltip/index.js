import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import styles from './IceP2EEnabledTooltip.module.scss';

const IceP2EEnabledTooltip = () => {
  return (
    <div className={styles.fullDiv}>
      <div className={styles.imgDiv}>
        <img className={styles.img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640051/p2e_enabled_wgqui5.svg" />
        <Popup
          trigger={
            <img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />
          }
          position='top left'
          hideOnScroll={true}
          className={cn("p2e_enabled_tooltip", styles.popup)}
        >
          <Popup.Content className={styles.tooltipContent}>
            <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />
            <p className={styles.popup_content}>P2E Enabled (aka Play-to-Earn)<br/> wearables allow you to earn real<br/> cash value from free-to-play ICE<br/> poker tables.</p>
          </Popup.Content>
        </Popup>
      </div>
    </div>
  );
};

export default IceP2EEnabledTooltip;