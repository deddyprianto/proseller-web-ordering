import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import fontStyles from '../style/styles.module.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useSelector, useDispatch } from 'react-redux';
import { isEmptyArray } from 'helpers/CheckEmpty';
import RenderModifier from './RenderModifier';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import '../style/loadingspin.css';

const DetailAppointment = ({
  color,
  styleSheet,
  setIsOpenModalDetail,
  item,
  handleCurrency,
}) => {
  // initial
  const dispatch = useDispatch();
  //some state
  const [isLoading, setIsLoading] = useState(false);
  const [addService, setAddService] = useState({});
  const [selectedProductModifiers, setSelectedProductModifiers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(1);
  // some selectors
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);

  // some functions
  const handleAddCart = async () => {
    try {
      setIsLoading(true);
      await dispatch(OrderAction.addCartAppointment(addService));
      setIsLoading(false);
      setIsOpenModalDetail(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePrice = (qty, totalPrice) => {
    setTotalPrice(qty * totalPrice);
  };

  const handleProductModifierFormated = (items) => {
    let totalPrice = 0;
    let productModifiers = [];

    if (!isEmptyArray(items)) {
      items.forEach((item) => {
        totalPrice = totalPrice + item.qty * item.price;
        productModifiers.push({
          modifierId: item.modifierId,
          modifiers: [
            {
              productId: item.modifierProductId,
              quantity: item.qty,
            },
          ],
        });
      });

      const productModifierMerged = productModifiers.reduce((obj, a) => {
        if (obj[a.modifierId]) {
          obj[a.modifierId].modifiers.push(...a.modifiers);
        } else {
          obj[a.modifierId] = { ...a };
        }
        return obj;
      }, {});

      const result = Object.values(productModifierMerged);

      totalPrice = totalPrice + (item.retailPrice || 0);

      handlePrice(qty, totalPrice);

      return result;
    }

    totalPrice = totalPrice + (item.retailPrice || 0);
    handlePrice(qty, totalPrice);
    return productModifiers;
  };

  useEffect(() => {
    const productModifierFormated = handleProductModifierFormated(
      selectedProductModifiers
    );
    setAddService({
      outletId: defaultOutlet.sortKey,
      item: {
        productId: `product::${item.id}`,
        quantity: 1,
        modifierGroups: productModifierFormated,
      },
    });
  }, [selectedProductModifiers]);

  // some .scss
  const styles = {
    radioSizeModifier: {
      '& .MuiSvgIcon-root': {
        fontSize: 24,
        color: '#667080',
        borderRadius: '3px',
      },
    },
    modifierOption: {
      width: '90%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 'auto',
    },
  };

  // COMPONENTS
  const RenderAnimationLoading = () => {
    return (
      <div className='lds-spinner_detailapp'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };
  const RenderMainDetail = () => {
    const dataImage = [
      { img: item.defaultImageURL },
      { img: item.defaultImageURL },
    ];
    return (
      <div style={{ width: '90%', margin: '0px auto' }}>
        <div
          style={{
            marginTop: '30px',
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <PhotoProvider>
            <PhotoSlider
              images={dataImage.map((item) => ({ src: item.img, key: item }))}
              visible={visible}
              onClose={() => setVisible(false)}
            />
          </PhotoProvider>
          <img
            src={item.defaultImageURL}
            alt='myPic'
            style={{ width: '100%', cursor: 'pointer', borderRadius: '10px' }}
            onClick={() => setVisible(true)}
          />
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '6px',
              position: 'absolute',
              bottom: 4,
              right: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3px',
            }}
          >
            <div>1/{dataImage.length}</div>
          </div>
        </div>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            margin: 0,
            padding: 0,
          }}
        >
          {item.name}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(183, 183, 183, 1)',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: '20px' }} />
          <div style={{ fontSize: '14px', marginLeft: '5px' }}>60 mins</div>
        </div>
        <div
          style={{
            justifySelf: 'end',
            display: 'flex',
            fontSize: '14px',
          }}
        >
          <div style={{ color: 'rgba(255, 85, 99, 1)', fontWeight: 700 }}>
            {handleCurrency(item.retailPrice)}
          </div>
          <div
            style={{
              marginLeft: '5px',
              textDecorationLine: 'line-through',
              opacity: 0.5,
              fontWeight: 700,
            }}
          >
            SGD 10.00
          </div>
        </div>

        <p style={{ fontWeight: 'bold', marginTop: '30px' }}>
          About this service
        </p>
        <p
          style={{
            margin: 0,
            padding: 0,
            fontSize: '12px',
            opacity: 0.8,
            lineHeight: '20px',
            color: 'rgba(157, 157, 157, 1)',
          }}
        >
          {item.description}
        </p>
      </div>
    );
  };
  const RenderHeader = () => {
    return (
      <div
        style={{
          ...styleSheet.gridStyle,
          marginTop: '10px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          fontSize='large'
          onClick={() => {
            setIsOpenModalDetail(false);
          }}
        />
        <p
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'rgba(255, 85, 99, 1)',
          }}
        >
          Service Detail
        </p>
      </div>
    );
  };

  const RenderAddOnLabel = () => {
    return (
      <div style={{ width: '90%', margin: 'auto' }}>
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Add Ons</p>
      </div>
    );
  };
  const RenderItemAddOns = ({ modifier }) => {
    return modifier.details.map((item) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={<Checkbox sx={styles.radioSizeModifier} />}
            label={<div style={{ fontSize: '14px' }}>{item.name}</div>}
          />
          <div style={{ fontSize: '14px' }}>{handleCurrency(item.price)}</div>
        </div>
      );
    });
  };
  const LabelGroup = ({ item }) => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px', fontSize: '14px', fontWeight: 600 }}>
          {item.modifier.name}
        </div>
        <div
          style={{
            color: 'rgba(157, 157, 157, 1)',
            marginRight: '5px',
            fontSize: '12px',
          }}
        >
          Min {item.modifier.min}
        </div>
        <div
          style={{
            color: 'rgba(157, 157, 157, 1)',
            fontSize: '12px',
          }}
        >
          Max {item.modifier.max}
        </div>
      </div>
    );
  };

  const RenderGroupAddOns = ({ item }) => {
    return (
      <div style={{ width: '90%', margin: 'auto', marginBottom: '20px' }}>
        <LabelGroup item={item} />
        <RenderItemAddOns modifier={item?.modifier} />
      </div>
    );
  };
  const RenderPrice = () => {
    return (
      <div style={styles.modifierOption}>
        <div style={{ fontWeight: 700 }}>Price</div>
        <div style={{ fontWeight: 'bold', color: 'rgba(255, 85, 99, 1)' }}>
          {handleCurrency(totalPrice)}
        </div>
      </div>
    );
  };

  const RenderButtonPrice = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        <button
          onClick={handleAddCart}
          style={{
            width: '90%',
            borderRadius: '5px',
            fontSize: '13px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          Add to Booking Cart
        </button>
      </div>
    );
  };
  // const ListAddOns = () => {
  //   return item.productModifiers.map((item) => {
  //     return <RenderModifier productModifiers={item} />;
  //   });
  // };
  return (
    <LoadingOverlayCustom
      active={isLoading}
      spinner={<RenderAnimationLoading />}
      text='Add item to your cart...'
    >
      <div
        className={fontStyles.myFont}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr 100px',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '"."\n    "."',
          height: '100vh',
        }}
      >
        <div style={{ overflowY: 'auto', height: '100%' }}>
          <RenderHeader />
          <RenderMainDetail />
          <FormGroup>
            <RenderAddOnLabel />
            <RenderModifier
              setSelectedProductModifiers={setSelectedProductModifiers}
              selectedProductModifiers={selectedProductModifiers}
              productModifiers={item.productModifiers}
              product={item}
            />
          </FormGroup>
        </div>
        <div style={{ alignSelf: 'center' }}>
          <RenderPrice />
          <RenderButtonPrice />
        </div>
      </div>
    </LoadingOverlayCustom>
  );
};

export default DetailAppointment;
