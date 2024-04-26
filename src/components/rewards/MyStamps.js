import DefaultStampsImage from "components/profile/DefaultStampsImage";

export const MyStamps = ({ items, image, openModal }) => {
  return (
    <div>
      <div style={{ color: "#FFF", fontWeight: "bold", paddingTop: 10 }}>
        My Stamps
      </div>
      <div className="container-stamp">
        {image ? (
          <div style={{ marginBottom: "20px" }}>
            <img src={image} alt="Stamps" />
          </div>
        ) : (
          <DefaultStampsImage stampsItem={items} />
        )}

        <button className="btn-see-detail" onClick={() => openModal("stamp")}>
          <span style={{ fontSize: "14px", fontWeight: 500 }}>See Details</span>
        </button>
      </div>
    </div>
  );
};
