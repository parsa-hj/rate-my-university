import React from "react";
import { TrashIcon } from "@heroicons/react/20/solid";

const CommentsSection = ({ ratings, onDelete }) => {
  return (
    <div className="mt-20 ml-40">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {ratings.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow-md mr-20 relative"
            >
              <button
                onClick={() => onDelete(rating.RatingID)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
              <p className="text-lg font-medium">Comment:</p>
              <p className="text-gray-700">{rating.RatingComment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
