import { useEffect, useState } from "react";

const useFilter = (data) => {
  const [key, setKey] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (data && data.length > 0) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(key.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [key, data]);

  const handleChange = (e) => {
    setKey(e.target.value);
  };

  return [filteredData, handleChange];
};

export default useFilter;
