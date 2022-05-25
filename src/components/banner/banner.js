import React, { useEffect, useState } from 'react';
import { isEmptyArray } from '../../helpers/CheckEmpty';

import { MasterDataService } from '../../Services/MasterDataService';

import { Link as LinkRouter } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module

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
          <img src={item.defaultImageURL} alt={item.name} width='100%' />
        </Link>
      );
    } else if (item.url) {
      return (
        <a href={item.url} target='_blank' rel='noopener noreferrer'>
          <img src={item.defaultImageURL} alt={item.name} width='100%' />
        </a>
      );
    } else {
      return <img src={item.defaultImageURL} alt={item.name} width='100%' />;
    }
  };

  return (
    <Swiper
      style={{
        '--swiper-navigation-color': '#DCDCDC	',
        '--swiper-pagination-color': '#DCDCDC	',
        '--swiper-pagination-bullet-vertical-gap': '2em',
        marginTop: '5.5em',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
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
      navigation
    >
      {banners.map((item, index) => {
        return <SwiperSlide key={index}>{renderBannerItem(item)}</SwiperSlide>;
      })}
    </Swiper>
  );
};

export default Banner;
