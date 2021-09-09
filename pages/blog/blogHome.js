import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import { Image, Button } from 'semantic-ui-react';
import _ from 'lodash';
import Link from 'next/link';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import ButterCMS from 'common/ButterCMS';
import cn from 'classnames';
import Metamask from 'assets/svg/metamask.svg';
import GreaterThan from 'assets/svg/greaterthan.svg';

import styles from './blog.module.scss';

const blog = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [filteredPages, changeCategory] = useState(state.pages.data);
  const categories = [
    'Announcements',
    'Tutorials',
    'Technology',
    'All Articles',
  ];

  let categoryURL = '';
  let count = 0;

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
    <div className={styles.blog_home_container}>
      <div className={styles.substack_container}>
        <img
          className={styles.substack_img}
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1625093017/loudspeaker_x7ktgd.png"
        />
        <h1 className={styles.substack_header}>
          Stay in the loop with our weekly newsletter
        </h1>
        <Button
          className={styles.substack_button}
          href="https://decentralgames.substack.com/embed"
          target="_blank"
        >
          <span className="d-flex align-items-center justify-content-center">
            Sign Up For Substack
            <Metamask />
          </span>
        </Button>
        <p className={styles.substack_text}>
          {' '}
          Or read on{' '}
          <a
            href="https://decentralgames.substack.com/"
            target="_blank"
            className={styles.substack_link}
          >
            Substack
          </a>
        </p>
      </div>

      <div className={styles.account_other_tabs} style={{ marginTop: '-50px' }}>
        <div className="ml-0 mb-4">
          <span className={styles.account_featured_post}>Featured Post</span>
        </div>
      </div>

      <div className="featured-blog-container">
        <Link
          href="/blog/[id]"
          as="blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout"
        >
          <a>
            <span className={styles.featured_blog_grid}>
              <Image
                src={Images.FEATURED_IMAGE}
                className={styles.featured_image}
              />

              <div className={styles.post_info_featured}>
                <div className={styles.top}>
                  <span className={styles.blog_category}>Announcements </span>
                  <span
                    style={{
                      paddingRight: '10px',
                      marginLeft: '-12px',
                      color: 'hsla(0, 0%, 100%, .75)',
                    }}
                  >
                    {' '}
                    •{' '}
                  </span>
                  <span className="blog-date">1 SEP 2021</span>
                </div>
                <div className="bottom">
                  <div className="blog-title">
                    <h4
                      style={{
                        fontSize: '24px',
                        fontfamily: 'LarsseitBold',
                        marginTop: '4px',
                      }}
                    >
                      Decentral Games Announces Play-to-Earn Metaverse Poker,
                      ICE Token Rollout
                    </h4>
                    <p
                      style={{
                        fontFamily: 'Larsseit-Regular',
                        fontSize: '18px',
                        paddingTop: '8px',
                      }}
                    >
                      Decentral Games is excited to announce the development of
                      free-play, play-to-earn Metaverse poker! Play-to-earn
                      architectures will play a massive role in driving the
                      future of crypto and gaming adoption, and Decentral Games
                      is now a first-mover in this nascent, but promising, space
                    </p>
                  </div>
                </div>
              </div>
            </span>
          </a>
        </Link>
      </div>

      {categories.map(
        (category, index) => (
          (categoryURL = category.toLowerCase()),
          (
            <Aux>
              <div className={cn('mt-0', styles.account_other_tabs)}>
                <div className="ml-0">
                  <span className={cn('d-flex', styles.account_other_p)}>
                    <span className="mb-4 d-flex justify-content-between w-100">
                      <span
                        style={{
                          fontSize: '24px',
                          fontFamily: 'Larsseit-ExtraBold',
                          margin: '48px 0px 0px 0px',
                          color: 'white',
                        }}
                      >
                        {category}
                      </span>
                      {category !== 'All Articles' ? (
                        <Link
                          href="/blog/category/[id]"
                          key={index}
                          as={`/blog/category/${categoryURL}`}
                        >
                          <Button className={styles.all_button}>
                            <span>
                              See All
                              <GreaterThan />
                            </span>
                          </Button>
                        </Link>
                      ) : null}
                    </span>
                  </span>
                </div>
              </div>

              <div className={styles.posts}>
                {
                  ((count = 0),
                  filteredPages.map(page =>
                    category === 'ALL' ? (
                      <Link
                        href="/blog/[id]"
                        key={page.created}
                        as={`/blog/${page.slug}`}
                      >
                        <a className={styles.post}>
                          <div className={styles.post_image}>
                            <img
                              src={page.featured_image || page.banner}
                              alt=""
                            />
                          </div>
                          <div className={styles.post_info}>
                            <span className="d-flex">
                              <div className={styles.post_category}>
                                {page.categories &&
                                  page.categories[0] &&
                                  page.categories[0].name}
                              </div>
                              <span
                                style={{
                                  paddingRight: '10px',
                                  marginLeft: '-12px',
                                  color: 'hsla(0, 0%, 100%, .75)',
                                }}
                              >
                                {' '}
                                •{' '}
                              </span>
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
                            <div className={styles.bottom}>
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
                        </a>
                      </Link>
                    ) : count <= 5 && page.categories[0].name === category ? (
                      ((count += 1),
                      (
                        <Link
                          href="/blog/[id]"
                          key={page.created}
                          as={`/blog/${page.slug}`}
                        >
                          <a className={styles.post}>
                            <div>
                              <div className={styles.post_image}>
                                <img
                                  src={page.featured_image || page.banner}
                                  alt=""
                                />
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
                                  <span
                                    style={{
                                      paddingRight: '10px',
                                      marginLeft: '-12px',
                                      color: 'hsla(0, 0%, 100%, .75)',
                                      marginTop: '-1px',
                                    }}
                                  >
                                    {' '}
                                    •{' '}
                                  </span>
                                  <div className={styles.post_date}>
                                    <span>
                                      {new Date(
                                        page.created
                                      ).toLocaleDateString('en-DE', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                </span>
                                <div className={styles.bottom}>
                                  <h4
                                    style={{
                                      fontSize: '24px',
                                      fontfamily: 'LarsseitBold',
                                      marginTop: '0px',
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
                      ))
                    ) : null
                  ))
                }
              </div>
            </Aux>
          )
        )
      )}

      <div className={styles.posts}>
        {filteredPages.map(page => (
          <Link href="/blog/[id]" key={page.created} as={`/blog/${page.slug}`}>
            <a className={styles.post}>
              <div className={styles.post_image}>
                <img src={page.featured_image || page.banner} alt="" />
              </div>
              <div className={styles.post_info}>
                <span className="d-flex">
                  <div className={styles.post_category}>
                    {page.categories &&
                      page.categories[0] &&
                      page.categories[0].name}
                  </div>
                  <span
                    style={{
                      paddingRight: '10px',
                      marginLeft: '-12px',
                      color: 'hsla(0, 0%, 100%, .75)',
                      marginTop: '-1px',
                    }}
                  >
                    {' '}
                    •{' '}
                  </span>
                  <div className={styles.post_date}>
                    <span>
                      {new Date(page.created).toLocaleDateString('en-DE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </span>
                <div className={styles.bottom}>
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
                      paddingTop: '4px',
                    }}
                  >
                    {page.summary.split('.', 1)[0]}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default blog;
