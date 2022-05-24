import React, { useEffect, useState } from 'react';
import { isEmptyArray } from '../../helpers/CheckEmpty';

import { MasterDataService } from '../../Services/MasterDataService';

import { Link as LinkRouter } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module

import style from './pagination.scss';

import SwiperCore, { Pagination, Navigation } from 'swiper';

SwiperCore.use([Pagination, Navigation]);

const Banner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await MasterDataService.api(
        'POST',
        null,
        'promobanners/load'
      );
      if (result) {
        setBanners(result.data);
      }
    };

    loadData();
  }, []);

  if (isEmptyArray(banners)) return null;

  const renderBannerItem = (item) => {
    if (item?.promotionId) {
      const promotionId = item.promotionId.split(':')[2];
      return (
        <Link
          component={LinkRouter}
          to={`/promotions-detail/${promotionId}`}
          rel='noopener noreferrer'
        >
          <img
            src={item.defaultImageURL}
            alt={item.name}
            width='100%'
            height={300}
          />
        </Link>
      );
    } else {
      return (
        <img
          src={item.defaultImageURL}
          alt={item.name}
          width='100%'
          height={300}
        />
      );
    }
  };

  // const style = {

  // }

  return (
    <div className={style.sliderWrapper}>
      <Swiper
        style={{
          '--swiper-navigation-color': '#DCDCDC',
          '--swiper-pagination-color': '#DCDCDC',
          '--swiper-pagination-bullet-size': '6px',
          '--swiper-pagination-bullet-width': '6px',
          '--swiper-pagination-bullet-height': '6px',
          '--swiper-pagination-bullet-vertical-gap': '2em',
          '--swiper-pagination-bullet-active-width': '20px',
          marginTop: '9em',
          display: 'flex',
          alignItems: 'center',
          height: 'auto',
          marginBottom: '1em',
        }}
        slidesPerView={1}
        spaceBetween={30}
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
        }}
        autoHeight
      >
        {banners.map((item, index) => {
          return (
            <SwiperSlide key={index}>{renderBannerItem(item)}</SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banner;
