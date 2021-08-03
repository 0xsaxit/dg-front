import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButterCMS from 'common/ButterCMS';

import styles from '../CategoryId.module.scss';

const blogCategory = () => {
  const router = useRouter();
  const [state, dispatch] = useContext(GlobalContext);
  const [filteredPages, changeCategory] = useState(state.pages.data);
  const category = router.query.id;

  useEffect(() => {
    const getPages = async () => {
      const { data } = await ButterCMS.post.list({ page_size: 60 });
      dispatch({
        type: 'update_pages',
        data,
      });
      changeCategory(data.data);
    };
    getPages();
  }, []);

  return (
    <div className={styels.blog_home_container}>
      <div className={styles.account_other_tabs}>
        <div className="ml-0">
          <span className="d-flex">
            <span className="d-flex justify-content-between w-100">
              <span className={styles.account_other_p}>
                {category}
              </span>
            </span>
          </span>
        </div>
      </div>

      <div className={styles.posts}>
        {filteredPages.map(page =>
          page.categories[0].name.toLowerCase() === category ? (
            <Link
              href="/blog/[id]"
              key={page.created}
              as={`/blog/${page.slug}`}
            >
              <a className={styles.post}>
                <div className={styles.post_image}>
                  <img src={page.featured_image || page.banner} alt="" />
                </div>
                <div className={styles.post_info}>
                  <span className="d-flex">
                    <div className={styles.post_category}>
                      <span>
                        {page.categories &&
                          page.categories[0] &&
                          page.categories[0].name}
                      </span>
                    </div>
                    <span className={styles.post_dot}>  • </span>
                    <div className={styles.post_date}>
                      <span>
                        {new Date(page.created).toLocaleDateString(
                          'en-DE',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </span>
                  <div className="bottom">
                    <div>
                        <h4
                          style={{
                            fontSize: '24px',
                            fontfamily: 'LarsseitBold',
                          }}
                        >
                          {page.title}
                        </h4>
                        <p
                          style={{
                            fontFamily: 'Larsseit-Regular',
                            fontSize: '18px',
                            paddingTop: '8px',
                          }}
                        >
                        {page.summary.split('.', 1)[0]}
                      </p>
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
