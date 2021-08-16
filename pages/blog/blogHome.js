import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import { Image, Button } from 'semantic-ui-react';
import _ from 'lodash';
import Link from 'next/link';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import ButterCMS from 'common/ButterCMS';
import cn from 'classnames';

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
        <img className={styles.substack_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1625093017/loudspeaker_x7ktgd.png" />
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
            <svg style={{ marginLeft: '12px' }} width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z" fill="white"/>
            </svg>
          </span>
        </Button>
        <p className={styles.substack_text}> Or read on{' '}
          <a href="https://decentralgames.substack.com/" target="_blank" className={styles.substack_link}>
            Substack
          </a>
        </p>
      </div>

      <div className={styles.account_other_tabs} style={{ marginTop: '-50px' }}>
        <div className="ml-0">
          <span className={styles.account_featured_post}>
            Featured Post
          </span>
        </div>
      </div>

      <div className={styles.featured_blog_container}>
        <Link href="/blog/[id]" as="blog/decentral-games-raises-5m">
          <a>
            <span className={styles.featured_blog_grid}>
              <Image src={Images.FEATURED_IMAGE} className={styles.featured_image} />

              <div className={styles.post_info_featured}>
                <div className={styles.top}>
                  <span className={styles.blog_category}>Announcements </span>
                  <span style={{ paddingRight: '10px', marginLeft: '-12px', color: 'hsla(0, 0%, 100%, .75)' }}>  • </span>
                  <span className={styles.blog_date}>18 JUN 2021</span>
                </div>
                <div className={styles.bottom}>
                  <h4 
                    style={{
                      fontSize: '24px',
                      fontfamily: 'LarsseitBold',
                      marginTop: '4px',
                    }}
                  >
                    Decentral Games Raises $5M To Cement Itself As The Leading Metaverse-native, Profitable DAO
                  </h4>
                  <p
                    style={{
                      fontFamily: 'Larsseit-Regular',
                      fontSize: '18px',
                      paddingTop: '8px',
                    }}
                  >
                    Decentral Games welcomes partners Collab+Currency, Metaverse Ventures (Digital Currency Group), Genesis Block Ventures, Bitscale Capital, Cluster Capital, ID Theory, and AU21 Capital, among others
                  </p>
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
              <div className={cn("mt-0", styles.account_other_tabs)}>
                <div className="ml-0">
                  <span className={cn("d-flex", styles.account_other_p)}>
                    <span className="d-flex justify-content-between w-100">
                      <span 
                        style={{ 
                          fontSize: '24px',
                          fontFamily: 'Larsseit-ExtraBold',
                          margin: '48px 0px 0px 0px',
                          color: 'white'
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
                              <svg
                                style={{ marginLeft: '4px' }}
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.56543 4.82715C5.56104 4.59424 5.48193 4.40967 5.29297 4.2251L1.98389 0.990723C1.84326 0.854492 1.68066 0.78418 1.47852 0.78418C1.07422 0.78418 0.740234 1.11377 0.740234 1.51367C0.740234 1.71582 0.82373 1.90039 0.977539 2.0542L3.84277 4.82275L0.977539 7.6001C0.82373 7.74951 0.740234 7.93408 0.740234 8.14062C0.740234 8.54053 1.07422 8.87012 1.47852 8.87012C1.67627 8.87012 1.84326 8.8042 1.98389 8.66357L5.29297 5.4292C5.48193 5.24463 5.56543 5.05566 5.56543 4.82715Z"
                                  fill="white"
                                />
                              </svg>
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
                                <span style={{ paddingRight: '10px', marginLeft: '-12px', color: 'hsla(0, 0%, 100%, .75)' }}>  • </span>
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
                                <span style={{ paddingRight: '10px', marginLeft: '-12px', color: 'hsla(0, 0%, 100%, .75)', marginTop: '-1px' }}>  • </span>
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
                                      marginTop: '0px'
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
                    <span style={{ paddingRight: '10px', marginLeft: '-12px', color: 'hsla(0, 0%, 100%, .75)', marginTop: '-1px' }}>  • </span>
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
}
export default blog;
