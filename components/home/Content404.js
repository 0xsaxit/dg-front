import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button} from 'semantic-ui-react';
import Aux from '../_Aux';
import Spinner from '../Spinner';
import Global from '../Constants';

const content404 = () => {
  return (
    <span className="not-found-container">
      <p className="not-found-header-text"> 404 </p>
      <p className="not-found-middle-text"> Page not found </p>
      <p> The requested page could not be found. </p>
      <Button className="not-found-button" href="/"> BACK TO HOME </Button>
    </span>
  );
};

export default content404;
