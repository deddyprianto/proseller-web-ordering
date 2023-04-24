import React from 'react';
import fontStyles from '../style/styles.module.css';
import FormGroup from '@mui/material/FormGroup';
import { useSelector } from 'react-redux';
import RenderModifierOptions from './RenderModifierOptions';

const RenderModifier = ({
  productModifiers,
  product,
  selectedProductModifiers,
  setSelectedProductModifiers,
  settingAppoinment,
}) => {
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);

  const renderTermsAndConditionsProductModifiers = (productModifier) => {
    const isMinZero =
      productModifier?.modifier?.min === 0 || !productModifier?.modifier?.min;
    const isMaxZero =
      productModifier?.modifier?.max === 0 || !productModifier?.modifier?.max;
    const isMinMoreThenZero = productModifier?.modifier?.min > 0;
    const isMaxLessThenZero = productModifier?.modifier?.max > 0;

    if (isMinZero && isMaxZero) {
      return (
        <div
          style={{
            color: 'rgba(157, 157, 157, 1)',
            fontSize: '12px',
          }}
        >
          Optional
        </div>
      );
    }

    if (isMinMoreThenZero && isMaxZero) {
      return (
        <div
          style={{
            color: 'rgba(157, 157, 157, 1)',
            fontSize: '12px',
          }}
        >
          Min {productModifier.modifier.min}
        </div>
      );
    }

    if (isMinZero && isMaxLessThenZero) {
      return (
        <div
          style={{
            color: 'rgba(157, 157, 157, 1)',
            fontSize: '12px',
          }}
        >
          Max {productModifier.modifier.max}
        </div>
      );
    }

    if (isMinMoreThenZero && isMaxLessThenZero) {
      return (
        <div
          style={{
            color: 'rgba(157, 157, 157, 1)',
            fontSize: '12px',
          }}
        >
          Min {productModifier.modifier.min}, Max {productModifier.modifier.max}
        </div>
      );
    }
  };

  const RenderHeaderModifier = ({ productModifier }) => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px', fontSize: '14px', fontWeight: 500 }}>
          {productModifier.modifierName}
        </div>
        {renderTermsAndConditionsProductModifiers(productModifier)}
      </div>
    );
  };

  const RenderProductModifiers = () => {
    return productModifiers.map((productModifier) => {
      return (
        <div
          key={productModifier.id}
          style={{ width: '90%', margin: 'auto', marginBottom: '20px' }}
        >
          <RenderHeaderModifier productModifier={productModifier} />
          <FormGroup>
            <RenderModifierOptions
                settingAppoinment={settingAppoinment}
              defaultOutlet={defaultOutlet}
              selectedProductModifiers={selectedProductModifiers}
              setSelectedProductModifiers={setSelectedProductModifiers}
              productModifier={productModifier}
              product={product}
            />
          </FormGroup>
        </div>
      );
    });
  };

  return (
    <div className={fontStyles.myFont}>
      <RenderProductModifiers />
    </div>
  );
};

export default RenderModifier;
