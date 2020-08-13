import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';

function Location() {
  // dispatch user's location boolean to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let bool = true;

  useEffect(() => {
    // get the user's IP address and exclude forbidden regions
    // bool = false;

    dispatch({
      type: 'ip_address',
      data: bool,
    });
  }, []);

  return null;
}

export default Location;
