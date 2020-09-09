import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Menu, Image, Divider, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Link from 'next/link';
import $ from 'jquery';
import Global from '../../components/Constants';

function blog() {
  const [state, dispatch] = useContext(GlobalContext);
  const [filteredPages, changeCategory] = useState(state.pages.data);

  // const [category, setCategory] = useState("All");
  useEffect(() => {
    const getPages = async () => {
      const { data } = await Global.BUTTER.post.list({ page_size: 25 });
      dispatch({
        type: 'update_pages',
        data,
      });
      changeCategory(data.data);
    };
    getPages();
  }, []);

  function selectCategory(category) {
    if (category != 'All') {
      changeCategory(
        state.pages.data.filter((page) =>
          page.categories.length > 0
            ? page.categories[0].name === category
            : false
        )
      );
    } else {
      changeCategory(state.pages.data);
    }

    const categories = ['All', 'Announcements', 'Tutorials', 'Technology'];

    for (var i = 0; i <= 3; i++) {
      if (categories[i] == category) {
        $('#mobile-' + categories[i]).addClass('active');
        $('#' + categories[i]).addClass('active');
      } else {
        $('#mobile-' + categories[i]).removeClass('active');
        $('#' + categories[i]).removeClass('active');
      }
    }
  }

  function subMenu() {
    if ($('.mobile-menu-items').hasClass('menu-hide')) {
      $('.mobile-menu-items').removeClass('menu-hide');
      $('.mobile-menu-items').addClass('menu-show');
    } else {
      $('.mobile-menu-items').removeClass('menu-show');
      $('.mobile-menu-items').addClass('menu-hide');
    }
  }

  return (
    <div className="blog-home-container">
      <div>
        <p className="page-header-text dark">Blog</p>
      </div>
      <div className="featured-blog-container">
        <p className="featured-text"> FEATURED POST</p>
        <Divider id="blog-divider" style={{ paddingBottom: '15px' }} />
        <Link href="/blog/[id]" as="/blog/blackjack-is-live-in-time-for-decentral-games-casino-night">
          <a>
            <Grid
              style={{ paddingBottom: '120px' }}
              className="featured-blog-grid"
            >
              <Grid.Row>
                <Grid.Column computer={11} tablet={16} mobile={16}>
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1599679135/Screen_Shot_2020-09-01_at_3.02.47_AM_dwtwxr.png"
                    className="featured-image"
                  />
                </Grid.Column>
                <Grid.Column computer={5} tablet={16} mobile={16}>
                  <div className="post-info">
                    <div className="top">
                      <div>
                        <span className="blog-date">1 SEPT 2020</span>
                        <span className="blog-category">
                          Announcements
                        </span>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="blog-title">
                        <h4
                          style={{
                            paddingBottom: '9px',
                            paddingTop: '8px',
                            color: 'black',
                          }}
                        >
                          Blackjack is live in time for Decentral Games Casino Night!
                        </h4>
                        <p
                          style={{
                            color: 'rgb(97, 97, 97)',
                            lineHeight: '1.3'
                          }}
                        >
                          Blackjack is now live in Tominoya! Gameplay is in free PLAY tokens and each table supports up to 4 players. New players start with 5,000 PLAY and we'll have periodic top ups before competitions with prizes.
                        </p>
                      </div>
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </a>
        </Link>
      </div>

      <div className="dcl navbar menu-site" role="navigation">
        <div className="ui div">
          <div className="dcl navbar-menu">
            <div className="ui secondary stackable menu">
              <a
                aria-current="page"
                className="category-select active"
                id="All"
                onClick={() => selectCategory('All')}
              >
                ALL ARTICLES
              </a>
              <a
                className="category-select"
                id="Announcements"
                onClick={() => selectCategory('Announcements')}
              >
                ANNOUNCEMENTS
              </a>
              <a
                className="category-select"
                id="Tutorials"
                onClick={() => selectCategory('Tutorials')}
              >
                TUTORIALS
              </a>
              <a
                className="category-select"
                id="Technology"
                onClick={() => selectCategory('Technology')}
              >
                TECHNOLOGY
              </a>
            </div>
          </div>
        </div>

        <div className="dcl navbar menu-mobile" role="navigation">
          <div className="mobile-menu">
            <div className="ui div">
              <div className="dcl navbar-menu">
                <div className="dcl navbar-mobile-menu">
                  <div
                    className="ui small header dcl active-page caret-down"
                    style={{ color: 'black' }}
                    onClick={() => subMenu()}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mobile-menu-items menu-hide">
              <a
                aria-current="page"
                className="item active"
                onClick={() => selectCategory('All')}
                id="mobile-All"
              >
                All Articles
              </a>
              <a
                className="item"
                id="mobile-Announcements"
                onClick={() => selectCategory('Announcements')}
              >
                Announcements
              </a>
              <a
                className="item"
                id="mobile-Tutorials"
                onClick={() => selectCategory('Tutorials')}
              >
                Tutorials
              </a>
              <a
                className="item"
                id="mobile-Technology"
                onClick={() => selectCategory('Technology')}
              >
                Technology
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="posts">
        {filteredPages.map((page) => (
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
                  <span className="top" style={{ display: 'flex' }}>
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
