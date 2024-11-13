import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";

function Account() {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState("profile");

  // State to store fetched data
  const [data, setData] = useState(null);

  // Effect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  // Function to fetch data
  const fetchData = async () => {
    try {
      // Make a GET request using the Fetch API
      const response = await fetch("http://localhost:5000/students");

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the JSON data from the response
      const result = await response.json();

      // Update the state with the fetched data
      setData(result[0]); // Assuming the API returns an array with one student
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 bg-gray-100 mt-10">
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
          {activeTab === "profile" && <ProfileContent data={data} />}
          {activeTab === "settings" && <SettingsContent data={data} />}
          {activeTab === "ratings" && <RatingsContent />}
        </div>
      </div>
    </div>
  );
}

// Dummy content for the tabs
const ProfileContent = ({ data }) => {
  if (!data) {
    return <p>Loading...</p>; // Loading state while data is being fetched
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <span className="block text-lg font-medium text-gray-700">
            First Name:
          </span>
          <span className="block text-lg text-gray-900">
            {data && data.first_name}
          </span>
          {/* fetched data */}
        </div>
        <div>
          <span className="block text-lg font-medium text-gray-700">
            Last Name:
          </span>
          <span className="block text-lg text-gray-900">
            {data && data.last_name}
          </span>
          {/* fetched data */}
        </div>
        <div>
          <span className="block text-lg font-medium text-gray-700">
            School:
          </span>
          <span className="block text-lg text-gray-900">
            {data && data.school}
          </span>
          {/* fetched data */}
        </div>
        <div>
          <span className="block text-lg font-medium text-gray-700">
            Major:
          </span>
          <span className="block text-lg text-gray-900">
            {data && data.major}
          </span>
          {/* fetched data */}
        </div>
        <div>
          <span className="block text-lg font-medium text-gray-700">
            Graduation Year:
          </span>
          <span className="block text-lg text-gray-900">
            {data && data.graduation_year}
          </span>
          {/* fetched data */}
        </div>
      </div>
    </div>
  );
};

const SettingsContent = ({ data }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
    <div className="space-y-4">
      <div>
        <span className="block text-lg font-medium text-gray-700">Email:</span>
        <span className="block text-lg text-gray-900">
          {data && data.email}
        </span>
        {/* fetched data */}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-700">
          Password:
        </span>
        <span className="block text-lg text-gray-900">*******</span>
        {/* Example password - not fetched */}
      </div>
    </div>
  </div>
);

const RatingsContent = () => {
  // State to store ratings and universities data
  const [ratings, setRatings] = useState([]);
  const [universities, setUniversities] = useState([]);

  // Fetch ratings and universities when component mounts
  useEffect(() => {
    fetchRatings();
    fetchUniversities();
  }, []);

  // Function to fetch ratings data
  const fetchRatings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/students/2778866/ratings"
      ); // Assuming a generic ratings endpoint
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  // Function to fetch universities data
  const fetchUniversities = async () => {
    try {
      const response = await fetch("http://localhost:5000/universities");
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  // Function to get the university name based on UniversityID
  const getUniversityName = (universityId) => {
    const university = universities.find(
      (uni) => uni.UniversityID === universityId
    );
    return university ? university.name : "Unknown University";
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Ratings</h2>
      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div
              key={rating.RatingID}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">
                    University:
                  </h3>
                  <p className="text-gray-900 font-semibold">
                    {getUniversityName(rating.UniversityID)}
                  </p>
                </div>
              </div>
              {/* Additional rating fields */}
              <div className="mt-2">
                <p>
                  <strong>Student Life:</strong> {rating.StudentLife}
                </p>
                <p>
                  <strong>Classes & Teachers:</strong> {rating.ClassesTeachers}
                </p>
                <p>
                  <strong>Cost:</strong> {rating.Cost}
                </p>
                <p>
                  <strong>Return on Investment:</strong>{" "}
                  {rating.ReturnOnInvestment}
                </p>
                <p>
                  <strong>Dining & Food:</strong> {rating.DiningFood}
                </p>
                <p>
                  <strong>Dorms & Housing:</strong> {rating.DormsHousing}
                </p>
                <p>
                  <strong>Health & Safety:</strong> {rating.HealthSafety}
                </p>
                <p>
                  <strong>City Setting:</strong> {rating.CitySetting}
                </p>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Rating:</h3>
                  <p className="text-gray-900">{rating.RatingComment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No ratings available.</p>
      )}
    </div>
  );
};

export default Account;
