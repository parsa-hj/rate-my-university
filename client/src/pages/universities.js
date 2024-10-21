import React from "react";
import Navbar from "../components/navbar";
import mizzou from "../assets/images/mizzou.png";
import { Link } from "react-router-dom";

function Universities() {
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold mt-12 ml-20">Results</h1>
      <div className="flex justify-center space-x-14 p-6">
        {/* Card 1 */}
        <div className="border border-gray-200 shadow-lg rounded-lg p-4 max-w-xs">
          <img
            src={mizzou}
            alt="Mizzou"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <h2 className="text-xl font-bold mb-2">University of Missouri</h2>
          <p className="text-gray-500 mb-4">Columbia, MO</p>
          <div className="flex space-x-4">
            <button className="bg-[#3256E5] text-white py-2 px-4 rounded-md">
              <Link to="/university">View</Link>
            </button>
            <button className="border border-[#3256E5] text-[#3256E5] bg-white py-2 px-4 rounded-md">
              <Link to="/rating">Rating</Link>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-gray-200 shadow-lg rounded-lg p-4 max-w-xs">
          <img
            src={mizzou}
            alt="Mizzou"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <h2 className="text-xl font-bold mb-2">University of Missouri</h2>
          <p className="text-gray-500 mb-4">Columbia, MO</p>
          <div className="flex space-x-4">
            <button className="bg-[#3256E5] text-white py-2 px-4 rounded-md">
              View
            </button>
            <button className="border border-[#3256E5] text-[#3256E5] bg-white py-2 px-4 rounded-md">
              Rating
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-gray-200 shadow-lg rounded-lg p-4 max-w-xs">
          <img
            src={mizzou}
            alt="Mizzou"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <h2 className="text-xl font-bold mb-2">University of Missouri</h2>
          <p className="text-gray-500 mb-4">Columbia, MO</p>
          <div className="flex space-x-4">
            <button className="bg-[#3256E5] text-white py-2 px-4 rounded-md">
              <Link to="/university">View</Link>
            </button>
            <button className="border border-[#3256E5] text-[#3256E5] bg-white py-2 px-4 rounded-md">
              Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Universities;
