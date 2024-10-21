import React, { useState } from "react";
import Navbar from "../components/navbar";

function Account() {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Hello User!</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`py-2 px-4 rounded-lg focus:outline-none ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`py-2 px-4 rounded-lg focus:outline-none ${
              activeTab === "settings"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Account Settings
          </button>
          <button
            className={`py-2 px-4 rounded-lg focus:outline-none ${
              activeTab === "ratings"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("ratings")}
          >
            My Ratings
          </button>
        </div>

        {/* Tab Content */}
        <div className="border p-4 rounded-lg">
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "settings" && <SettingsContent />}
          {activeTab === "ratings" && <RatingsContent />}
        </div>
      </div>
    </div>
  );
}

// Dummy content for the tabs
const ProfileContent = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
    <div className="space-y-4">
      <div>
        <span className="block text-lg font-medium text-gray-700">
          First Name:
        </span>
        <span className="block text-lg text-gray-900">John</span>
        {/* Example data */}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-700">
          Last Name:
        </span>
        <span className="block text-lg text-gray-900">Doe</span>
        {/* Example data */}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-700">School:</span>
        <span className="block text-lg text-gray-900">
          Missouri University of Science and Technology
        </span>
        {/* Example data */}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-700">Major:</span>
        <span className="block text-lg text-gray-900">Computer Science</span>
        {/* Example data */}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-700">
          Graduation Year:
        </span>
        <span className="block text-lg text-gray-900">2026</span>
        {/* Example data */}
      </div>
    </div>
  </div>
);

const SettingsContent = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
    <div className="space-y-4">
      <div>
        <span className="block text-lg font-medium text-gray-700">Email:</span>
        <span className="block text-lg text-gray-900">johndoe@mst.edu</span>
        {/* Example data */}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-700">
          Password:
        </span>
        <span className="block text-lg text-gray-900">*******</span>
        {/* Example data */}
      </div>
    </div>
  </div>
);

const RatingsContent = () => (
  <div>
    <h2 className="text-2xl font-semibold">My Ratings</h2>
    <p>Your ratings and reviews will be displayed here.</p>
  </div>
);

export default Account;
