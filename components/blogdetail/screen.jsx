import React, { useState, useEffect } from 'react';
import PostPreview from '../blog/PostPreview';
import { Divider, Icon, Button } from 'semantic-ui-react';
import { Menu, Navbar } from 'semantic-ui-react';
import HtmlParser from './HtmlParser';
import Link from 'next/link';
import Global from '../Constants';

const Screen = ({
  slug,
  featured_image,
  image,
  created,
  categories,
  title,
  summary,
  author: { first_name = '', last_name = '', profile_image = '' },
  body,
  filteredPages,
  unfilteredPages,
}) => {

  const [randomfilteredPages, setFilteredPages] = useState();

  useEffect(() => {
    // Random Function
    var currentIndex = filteredPages.length;
    var otherIndex = unfilteredPages.length;
    var temporaryValue = 0;
    var randomIndex = 0;

    function shuffle(array) {
      var count = 0;
      var addcount = 0;
      var array1 = unfilteredPages;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        count += 1;

        if (count >= 2) {
          count = filteredPages.length - 2;
          array.splice(0, count);
          // console.log(array);
          return array;
        }
      }

      currentIndex = filteredPages.length;
      if (currentIndex < 2) {
        addcount = 2 - currentIndex;
      }

      while (0 !== addcount) {
        randomIndex = Math.floor(Math.random() * otherIndex);
        otherIndex -= 1;
        addcount -= 1;
        temporaryValue = array1[otherIndex];
        array[currentIndex + addcount] = temporaryValue;
        array1[otherIndex] = array1[otherIndex];
        array1[otherIndex] = temporaryValue;
      }
      return array;
    }

    setFilteredPages(shuffle(filteredPages));
  }, []);

  window.scrollTo(0, 0);

  return (
    <div>
      <div className="coverimg">
        <div className="image main-image" style={{ marginTop: '-60px' }}>
          <img className="blog-hero-img" src={image || Global.IMAGES.SOCIAL_SHARE} alt="" />
        </div>
      </div>

      <div className="blogdetail-page-container">
        <div className="blogdetails">
          <div className="bloginfo">
            <div className="title">
              <h1>{title}</h1>
            </div>

            <Divider style={{ color: 'rgb(241, 241, 241)', marginTop: '30px' }} />

            <div className="info">
              <div className="post-author" style={{ marginBottom: '90px' }}>
                <span style={{ display: 'flex' }}>
                  <div className="image">
                    <img
                      className="logo-image"
                      src={profile_image || Global.IMAGES.ICON_MANA}
                      alt=""
                    />
                  </div>
                  <div className="name">
                    <span> {`${first_name || ''} ${last_name || ''}`} </span>
                  </div>
                </span>
                <div className="post-date-blogdetail">
                  <span>
                    {new Date(created).toLocaleDateString(
                      'en-DE',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white' }}>
          <div>
            <div className="post__content" style={{ marginTop: '-60px' }}>
              {HtmlParser(body)}
            </div>

            <div className="read-next-div">
              {randomfilteredPages &&
                randomfilteredPages.map((page) => (
                  <Button className="read-next-button" href={page.slug}>
                    {page.title}
                  </Button>
                ))}
            </div>

            <Divider
              style={{ color: 'rgb(241, 241, 241)', marginTop: '60px' }}
            />
            <div
              style={{ marginBottom: '150px' }}
            >
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p className="date2"> TWEET </p>
                <Icon className="date3" name="twitter" />
                <p className="date2"> SHARE </p>
                <Icon className="date3" name="facebook" />
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Screen;
