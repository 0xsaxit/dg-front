import Link from 'next/link';
import { Popup, Button } from 'semantic-ui-react';
import styles from './LanguageModal.module.scss';

const LanguageModal = () => {
  return (
    <div className={styles.language_container}>
      <Popup
        pinned
        on="click"
        position="bottom right"
        className={styles.mango}
        width="160px"
        trigger={
          <div className={styles.button_wrapper}>
            <Button className={styles.language_button} >
              <span className={styles.content_wrappper}>
                <img 
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/united_states_gs7sdr.png"
                >
                </img>
                <svg
                  style={{ marginRight: '6px', marginBottom: '-9px' }}
                  width="24"
                  height="24"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M6.93555 8.21289C7.29785 8.20605 7.58496 8.08301 7.87207 7.78906L12.9033 2.6416C13.1152 2.42285 13.2246 2.16992 13.2246 1.85547C13.2246 1.22656 12.7119 0.707031 12.0898 0.707031C11.7754 0.707031 11.4883 0.836914 11.249 1.07617L6.94238 5.5332L2.62207 1.07617C2.38965 0.836914 2.10254 0.707031 1.78125 0.707031C1.15918 0.707031 0.646484 1.22656 0.646484 1.85547C0.646484 2.16309 0.749023 2.42285 0.967773 2.6416L5.99902 7.78906C6.28613 8.08301 6.58008 8.21289 6.93555 8.21289Z" fill="white"/>
                </svg>
              </span>
            </Button>
          </div>
        }
      >
        <div className={styles.popup_container}>
            <Link href="#" style={{ display: 'flex'}}>
              <span className={styles.account_dropdown_item}>
                <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/united_states_gs7sdr.png"
                >
                </img>
                <p>
                  {' '}
                  English{' '}
                </p>
              </span>
            </Link>
            <Link href="#" style={{ display: 'flex'}}>
              <span className={styles.account_dropdown_item}>
                <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503836/Ellipse_1_yseyhx.png"
                >
                </img>
                <p>
                  {' '}
                  Spanish{' '}
                </p>
              </span>
            </Link>
            <Link href="#" style={{ display: 'flex'}}>
              <span className={styles.account_dropdown_item}>
                <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/Ellipse_1_1_cw2vcm.png"
                >
                </img>
                <p>
                  {' '}
                  Korean{' '}
                </p>
              </span>
            </Link>
            <Link href="#" style={{ display: 'flex'}}>
              <span className={styles.account_dropdown_item}>
                <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503838/Ellipse_1_3_jysnoe.png"
                >
                </img>
                <p>
                  {' '}
                  Russian{' '}
                </p>
              </span>
            </Link>
            <Link href="#" style={{ display: 'flex'}}>
              <span className={styles.account_dropdown_item}>
                <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/Ellipse_1_2_baqvio.png"
                >
                </img>
                <p>
                  {' '}
                  Chinese{' '}
                </p>
              </span>
            </Link>
          </div>
      </Popup>
    </div>
  );
};

export default LanguageModal;
