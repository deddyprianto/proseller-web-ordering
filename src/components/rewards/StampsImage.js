import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const StampsImage = ({ stampsItem }) => {
  return (
    <div className='container-stamp-img-list'>
      {stampsItem.map((item, key) => (
        <div key={key} className='container-stamp-img-list-item'>
          <div className='container-star-item'>
            {item.stampsStatus === '-' ? (
              <StarBorderIcon
                className='customer-group-name'
                style={{ fontSize: 20 }}
              />
            ) : (
              <StarIcon style={{ color: '#ffa41b', fontSize: 20 }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StampsImage;
