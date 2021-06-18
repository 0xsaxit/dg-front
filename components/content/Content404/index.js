import { Button } from 'semantic-ui-react';
import styles from './Content404.module.scss';

const content404 = () => {
  return (
    <div className={styles.not-found}>
      <p className={styles.not-found-header-text}> 404 </p>
      <p className={styles.not-found-middle-text}> Page not found </p>
      <p> The requested page could not be found. </p>

      <Button className="not-found-button" href="/">
        BACK TO HOME
      </Button>
    </div>
  );
};

export default content404;
