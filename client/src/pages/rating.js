import React from "react";
import Navbar from "../components/navbar";

function Rating() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        {/* University Name */}
        <h1 className="text-2xl font-bold mt-8 ml-4">University of Missouri</h1>

        {/* Rating Categories */}
        <div className="mt-6 space-y-6">
          {/* Student Life */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Student Life</p>
            <RatingComponent />
          </div>

          {/* Classes and Teachers */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Classes and Teachers</p>
            <RatingComponent />
          </div>

          {/* Cost */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Cost</p>
            <RatingComponent />
          </div>

          {/* Return on Investment */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Return on Investment</p>
            <RatingComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingComponent() {
  return (
    <div className="flex items-center space-x-2">
      <select className="border rounded-md p-2 text-lg">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  );
}

export default Rating;
