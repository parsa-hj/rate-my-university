import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Stars from "../components/starts";
import { Star, ArrowLeft } from "lucide-react";

function Rating() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define state variables for ratings and comment
  const [studentLifeScore, setStudentLifeScore] = useState(0);
  const [classesTeachersScore, setClassesTeachersScore] = useState(0);
  const [costScore, setCostScore] = useState(0);
  const [roiScore, setRoiScore] = useState(0);
  const [diningFoodScore, setDiningFoodScore] = useState(0);
  const [dormsHousingScore, setDormsHousingScore] = useState(0);
  const [healthSafetyScore, setHealthSafetyScore] = useState(0);
  const [citySettingScore, setCitySettingScore] = useState(0);
  const [userComment, setUserComment] = useState("");

  // Fetch university details based on the ID when component mounts
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/universities/${id}`
        );
        const data = await response.json();
        setUniversity(data);
      } catch (error) {
        console.error("Failed to fetch university data:", error);
      }
    };

    fetchUniversity();
  }, [id]);

  // Submit the rating data to the server
  const handleSubmitRating = async () => {
    if (!userComment || userComment.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    const ratingData = {
      UniversityID: id,
      StudentID: 2778866,
      RatingComment: userComment,
      StudentLife: studentLifeScore,
      ClassesTeachers: classesTeachersScore,
      Cost: costScore,
      ReturnOnInvestment: roiScore,
      DiningFood: diningFoodScore,
      DormsHousing: dormsHousingScore,
      HealthSafety: healthSafetyScore,
      CitySetting: citySettingScore,
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        alert("Rating submitted successfully");
        resetForm();
        navigate(`/client-universities`);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to submit rating: " + errorText);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
      alert("Failed to submit rating: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset form fields after submission
  const resetForm = () => {
    setStudentLifeScore(0);
    setClassesTeachersScore(0);
    setCostScore(0);
    setRoiScore(0);
    setDiningFoodScore(0);
    setDormsHousingScore(0);
    setHealthSafetyScore(0);
    setCitySettingScore(0);
    setUserComment("");
  };

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to University
        </button>

        {/* University Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {university.name}
          </h1>
          <p className="text-gray-600">
            Share your experience with this university
          </p>
        </div>

        {/* Rating Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Rate Your Experience
          </h2>

          {/* Rating Categories */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  Student Life
                </p>
                <Stars
                  number={studentLifeScore}
                  onChange={setStudentLifeScore}
                />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  Classes and Teachers
                </p>
                <Stars
                  number={classesTeachersScore}
                  onChange={setClassesTeachersScore}
                />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">Cost</p>
                <Stars number={costScore} onChange={setCostScore} />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  Return on Investment
                </p>
                <Stars number={roiScore} onChange={setRoiScore} />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  Dining and Food
                </p>
                <Stars number={diningFoodScore} onChange={setDiningFoodScore} />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  Dorms and Housing
                </p>
                <Stars
                  number={dormsHousingScore}
                  onChange={setDormsHousingScore}
                />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  Health and Safety
                </p>
                <Stars
                  number={healthSafetyScore}
                  onChange={setHealthSafetyScore}
                />
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  City and Setting
                </p>
                <Stars
                  number={citySettingScore}
                  onChange={setCitySettingScore}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Write Your Review
          </h2>
          <div className="space-y-4">
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share your thoughts about your experience at this university..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-40"
              maxLength="250"
            />
            <div className="flex justify-end">
              <span className="text-sm text-gray-500">
                {userComment.length}/250 characters
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmitRating}
            disabled={loading}
            className={`inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Star className="w-5 h-5 mr-2" />
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Rating;
