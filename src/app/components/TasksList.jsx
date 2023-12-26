import React from "react";

const generateFallbackKey = () => {
  return Date.now().toString();
};

const colorHexMap = {
  yellow: ["#FEF9C3", "#FFEF8A"],
  lime: ["#ECFCCB", "#D9F99D"],
  green: ["#DCFCE7", "#BBF7D0"],
  teal: ["#CCFBF1", "#99F6E4"],
  cyan: ["#CFFAFE", "#A5F3FC"],
  indigo: ["#E0E7FF", "#C7D2FE"],
  blue: ["#DBE9FE", "#BFDBFE"],
  violet: ["#EDE9FE", "#DDD6FE"],
  fuchsia: ["#FAE8FF", "#F5D0FE"],
  pink: ["#FBE7F3", "#FBCFE8"],
  rose: ["#FFE4E6", "#FECDD3"]
};


const categoryColorMap = {};
const getRandomColorHex = (category) => {
  if (categoryColorMap[category]) {
    return categoryColorMap[category];
  }
  if (colorHexMap[category]) {
    return colorHexMap[category];
  }
  const categories = Object.keys(colorHexMap);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return colorHexMap[randomCategory];
};


export default function TasksList({ allTasks, handleDelete }) {

  if (allTasks.length === 0) {
    return <p className="text-white">No tasks yet</p>;
  }

  const numColumns = Math.min(4, Math.max(1, allTasks.length));

  return (
    <ul className={`grid grid-cols-1 md:grid-cols-${numColumns}`}>
      {allTasks.map(({ id, title, description, category }) => {
        const key = id || generateFallbackKey();
        if (!id) {
          console.warn('Task skipped due to missing id:', { title, description });
          return null;
        }
        const [listColor, divColor] = getRandomColorHex(category);
        categoryColorMap[category] = [listColor, divColor];

        return (
          <li className={`text-base m-2`} key={key} style={{ backgroundColor: listColor }}>
            <div style={{ backgroundColor: divColor }}>
              <h2 className="text-lg break-all px-3 py-3 mr-4">{title}</h2>
              <hr></hr>
              <p className="text-base px-3 py-1 mr-4">Category: {category}</p>
              <hr></hr>
              <button className="bg-yellow-50" onClick={() => handleDelete(id)}>X</button>
            </div>
            {!description ? null : (
              <div className="text-base break-all m-3">
                {description.split('\n').map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" id={`checkbox-${index}`} />
                    <label htmlFor={`checkbox-${index}`} className="ml-2">{item}</label>
                  </div>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
