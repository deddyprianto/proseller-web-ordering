import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductService } from '../../Services/ProductService';
import { LoopCircleLoading } from 'react-loadingg';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

import { isEmptyArray } from '../../helpers/CheckEmpty';
import { MasterDataService } from '../../Services/MasterDataService';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Product from '../../components/ProductList/components/Product';

const PromotionDetail = () => {
  const { id } = useParams();
  const [promotionDetail, setPromotionDetail] = useState({});
  const [loading, setLoading] = useState(false);

  const [promotionDetailInfo, setPromotionDetailInfo] = useState({});

  const outletId = useSelector((state) => state.outlet.defaultOutlet.id);

  useEffect(() => {
    try {
      const loadData = async () => {
        setLoading(true);
        if (outletId) {
          const result = await ProductService.api(
            'POST',
            { outletId },
            `promotion/items/${id}`
          );
          const resultBanner = await MasterDataService.api(
            'POST',
            null,
            'promobanners/load'
          );
          if (result && resultBanner) {
            const [tempPromotionDetailInfo] = resultBanner.data.filter(
              (item) => {
                return item.promotionId.includes(id);
              }
            );
            setPromotionDetailInfo(tempPromotionDetailInfo);
            setPromotionDetail(result.data);
            setLoading(false);
            console.log(result.data);
          }
        }
      };
      loadData();
    } catch (err) {
      Swal.fire('Oppss!', err, 'error');
    } finally {
      setLoading(true);
    }
  }, [id, outletId]);

  const renderProductPromo = () => {
    if (!isEmptyArray(promotionDetail)) {
      return promotionDetail.map((promotionProduct, index) => {
        return (
          <Box
            sx={{
              marginLeft: '2.5rem',
              marginRight: '-2.5rem',
            }}
          >
            <Product key={index} item={promotionProduct} />
          </Box>
        );
      });
    }
    return null;
  };

  if (loading) {
    return <LoopCircleLoading />;
  }

  return (
    <div className='site-main' style={{ marginTop: '6em' }}>
      <Card sx={{ width: '100%' }}>
        <CardMedia
          component='img'
          height='100%'
          image={promotionDetailInfo.defaultImageURL}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant='h4'
            fontWeight='500'
            component='div'
          >
            {promotionDetailInfo.name}
          </Typography>
          <Typography
            variant='subtitle1'
            fontSize='1.5rem'
            fonRighte='-1.5rem'
            color='text.secondary'
          >
            {promotionDetailInfo.description}
          </Typography>
        </CardContent>
      </Card>

      {!isEmptyArray(promotionDetail) ? (
        <>
          <Typography
            variant='h4'
            fontWeight={600}
            color='#01AEC5'
            sx={{ marginY: '1rem' }}
          >
            Products
          </Typography>
          <Grid
            container
            direction='row'
            justifyContent='start'
            alignItems='center'
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {renderProductPromo()}
          </Grid>
        </>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    banners: state.promotion.banners,
    colorTheme: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);
