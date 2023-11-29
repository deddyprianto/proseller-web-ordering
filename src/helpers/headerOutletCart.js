export const renderOutletInfo = (nameOutlet,color,IconPlace) => {
    return (
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #C1C1C1',
          margin: '0 -15px 20px',
          padding: '0 15px 15px',
          flexDirection: nameOutlet.length > 17 ? 'column' :'row'
          
        }}
      >
        <div style={{ color: '#9D9D9D' }}>You are ordering from</div>
        <div
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
        >
          {nameOutlet.length <= 17  && <IconPlace stroke={color} />}
          <span style={{ marginLeft:nameOutlet.length > 17 ?  '0px': '8px', color: color }}>
            <strong>{nameOutlet}</strong>
          </span>
        </div>
      </div>
    );
  };