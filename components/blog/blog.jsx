import React, { useContext, useEffect } from 'react';
import { Segment } from 'semantic-ui-react';
import Screen from './screen';
import { GlobalContext } from '../../store';
import Global from '../Constants';
// import { Butter } from '../../common/Butter';

const Blog = (Paths) => {
  const [state, dispatch] = useContext(GlobalContext);
  const paths = Paths.Paths[0].split(/[/]/);
  const category =
    paths.length === 3 ? (paths[2] === '' ? 'All' : paths[2]) : '';

  useEffect(() => {
    const getPages = async () => {
      const { data } = await Global.BUTTER.post.list({ page_size: 25 });
      dispatch({
        type: 'update_pages',
        data,
      });
    };
    getPages();
  }, []);

  return (
    <Segment vertical style={{ backgroundColor: 'white' }}>
      <Screen pages={state.pages.data} category={category} />
    </Segment>
  );
};

export default Blog;
