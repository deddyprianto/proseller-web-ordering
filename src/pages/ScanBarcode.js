import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

const ScanBarcode = () => {
  const [result, setResult] = useState('No result');

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  return (
    <div>
      <QrReader
        delay={200}
        onError={(err) => console.error(err)}
        onScan={handleScan}
        style={{ width: '100%' }}
        facingMode={'environment'}
      />
      <p>{result}</p>
    </div>
  );
};

export default ScanBarcode;
