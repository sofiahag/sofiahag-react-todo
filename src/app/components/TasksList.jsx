import React from "react";

const generateFallbackKey = () => {
  return Date.now().toString();
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

        return (
          <li className="text-base m-2 bg-light-pink-post-it mt-5" key={key}>
            <div className="bg-pink-post-it">
              <h2 className="text-lg break-all px-3 py-3 mr-4">{title}</h2>
            </div>
            <div className="bg-pink-cat-post-it">
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
