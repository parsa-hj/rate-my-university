import React, { useState } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const CommentsSection = ({ ratings, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState("");

  const startEditing = (ratingid, currentComment) => {
    setEditingComment(ratingid);
    setNewComment(currentComment);
  };

  const saveEdit = () => {
    onEdit(editingComment, newComment);
    setEditingComment(null);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      {ratings.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {rating.studentname
                        ? rating.studentname[0].toUpperCase()
                        : "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {rating.studentname || "Anonymous Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(rating.ratingdate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {user && user.id === rating.studentid && (
                    <button
                      onClick={() =>
                        startEditing(rating.ratingid, rating.ratingcomment)
                      }
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit review"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                  {user && user.id === rating.studentid && (
                    <button
                      onClick={() => onDelete(rating.ratingid)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete review"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {editingComment === rating.ratingid ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edit your review
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(rating)
                      .filter(([key]) =>
                        [
                          "studentlife",
                          "cost",
                          "diningfood",
                          "dormshousing",
                          "classesteachers",
                          "returnoninvestment",
                          "healthsafety",
                          "citysetting",
                        ].includes(key)
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-50 px-3 py-1 rounded-full text-sm"
                        >
                          <span className="text-gray-600">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="ml-1 font-medium text-blue-600">
                            {value}
                          </span>
                        </div>
                      ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {rating.ratingcomment}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
