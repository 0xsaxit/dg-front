import Images from '../common/Images';
import styles from './spinner.module.scss'

const Spinner = props => {
  if (props.background === 0) {
    return <img src={Images.LOADING_SPINNER} className={styles.spinner} />;
  } else if (props.background === 1) {
    return (
      <div className={styles.snow}>
        <img src={Images.LOADING_SPINNER} className={styles.spinner} />
      </div>
    );
  } else if (props.background === 2) {
    return (
      <div className={styles.black}>
        <img src={Images.LOADING_SPINNER} className={styles.spinner} />
      </div>
    );
  } else if (props.background === 3) {
    return (
      <div className={styles.full_white}>
        <img src={Images.LOADING_SPINNER} className={styles.spinner} />
      </div>
    );
  } else {
    return null;
  }
};

export default Spinner;
