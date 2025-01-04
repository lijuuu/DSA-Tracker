import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load data from localStorage if it exists, otherwise fetch from JSON
    const savedData = localStorage.getItem("linked_list_data");
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      fetch("datas.json")
        .then((response) => response.json())
        .then((response) => {
          setData(response.linked_list);
          // Save fetched data to localStorage
          localStorage.setItem("linked_list_data", JSON.stringify(response.linked_list));
        })
        .catch((error) => console.error("Error loading JSON:", error));
    }
  }, []);

  const handleCheckboxChange = (section, index) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[section] = updatedData[section].map((item, idx) =>
        idx === index ? { ...item, completed: !item.completed } : item
      );

      // Save updated data to localStorage
      localStorage.setItem("linked_list_data", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>Linked List Checklist</h1>
      {data ? (
        Object.keys(data).map((section) => (
          <div key={section} style={{ marginBottom: "20px" }}>
            <h2 style={{ color: "#333" }}>
              {section.replace(/_/g, " ").toUpperCase()}
            </h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {data[section].map((item, index) => (
                <li key={index} style={{ margin: "5px 0" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleCheckboxChange(section, index)}
                      style={{ marginRight: "10px" }}
                    />
                    {item.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
