import { Button } from 'semantic-ui-react';

const content404 = () => {
  return (
    <span className="not-found-container">
      <p className="not-found-header-text"> 404 </p>
      <p className="not-found-middle-text"> Page not found </p>
      <p> The requested page could not be found. </p>

      <Button className="not-found-button" href="/">
        Back to Home
      </Button>
    </span>
  );
};

export default content404;
