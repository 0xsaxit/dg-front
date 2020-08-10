import React, { useEffect } from 'react';
import { initGA, logPageView } from './Analytics';
import MenuTopBlog from './home/MenuTopBlog';
import Aux from './_Aux';

const LayoutBlog = (props) => {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }, []);

  return (
    <Aux>
      <MenuTopBlog />

      {props.children}
    </Aux>
  );
};

export default LayoutBlog;