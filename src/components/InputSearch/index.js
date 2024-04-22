import { CONSTANT } from 'helpers';
import { useSelector ,useDispatch} from 'react-redux';

export function InputSearch() {
  const dispatch  = useDispatch()
  const {color} = useSelector(state => state.theme);
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "var(--Brand-color-Tertiary, #F2F2F2)",
        display: "flex",
        gap: "16px",
        padding: "16px",
        justifyContent:"space-evenly"
      }}
    >
      <div onClick={() => {
          dispatch({
            type: CONSTANT.IS_SEARCH_ITEM,
            payload: false
          })
        }}>
  <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/468da623b71470c47ea7f7160a9a76cc0a3a1eff15fe8e7e72be98b782f4b8b8?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
      style={{
        aspectRatio: "1",
        objectFit: "auto",
        objectPosition: "center",
        width: "36px",
        alignSelf: "stretch",
        margin: "auto 0",
      }}
    />
      </div>
    
      <div
        style={{
          borderRadius: "8px",
          boxShadow: "0px 0px 0px 3px rgba(159, 135, 255, 0.20)",
          borderColor: "rgba(136, 135, 135, 1)",
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "var(--Brand-color-Secondary, #FFF)",
          color: "var(--Text-color-Tertiary, #888787)",
          justifyContent: "center",
          padding: "7px 6px",
          width:"65%",
          font: "500 14px Plus Jakarta Sans, sans-serif ",
        }}
      >
        <input style={{
          border:"none",
          outline:'none',
          width:'100%'
        }} placeholder='Search anything...' type='text' />
      </div>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100%",
          backgroundColor: color.primary,
          display: "flex",
          width: "40px",
          height: "40px",
          margin: "auto 0",
          padding: "0 8px",
        }}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/545263d704b4a749b37a19b61649502acb2490d4ea8381fab658a78348bda72c?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
          style={{
            aspectRatio: "1",
            objectFit: "auto",
            objectPosition: "center",
            width: "24px",
          }}
        />
      </div>
    </div>
  );
}


