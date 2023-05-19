import React, { useEffect, useState } from 'react';
import { isEmptyArray } from '../../helpers/CheckEmpty';

import { MasterDataService } from '../../Services/MasterDataService';
import { useSelector } from 'react-redux';
import { Link as LinkRouter } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

import 'swiper/swiper.scss';
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module

import style from './pagination.scss';
import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';

SwiperCore.use([Pagination, Navigation]);
const Banner = (props) => {
  const { logo } = useSelector((state) => state.getSpaceLogo);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await MasterDataService.api(
        'POST',
        null,
        'promobanners/load'
      );
      if (result) {
        const temp = result?.data?.filter(
          (val) => val.outlet === 'ALL' || val.outlet?.includes(props.outletId)
        );
        setBanners(temp);
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
            srcSet={`${item.defaultImageURL} 300w, ${item.defaultImageURL} 768w, ${item.defaultImageURL} 1280w`}
            sizes='(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px'
            width='100%'
            height={300}
            style={{
              borderRadius: 10,
            }}
          />
        </Link>
      );
    } else if (item?.url) {
      return (
        <a href={item.url} target='_blank' rel='noopener noreferrer'>
          <img src={item.defaultImageURL} alt={item.name} width='100%' />
        </a>
      );
    } else {
      return (
        <img
          src={item.defaultImageURL}
          alt={item.name}
          srcSet={`${item.defaultImageURL} 300w, ${item.defaultImageURL} 768w, ${item.defaultImageURL} 1280w`}
          sizes='(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px'
          width='100%'
          height={300}
          style={{
            borderRadius: 10,
          }}
        />
      );
    }
  };

  return (
    <div className={style.sliderWrapper}>
      <Swiper
        modules={[Autoplay]}
        style={{
          '--swiper-navigation-color': '#DCDCDC',
          '--swiper-pagination-color': '#DCDCDC',
          '--swiper-pagination-bullet-size': '6px',
          '--swiper-pagination-bullet-width': '6px',
          '--swiper-pagination-bullet-height': '6px',
          '--swiper-pagination-bullet-vertical-gap': '2em',
          '--swiper-pagination-bullet-active-width': '20px',
          marginTop: !logo ? '4em' : '6em',
          display: 'flex',
          alignItems: 'center',
          height: 'auto',
          marginBottom: '1em',
        }}
        slidesPerView={1}
        spaceBetween={30}
        loop
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
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
