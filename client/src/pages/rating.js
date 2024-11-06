import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Stars from "../components/starts";

function Rating() {
  const { id } = useParams(); // Get the university ID from the URL
  const [university, setUniversity] = useState(null); // Store university data
  const [loading, setLoading] = useState(false); // Loading state for submission

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
        setUniversity(data); // Update state with fetched data
      } catch (error) {
        console.error("Failed to fetch university data:", error);
      }
    };

    fetchUniversity();
  }, [id]);

  // Submit the rating data to the server
  const handleSubmitRating = async () => {
    // Validate input data
    if (!userComment || userComment.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    const ratingData = {
      UniversityID: id,
      StudentID: 2778866, // Replace with any student ID in the DB
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

    setLoading(true); // Set loading state

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
        // Optionally reset the form here
        resetForm();
      } else {
        const errorText = await response.text(); // Get error message from server
        console.error("Error response:", errorText);
        alert("Failed to submit rating: " + errorText);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
      alert("Failed to submit rating: " + error.message);
    } finally {
      setLoading(false); // Reset loading state
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

  // Loading state for when university data is still being fetched
  if (!university) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-8">
        {/* University Name */}
        <h1 className="text-2xl font-bold mt-8 ml-4">{university.name}</h1>

        {/* Rating Categories */}
        <div className="mt-6 space-y-6 ml-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Student Life</p>
            <Stars
              number={studentLifeScore}
              onChange={setStudentLifeScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Classes and Teachers</p>
            <Stars
              number={classesTeachersScore}
              onChange={setClassesTeachersScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Cost</p>
            <Stars
              number={costScore}
              onChange={setCostScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Return on Investment</p>
            <Stars
              number={roiScore}
              onChange={setRoiScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Dining and Food</p>
            <Stars
              number={diningFoodScore}
              onChange={setDiningFoodScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Dorms and Housing</p>
            <Stars
              number={dormsHousingScore}
              onChange={setDormsHousingScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Health and Safety</p>
            <Stars
              number={healthSafetyScore}
              onChange={setHealthSafetyScore} // Pass onChange function here
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">City and Setting</p>
            <Stars
              number={citySettingScore}
              onChange={setCitySettingScore} // Pass onChange function here
            />
          </div>
        </div>
      </div>

      <div className="ml-11">
        <p className="font-bold text-lg">Write a review</p>
        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="Share your thoughts"
          className="w-96 border p-2 mt-2 rounded-md resize-y h-40"
          maxLength="250"
        />
      </div>

      <button
        onClick={handleSubmitRating}
        className={`bg-[#3256E5] text-white py-2 px-4 rounded-md mt-8 ml-10 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Submitting..." : "Submit Ratings"}
      </button>

      <Footer />
    </div>
  );
}

export default Rating;
