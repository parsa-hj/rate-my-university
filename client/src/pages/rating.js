import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";
import Stars from "../components/starts";

function Rating() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        {/* University Name */}
        <h1 className="text-2xl font-bold mt-8 ml-4">University of Missouri</h1>

        {/* Rating Categories */}
        <div className="mt-6 space-y-6 ml-4">
          {/* Student Life */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Student Life</p>
            <Stars number={3} id={1} />
          </div>

          {/* Classes and Teachers */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Classes and Teachers</p>
            <Stars number={3} id={1} />
          </div>

          {/* Cost */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Cost</p>
            <Stars number={3} id={1} />
          </div>

          {/* Return on Investment */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Return on Investment</p>
            <Stars number={3} id={1} />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Dinning and Food</p>
            <Stars number={3} id={1} />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Dorms and Housing</p>
            <Stars number={3} id={1} />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Health and Safety</p>
            <Stars number={3} id={1} />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">City and Setting</p>
            <Stars number={3} id={1} />
          </div>
        </div>
      </div>

      <div className="ml-11">
        <p className="font-bold text-lg">Write a review</p>
        <textarea
          type="text"
          placeholder="Share your thoughts"
          className="w-96 border p-2 mt-2 rounded-md resize-y h-40"
          maxlength="250"
        />
      </div>

      <button className="bg-[#3256E5] text-white py-2 px-4 rounded-md mt-8 ml-10">
        Submit Ratings
      </button>

      <Footer />
    </div>
  );
}

export default Rating;
