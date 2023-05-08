import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';

const RenderModifierOptions = ({
  productModifier,
  selectedProductModifiers,
  setSelectedProductModifiers,
  settingAppoinment,
}) => {
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const color = useSelector((state) => state.theme.color);

  const styles = {
    radioSizeModifier: {
      '&.MuiCheckbox-root': {
        color: 'rgba(157, 157, 157, 1)',
        borderRadius: '3px',
      },
      '&.Mui-checked': {
        color: color.primary,
        borderRadius: '3px',
      },
    },
  };
  const handleCurrency = (value) => {
    const price = value || 0;
    const result = price.toLocaleString(companyInfo.currency.locale, {
      style: 'currency',
      currency: companyInfo.currency.code,
    });

    return result;
  };

  const handleModifierOptionSelected = ({
    modifierProductId,
    modifierId,
    qty,
    price,
    name,
  }) => {
    const mergeID = `${modifierId}${modifierProductId}`;
    const items = selectedProductModifiers;

    const modifierProductIds = selectedProductModifiers.map((item) => {
      return `${item.modifierId}${item.modifierProductId}`;
    });

    const modifierProductIdIndex = modifierProductIds.indexOf(mergeID);
    if (modifierProductIdIndex !== -1) {
      items.splice(modifierProductIdIndex, 1);
      setSelectedProductModifiers([...items]);
    } else {
      setSelectedProductModifiers([
        ...selectedProductModifiers,
        {
          modifierId,
          modifierProductId,
          qty,
          price,
          name,
        },
      ]);
    }
  };

  const isCheckedCheckbox = (modifier) => {
    const filterSelectedProductModifiers = selectedProductModifiers.filter(
      (item) => item.orderingStatus !== 'UNAVAILABLE'
    );

    const isChecked = filterSelectedProductModifiers.find(
      (selectedProductModifier) =>
        selectedProductModifier.modifierId === productModifier.modifierID &&
        selectedProductModifier.modifierProductId === modifier.productID
    );

    return !!isChecked;
  };

  const handleDisabledCheckbox = ({ modifier, max, productModifier }) => {
    let qtyTotal = 0;
    const filterSelectedProductModifiers = selectedProductModifiers.filter(
      (item) => item.orderingStatus !== 'UNAVAILABLE'
    );
    const modifierProducts = filterSelectedProductModifiers.filter(
      (item) => item.modifierId === productModifier.modifierID
    );
    const modifierProductIds = modifierProducts.map(
      (item) => item.modifierProductId
    );

    modifierProducts.forEach((modifierProduct) => {
      qtyTotal = qtyTotal + modifierProduct.qty;
    });

    const isDisabled =
      qtyTotal >= max && modifierProductIds.indexOf(modifier.productID) === -1;

    if (max === 0) {
      return false;
    }

    return isDisabled;
  };

  const RenderOption = () => {
    return productModifier.modifier?.details?.map((modifier) => {
      return (
        <div
          key={modifier.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: modifier.orderingStatus === 'UNAVAILABLE' && 'relative',
          }}
        >
          <FormControlLabel
            checked={isCheckedCheckbox(modifier)}
            sx={{
              opacity: modifier.orderingStatus === 'UNAVAILABLE' && 0.5,
              pointerEvents:
                modifier.orderingStatus === 'UNAVAILABLE' && 'none',
              marginTop: '10px',
            }}
            control={
              <Checkbox
                style={{
                  transform: 'scale(1.5)',
                }}
                name={modifier.productID}
                onChange={() => {
                  handleModifierOptionSelected({
                    modifierProductId: modifier.productID,
                    modifierId: productModifier.modifierID,
                    qty: 1,
                    price: modifier.price,
                    name: modifier.name,
                  });
                }}
                sx={styles.radioSizeModifier}
                disabled={handleDisabledCheckbox({
                  modifier,
                  max: productModifier.modifier.max,
                  productModifier,
                })}
              />
            }
            label={
              <div
                style={{ fontSize: '14px', fontWeight: 600, color: 'black' }}
              >
                {modifier.name}
              </div>
            }
          />
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'black' }}>
            {settingAppoinment && handleCurrency(modifier.price)}
          </div>
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <RenderOption />
    </React.Fragment>
  );
};

export default RenderModifierOptions;
