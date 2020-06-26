import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { butter } from '../../store/api';
import { Container, Menu, Segment, Image, Divider, Grid, Icon, Breadcrumb, Search, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import Fade from 'react-reveal/Fade';
import Link from 'next/link';
import $ from 'jquery';

// import { NextSeo } from 'next-seo';
// import Head from 'next/head';
// import Header from '../../components/Header';
// import Global from '../../components/Constants';

function blog() {
  const [state, dispatch] = useContext(GlobalContext);
  const [filteredPages, changeCategory] = useState(state.pages.data);

  // const [category, setCategory] = useState("All");
  useEffect(() => {
    const getPages = async () => {
      const { data } = await butter.post.list({ page_size: 25 });
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
    <Segment vertical style={{ top: '120px' }}>
      {/* <html lang="en">
          <Head>
            <title> Decentral Games </title>
          </Head>
        </html>
        
          <NextSeo
              openGraph={{
                  type: 'website',
                  url: 'https://decentral.games',
                  title: 'Decentral Games Blog',
                  description: '3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!',
                  images: [
                          {
                              url: 'https://cdn.buttercms.com/YzOXgTtkQOiqzTcyAWMg',
                              width: 800,
                              height: 600,
                              alt: 'Decentral Games',
                          },
                ],
              }}
          /> */}

      {/* <Header
        title={Global.TITLE + ' | Blog'}
        description={Global.DESCRIPTION}
        image={Global.SOCIAL_SHARE_IMAGE}
      /> */}

      <div className="blog-page">
        <div className="mobile-menu-dark">
          <a href="/">
            <img
              className="mobile-menu-image"
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
            />
          </a>
        </div>
        <div className="mobile-menu-words dark">
          <a className="mobile-menu-item-1" href="/">
            {' '}
            HOME{' '}
          </a>
          <a
            className="mobile-menu-item-2"
            href="https://docs.decentral.games"
            target="_blank"
          >
            {' '}
            DOCS{' '}
          </a>
          <Modal
            trigger={<a className="mobile-menu-item-2"> DEMO </a>}
            closeIcon
            basic
            size="small"
          >
            <Modal.Content>
              <iframe
                className="mobile-demo-video"
                src="https://www.youtube.com/embed/qklQZBooM-8?&autoplay=1"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </Modal.Content>
          </Modal>
        </div>
        <Container className="featured-blog-container">
          <Container>
            <div className="blog-hero-text">
              <Fade bottom distance="20px">
                <h3 className="main-blog-h3"> Decentral Games</h3>
              </Fade>
              <Fade bottom distance="10px" duration={600} delay={200}>
                <h5
                  className="blog-hero"
                  style={{ color: 'grey', paddingTop: '6px' }}
                >
                  {' '}
                  Check back here regularly for updates on our technology,
                  tutorials, and Decentral Games news.{' '}
                </h5>
              </Fade>
            </div>

            <div className="mobile-featured-container">
              <Fade bottom distance="20px" duration={600} delay={400}>
                <p style={{ color: 'rgb(97, 97, 97)' }}> Featured Post</p>
                <Divider style={{ opacity: '0.5', paddingBottom: '15px' }} />
                <Link href="/blog/[id]" as="/blog/tominoya-casino-nft-sale">
                  <a>
                    <Grid
                      style={{ paddingBottom: '120px' }}
                      className="featured-post-padding"
                    >
                      <Grid.Row>
                        <Grid.Column computer={11} tablet={16} mobile={16}>
                          <Image
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058170/tominoya_w11amn_qqrzy3_zibqbw.jpg"
                            className="featured-image"
                          />
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={16} mobile={16}>
                          <div className="post-info">
                            <div className="top">
                              <div>
                                <span className="preview-date">
                                  19 APR 2020
                                </span>
                                <span className="preview-category">
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
                                  Tominoya Casino NFT Sale
                                </h4>
                                <p
                                  style={{
                                    color: 'rgb(97, 97, 97)',
                                    fontSize: '18px',
                                  }}
                                >
                                  Tominoya is a 3D virtual casino built by
                                  Decentral Games on 52 LAND parcels within
                                  Decentraland's Vegas City district.
                                </p>
                              </div>
                            </div>
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </a>
                </Link>
              </Fade>
            </div>
          </Container>

          <div style={{ zIndex: 2 }}>
            <div className="dcl navbar menu-site" role="navigation">
              <div className="ui container">
                <div className="dcl navbar-menu">
                  <div className="ui secondary stackable menu">
                    <a
                      className="dcl navbar-logo"
                      href="https://decentraland.org"
                    >
                      <i className="dcl logo"></i>
                    </a>
                    <a
                      aria-current="page"
                      className="item active"
                      id="All"
                      onClick={() => selectCategory('All')}
                    >
                      All Articles
                    </a>
                    <a
                      className="item"
                      id="Announcements"
                      onClick={() => selectCategory('Announcements')}
                    >
                      Announcements
                    </a>
                    <a
                      className="item"
                      id="Tutorials"
                      onClick={() => selectCategory('Tutorials')}
                    >
                      Tutorials
                    </a>
                    <a
                      className="item"
                      id="Technology"
                      onClick={() => selectCategory('Technology')}
                    >
                      Technology
                    </a>
                  </div>
                </div>
                <div className="dcl navbar-account">
                  <div style={{ marginTop: '15px' }}>
                    <a
                      href="mailto:hello@decentral.games"
                      className="blog-link-a"
                    >
                      <i aria-hidden="true" className="mail icon"></i>
                    </a>
                    <a
                      href="https://twitter.com/decentralgames/"
                      className="blog-link-a"
                    >
                      <i aria-hidden="true" className="twitter icon"></i>
                    </a>
                    <a
                      href="https://decentral.games/discord"
                      className="blog-link-a"
                    >
                      <i aria-hidden="true" className="discord icon"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="dcl navbar menu-mobile" role="navigation">
              <div className="mobile-menu">
                <div className="ui container">
                  <div className="dcl navbar-menu">
                    <div className="dcl navbar-mobile-menu">
                      <a
                        className="dcl navbar-logo"
                        href="https://decentraland.org"
                      >
                        <i className="dcl logo"></i>
                      </a>
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
        </Container>

        <div style={{ marginBottom: '30px' }}>
          <Divider />
        </div>
        <Container
          className="outter-blog-container"
          style={{ paddingBottom: '60px' }}
        >
          <div className="posts">
            {filteredPages.map((page) => (
              <Link
                href="/blog/[id]"
                key={page.created}
                as={`/blog/${page.slug}`}
              >
                <a className="post">
                  <Container className="post-container">
                    <div className="post-image">
                      <img src={page.featured_image || page.banner} alt="" />
                    </div>
                    <div className="post-info">
                      <div className="top">
                        <div className="date">
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
                          className="category"
                          style={{ color: 'rgb(97, 97, 97)' }}
                        >
                          <span>
                            {page.categories &&
                              page.categories[0] &&
                              page.categories[0].name}
                          </span>
                        </div>
                      </div>
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
                  </Container>
                </a>
              </Link>
            ))}
          </div>
        </Container>

        <Divider />
      </div>

      <Container className="outter-blog-container">
        <div className="blog-footer-container">
          <p className="small-footer-p">
            {' '}
            © 2020{' '}
            <a id="a-footer-small" href="/">
              {' '}
              Decentral Games{' '}
            </a>
          </p>
          <p className="small-footer-p">
            {' '}
            Follow{' '}
            <a id="a-footer-small" href="https://twitter.com/decentralgames">
              {' '}
              Twitter{' '}
            </a>{' '}
            & Join{' '}
            <a id="a-footer-small" href="https://decentral.games/discord/">
              {' '}
              Discord{' '}
            </a>{' '}
            |{' '}
            <a id="a-footer-small" href="/disclaimer">
              {' '}
              Disclaimer{' '}
            </a>
          </p>
        </div>
      </Container>
    </Segment>
  );
}
export default blog;
