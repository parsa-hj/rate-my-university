import React, { useState } from "react";

// Stars Component takes number (initial rating) and id as props
function Stars({ number, id }) {
  // Set the initial state to the value of the number prop
  const [rating, setRating] = useState(number);

  // Function to handle click on stars
  const handleRating = (index) => {
    setRating(index);
  };

  // Create an array for 5 stars
  const starArray = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-row mr-8">
      {starArray.map((star, index) => (
        <label key={index} className="cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            onClick={() => handleRating(star)}
          />
          <Star filled={index + 1 <= rating} />
        </label>
      ))}
    </div>
  );
}

// Star component that takes whether it's filled or not as prop
function Star({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill={filled ? "orange" : "transparent"}
      viewBox="0 0 24 24"
      stroke="orange"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.141 6.588h6.905c.969 0 1.371 1.24.588 1.81l-5.584 4.057 2.142 6.588c.299.921-.755 1.688-1.54 1.1l-5.584-4.056-5.584 4.056c-.784.588-1.838-.179-1.54-1.1l2.141-6.588L1.51 11.325c-.783-.57-.38-1.81.588-1.81h6.905l2.142-6.588z"
      />
    </svg>
  );
}

export default Stars;
