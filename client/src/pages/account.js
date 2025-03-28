import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import { User, Settings, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getStudents, getStudentRatings, getUniversities } from "../lib/api";

function Account() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const students = await getStudents();
      if (students && students.length > 0) {
        setData(students[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your profile, settings, and reviews
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              className={`flex items-center px-6 py-3 rounded-full transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </button>
            <button
              className={`flex items-center px-6 py-3 rounded-full transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-5 h-5 mr-2" />
              Account Settings
            </button>
            <button
              className={`flex items-center px-6 py-3 rounded-full transition-colors ${
                activeTab === "ratings"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("ratings")}
            >
              <Star className="w-5 h-5 mr-2" />
              My Ratings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </span>
          <span className="text-lg text-gray-900">{data.first_name}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </span>
          <span className="text-lg text-gray-900">{data.last_name}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block text-sm font-medium text-gray-600 mb-1">
            Age
          </span>
          <span className="text-lg text-gray-900">{data.age}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block text-sm font-medium text-gray-600 mb-1">
            School
          </span>
          <span className="text-lg text-gray-900">{data.school}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block text-sm font-medium text-gray-600 mb-1">
            Major
          </span>
          <span className="text-lg text-gray-900">{data.major}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="block text-sm font-medium text-gray-600 mb-1">
            Graduation Year
          </span>
          <span className="text-lg text-gray-900">{data.graduation_year}</span>
        </div>
      </div>
    </div>
  );
};

const SettingsContent = ({ data }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <span className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </span>
        <span className="text-lg text-gray-900">{data?.email}</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <span className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </span>
        <span className="text-lg text-gray-900">••••••••</span>
      </div>
    </div>
  </div>
);

const RatingsContent = () => {
  const [ratings, setRatings] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ratingsData, universitiesData] = await Promise.all([
        getStudentRatings(2778866),
        getUniversities(),
      ]);
      setRatings(ratingsData);
      setUniversities(universitiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUniversityName = (universityId) => {
    const university = universities.find(
      (uni) => uni.universityid === universityId
    );
    return university ? university.name : "Unknown University";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Ratings</h2>
      {ratings.length > 0 ? (
        <div className="space-y-8">
          {ratings.map((rating) => (
            <div
              key={rating.ratingid}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getUniversityName(rating.universityid)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(rating.ratingdate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    Student Life
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.studentlife}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    Classes & Teachers
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.classesteachers}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    Cost
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.cost}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    ROI
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.returnoninvestment}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    Dining & Food
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.diningfood}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    Dorms & Housing
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.dormshousing}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    Health & Safety
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.healthsafety}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600">
                    City Setting
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {rating.citysetting}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Review
                </h4>
                <p className="text-gray-900">{rating.ratingcomment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No ratings available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Account;
