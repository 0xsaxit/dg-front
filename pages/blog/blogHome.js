import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Menu, Image, Divider, Grid, Icon, Button } from 'semantic-ui-react';
import _ from 'lodash';
import Link from 'next/link';
import Aux from '../../components/_Aux';
import Images from '../../common/Images';
import ButterCMS from '../../common/ButterCMS';

function blog() {
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
      const { data } = await ButterCMS.post.list({ page_size: 50 });
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
      <div className="account-other-tabs" style={{ marginTop: '-50px' }}>
        <div style={{ marginLeft: '0px' }}>
          <span
            style={{
              margin: '100px 0px 0px 0px',
              fontSize: '24px',
              fontFamily: 'Larsseit-ExtraBold',
              margin: '0px 0px 0px 0px',
              color: 'white',
              float: 'left',
            }}
          >
            Featured Post
          </span>
        </div>
      </div>

      <div className="featured-blog-container">
        <Link
          href="/blog/[id]"
          as="blog/decentral-games-partners-with-video-game-pioneer-atari"
        >
          <a>
            <span className="featured-blog-grid">
              <Image src={Images.FEATURED_IMAGE} className="featured-image" />

              <div className="post-info featured">
                <div className="top">
                  <span className="blog-date">7 MAR 2021</span>
                  <span className="blog-category">Announcements</span>
                </div>
                <div className="bottom">
                  <div className="blog-title">
                    <h4
                      style={{
                        paddingBottom: '9px',
                        paddingTop: '9px',
                      }}
                    >
                      Decentral Games Partners With Video Game Pioneer Atari
                    </h4>
                    <p
                      style={{
                        lineHeight: '1.3',
                        paddingTop: '3px',
                      }}
                    >
                      We are thrilled to announce that we have partnered up with
                      Atari to launch Atari Casino powered by Decentral Games
                      this May!
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
              <div className="account-other-tabs" style={{ marginTop: '0px' }}>
                <div style={{ marginLeft: '0px' }}>
                  <span className="account-other-p" style={{ display: 'flex' }}>
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
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
                          <Button className="all-button">
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

              <div className="posts">
                {
                  ((count = 0),
                  filteredPages.map(page =>
                    category === 'ALL' ? (
                      <Link
                        href="/blog/[id]"
                        key={page.created}
                        as={`/blog/${page.slug}`}
                      >
                        <a className="post">
                          <div className="post-div">
                            <div className="post-image">
                              <img
                                src={page.featured_image || page.banner}
                                alt=""
                              />
                            </div>
                            <div className="post-info">
                              <span
                                className="bottom-info"
                                style={{ display: 'flex' }}
                              >
                                <div className="post-date">
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
                                  <h4 style={{ paddingBottom: '9px' }}>
                                    {page.title}
                                  </h4>
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
                    ) : count <= 5 && page.categories[0].name === category ? (
                      ((count += 1),
                      (
                        <Link
                          href="/blog/[id]"
                          key={page.created}
                          as={`/blog/${page.slug}`}
                        >
                          <a className="post">
                            <div className="post-div">
                              <div className="post-image">
                                <img
                                  src={page.featured_image || page.banner}
                                  alt=""
                                />
                              </div>
                              <div className="post-info">
                                <span
                                  className="bottom-info"
                                  style={{ display: 'flex' }}
                                >
                                  <div className="post-date">
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
                                    <h4 style={{ paddingBottom: '9px' }}>
                                      {page.title}
                                    </h4>
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
                      ))
                    ) : null
                  ))
                }
              </div>
            </Aux>
          )
        )
      )}

      <div className="posts">
        {filteredPages.map(page => (
          <Link href="/blog/[id]" key={page.created} as={`/blog/${page.slug}`}>
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
        ))}
      </div>
    </div>
  );
}
export default blog;
