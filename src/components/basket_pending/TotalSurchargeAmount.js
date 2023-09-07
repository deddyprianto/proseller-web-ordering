import React from 'react';
import { useSelector } from 'react-redux';

const TotalSurchargeAmount = ({ data, getCurrency }) => {
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const handleNaming =
    (companyInfo?.companyName === 'Muji' ||
      companyInfo?.companyName === 'newmujicafe') &&
    data?.orderingMode === 'TAKEAWAY'
      ? 'Takeaway Surcharge'
      : 'Service Charge';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
      }}
    >
      <div style={{ fontSize: 14 }}>{handleNaming}</div>
      <div style={{ fontWeight: 'bold', fontSize: 14 }}>
        {`+ ${getCurrency(data.dataBasket.totalSurchargeAmount)}`}
      </div>
    </div>
  );
};

export default TotalSurchargeAmount;
