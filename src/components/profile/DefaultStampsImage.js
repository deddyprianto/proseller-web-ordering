import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const DefaultStampsImage = ({ stampsItem }) => {
  return (
    <div
      style={{
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {stampsItem.map((item, key) => (
        <div
          key={key}
          style={{
            width: "18%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 40,
              width: 40,
              borderRadius: 40,
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            {item.stampsStatus === "-" ? (
              <StarBorderIcon
                className="customer-group-name"
                style={{ fontSize: 20 }}
              />
            ) : (
              <StarIcon style={{ color: "#ffa41b", fontSize: 20 }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultStampsImage;
