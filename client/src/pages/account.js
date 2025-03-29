import Navbar from "../components/navbar";
import React, { useState, useEffect } from "react";
import { User, Settings, Star } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { getStudents, getStudentRatings, getUniversities } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

function Account() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: userData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setData(userData);
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
            Date of Birth
          </span>
          <span className="text-lg text-gray-900">
            {new Date(data.date_of_birth).toLocaleDateString()}
          </span>
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
          <span className="text-lg text-gray-900">
            {data.major || "Not specified"}
          </span>
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
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRating, setEditingRating] = useState(null);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchUserRatings = async () => {
    try {
      const { data, error } = await supabase
        .from("rating")
        .select(
          `
          *,
          universities:universityid (name)
        `
        )
        .eq("studentid", user.id);

      if (error) {
        console.error("Error fetching ratings:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error in fetchUserRatings:", error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ratingsData, universitiesData] = await Promise.all([
        fetchUserRatings(),
        getUniversities(),
      ]);
      setRatings(ratingsData || []);
      setUniversities(universitiesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRatings([]);
      setUniversities([]);
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

  const handleEditClick = (rating) => {
    setEditingRating(rating);
    setEditComment(rating.ratingcomment);
  };

  const handleCancelEdit = () => {
    setEditingRating(null);
    setEditComment("");
  };

  const handleSaveEdit = async (ratingId) => {
    try {
      const { data, error } = await supabase
        .from("rating")
        .update({ ratingcomment: editComment })
        .eq("ratingid", ratingId)
        .select()
        .single();

      if (error) throw error;

      // Update the ratings list with the edited comment
      setRatings(
        ratings.map((r) =>
          r.ratingid === ratingId ? { ...r, ratingcomment: editComment } : r
        )
      );

      setEditingRating(null);
      setEditComment("");
      alert("Review updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("rating")
        .delete()
        .eq("ratingid", ratingId);

      if (error) throw error;

      // Remove the deleted rating from the list
      setRatings(ratings.filter((r) => r.ratingid !== ratingId));
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
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
                <div className="flex gap-2">
                  {editingRating?.ratingid === rating.ratingid ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(rating.ratingid)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(rating)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRating(rating.ratingid)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
                {editingRating?.ratingid === rating.ratingid ? (
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
                    maxLength="250"
                  />
                ) : (
                  <p className="text-gray-900">{rating.ratingcomment}</p>
                )}
                {editingRating?.ratingid === rating.ratingid && (
                  <div className="flex justify-end mt-2">
                    <span className="text-sm text-gray-500">
                      {editComment.length}/250 characters
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't submitted any university reviews yet. Share your
            experience to help other students make informed decisions!
          </p>
          <Link
            to="/client-universities"
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Star className="w-5 h-5 mr-2" />
            Write Your First Review
          </Link>
        </div>
      )}
    </div>
  );
};

export default Account;
