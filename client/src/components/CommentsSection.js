import React, { useState } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/20/solid";

const CommentsSection = ({ ratings, onDelete, onEdit }) => {
  const [editingComment, setEditingComment] = useState(null); // Track the comment being edited
  const [newComment, setNewComment] = useState(""); // Track the updated comment text

  // Start editing a comment
  const startEditing = (ratingID, currentComment) => {
    setEditingComment(ratingID); // Set the editing state to the current comment
    setNewComment(currentComment); // Pre-fill the input with the current comment text
  };

  // Save the updated comment
  const saveEdit = () => {
    onEdit(editingComment, newComment); // Pass the updated comment to the parent handler
    setEditingComment(null); // Exit edit mode
    setNewComment(""); // Clear the input
  };

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
              {/* Delete Button */}
              <button
                onClick={() => onDelete(rating.RatingID)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-6 w-6" />
              </button>

              {/* Edit Button */}
              <button
                onClick={() =>
                  startEditing(rating.RatingID, rating.RatingComment)
                }
                className="absolute top-2 right-12 text-blue-500 hover:text-blue-700"
              >
                <PencilSquareIcon className="h-6 w-6" />
              </button>

              {/* Display or Edit Comment */}
              {editingComment === rating.RatingID ? (
                <div>
                  <p className="text-lg font-medium">Editing Comment:</p>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border rounded px-2 py-1 w-full mt-2"
                  />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={saveEdit}
                      className="text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="text-white bg-gray-500 hover:bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium">Comment:</p>
                  <p className="text-gray-700">{rating.RatingComment}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
