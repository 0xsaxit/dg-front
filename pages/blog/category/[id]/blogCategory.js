import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../../store';
import { Divider } from 'semantic-ui-react';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import $ from 'jquery';
import Global from '../../../../components/Constants';

function blogCategory() {
  const router = useRouter();
  const [state, dispatch] = useContext(GlobalContext);
  const [filteredPages, changeCategory] = useState(state.pages.data);
  const category = router.query.id;

  useEffect(() => {
    const getPages = async () => {
      const { data } = await Global.BUTTER.post.list({ page_size: 30 });
      dispatch({
        type: 'update_pages',
        data,
      });
      changeCategory(data.data);
    };
    getPages();
  }, []);

  return (
    <div className="blog-home-container">
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '0px',
        }}
      >
        <span style={{ borderBottom: '1px solid #2085f4' }}>
          <p className="featured-text" style={{ marginBottom: '15px' }}>
            {category}
          </p>
        </span>
      </span>

      <Divider
        id="blog-divider"
        style={{ paddingBottom: '15px', marginTop: '-1px' }}
      />

      <div className="posts">
        {filteredPages.map((page) =>
          page.categories[0].name.toLowerCase() == category ? (
            <Link
              href="/blog/[id]"
              key={page.created}
              as={`/blog/${page.slug}`}
            >
              <a className="post">
                <div className="post-div">
                  <div className="post-image">
                    <img src={page.featured_image || page.banner} alt="" />
                  </div>
                  <div className="post-info">
                    <span className="bottom-info" style={{ display: 'flex' }}>
                      <div className="post-date">
                        <span>
                          {new Date(page.created).toLocaleDateString('en-DE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div
                        className="post-category"
                        style={{ color: 'rgb(97, 97, 97)' }}
                      >
                        <span>
                          {page.categories &&
                            page.categories[0] &&
                            page.categories[0].name}
                        </span>
                      </div>
                    </span>
                    <div className="bottom">
                      <div className="blog-title">
                        <h4 style={{ paddingBottom: '9px' }}>{page.title}</h4>
                        <p
                          style={{
                            color: 'rgb(97, 97, 97)',
                            fontSize: '18px',
                          }}
                        >
                          {page.summary.split('.', 1)[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
}
export default blogCategory;
