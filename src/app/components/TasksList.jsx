import React from "react";

const generateFallbackKey = () => {
  return Date.now().toString();
};

export default function TasksList({ allTasks, handleDelete }) {

  if (allTasks.length === 0) {
    return <p>No tasks yet</p>;
  }

  return (
    <ul className={`grid grid-cols-1 ${allTasks.length > 1 ? 'md:grid-cols-2' : ''}`}>
      {allTasks.map(({ id, title, description, category }) => {
        const key = id || generateFallbackKey();
        if (!id) {
          console.warn('Task skipped due to missing id:', { title, description });
          return null;
        }

        return (
          <li className="bg-yellow-100 border-2 border-gray-300 text-base m-2" key={key}>
            <div className="bg-yellow-200">
              <h2 className="text-lg break-all px-3 py-3 mr-4">{title}</h2>
              <p className="text-base px-3 py-1 mr-4">Category: {category}</p>
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
