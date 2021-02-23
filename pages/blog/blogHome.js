import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Menu, Image, Divider, Grid, Icon } from 'semantic-ui-react';
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
      const { data } = await ButterCMS.post.list({ page_size: 40 });
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
          <span className="account-other-p" style={{ display: 'flex' }}>
            <span className="account-hover active events">
              <b>FEATURED POST</b>
            </span>
          </span>
        </div>
      </div>

      <Divider className="tab-divider" style={{ marginBottom: '35px' }} />

      <div className="featured-blog-container">
        <Link href="/blog/[id]" as="blog/decentral-games-becomes-the-first-dao-to-own-govern-and-monetize-virtual-land">
          <a>
            <span className="featured-blog-grid">
              <Image src={Images.FEATURED_IMAGE} className="featured-image" />

              <div className="post-info featured">
                <div className="top">
                  <span className="blog-date">20 JAN 2021</span>
                  <span className="blog-category">Announcements</span>
                </div>
                <div className="bottom">
                  <div className="blog-title">
                    <h4
                      style={{
                        paddingBottom: '9px',
                        paddingTop: '9px'
                      }}
                    >
                      Decentral Games Becomes the First DAO to Own, Govern, and Monetize Virtual Land
                    </h4>
                    <p
                      style={{
                        lineHeight: '1.3',
                        paddingTop: '3px'
                      }}
                    >
                      $DG hodlers – We appreciate your continued support, attendance at Casino Night events, and participation in governing the Decentral Games ecosystem.
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
                    <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className="account-hover active events">
                        {category}
                      </span>
                      {category !== 'All Articles' ? (
                        <Link
                          href="/blog/category/[id]"
                          key={index}
                          as={`/blog/category/${categoryURL}`}
                        >
                          <p style={{ fontSize: '14px' }} className="more-text"> More » </p>
                        </Link>
                      ) : null}
                    </span>
                  </span>
                </div>
              </div>

              <Divider className="tab-divider" style={{ marginBottom: '35px' }} />

              <div className="posts">
                {
                  ((count = 0),
                  filteredPages.map((page) =>
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
        {filteredPages.map((page) => (
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
