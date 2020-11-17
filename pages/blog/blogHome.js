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
      const { data } = await ButterCMS.post.list({ page_size: 30 });
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
            FEATURED POST
          </p>
        </span>
      </span>

      <Divider
        id="blog-divider"
        style={{ paddingBottom: '15px', marginTop: '-1px' }}
      />

      <div className="featured-blog-container">
        <Link href="/blog/[id]" as="/blog/decentralgames-secures-investment">
          <a>
            <span className="featured-blog-grid">
              <Image src={Images.FEATURED_IMAGE} className="featured-image" />

              <div className="post-info featured">
                <div className="top">
                  <span className="blog-date">9 SEPT 2020</span>
                  <span className="blog-category">Announcements</span>
                </div>
                <div className="bottom">
                  <div className="blog-title">
                    <h4
                      style={{
                        paddingBottom: '9px',
                        paddingTop: '8px'
                      }}
                    >
                      Decentral Games Secures Investment to Accelerate
                      Development of Virtual World-Class Casinos
                    </h4>
                    <p
                      style={{
                        lineHeight: '1.3'
                      }}
                    >
                      We are pleased to announce we’ve closed our pre-seed
                      round, raising over $400,000 in investments and grants
                      with participation from Metaverse Ventures
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
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '30px',
                }}
              >
                <span style={{ borderBottom: '1px solid #2085f4' }}>
                  <p className="featured-text" style={{ marginBottom: '15px' }}>
                    {category}
                  </p>
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

              <Divider
                id="blog-divider"
                style={{ paddingBottom: '15px', marginTop: '-1px' }}
              />

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
