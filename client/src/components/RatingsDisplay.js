import React from "react";

const RatingsDisplay = ({ averageRatings }) => {
  return (
    <div className="flex justify-around mb-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Student Life:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.StudentLife.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Cost:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.Cost.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Dining and Food:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.DiningFood.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Dorms and Housing:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.DormsHousing.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Classes and Teachers:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.ClassesTeachers.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Return on Investment:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.ReturnOnInvestment.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-2xl">Health and Safety:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.HealthSafety.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-2xl">City Setting:</span>
          <span className="ml-2 text-xl font-semibold">
            {averageRatings.CitySetting.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RatingsDisplay;
