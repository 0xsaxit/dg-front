import { Popup } from 'semantic-ui-react';
import styles from './IceMintDGStackedTooltip.module.scss';

const IceMintDGStackedTooltip = () => {
  return (
    <Popup
      trigger={
        <img
          className={styles.stackedTooltip}
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg"
        />
      }
      position='top center'
      on="click"
      hideOnScroll={true}
      className={styles.popup}
    >
      <Popup.Content className={styles.tooltipContent}>
        <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />
        <p className={styles.popup_content}>
          You must stake at least one $DG in<br /> governance to mint a new ICE<br /> wearable. You <a href="/">can buy $DG here</a><br /> and <a href="/">you can stake $DG here.</a>
        </p>
      </Popup.Content>
    </Popup>
  );
};

export default IceMintDGStackedTooltip;