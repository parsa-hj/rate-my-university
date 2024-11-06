import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function University() {
  const { id } = useParams(); // Get the university ID from the URL
  const [university, setUniversity] = useState(null); // State to store university data
  const [ratings, setRatings] = useState([]); // State to store ratings

  // Fetch university data when the component mounts
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/universities/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUniversity(data); // Store the university data in state
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    fetchUniversityData();
  }, [id]); // Fetch data when the ID changes

  // Fetch ratings for the university
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/universities/${id}/ratings`
        );
        const data = await response.json();
        console.log(data);
        setRatings(data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [id]);

  // Function to calculate average ratings
  const calculateAverageRatings = () => {
    const averages = {
      StudentLife: 0,
      Cost: 0,
      DiningFood: 0,
      DormsHousing: 0,
      ClassesTeachers: 0,
      ReturnOnInvestment: 0,
      HealthSafety: 0,
      CitySetting: 0,
    };

    if (ratings.length > 0) {
      ratings.forEach((rating) => {
        averages.StudentLife += rating.StudentLife || 0;
        averages.Cost += rating.Cost || 0;
        averages.DiningFood += rating.DiningFood || 0;
        averages.DormsHousing += rating.DormsHousing || 0;
        averages.ClassesTeachers += rating.ClassesTeachers || 0;
        averages.ReturnOnInvestment += rating.ReturnOnInvestment || 0;
        averages.HealthSafety += rating.HealthSafety || 0;
        averages.CitySetting += rating.CitySetting || 0;
      });

      const totalRatings = ratings.length;
      for (const key in averages) {
        averages[key] /= totalRatings; // Calculate the average
      }
    }
    console.log("Calculated averages:", averages);
    return averages;
  };

  const averageRatings = calculateAverageRatings();

  if (!university) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div>
      <Navbar />
      <img
        src={university.image_url}
        alt={university.name}
        className="w-full h-80 object-cover mb-4"
      />
      <h1 className="text-3xl font-bold text-center mb-6 mt-10">
        {university.name}
      </h1>
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
      {/* Display Comments */}
      <div className="mt-20 ml-40">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {ratings.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className="border p-4 rounded-md shadow-md mr-20"
              >
                <p className="text-lg font-medium">Comment:</p>
                <p className="text-gray-700">{rating.RatingComment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default University;
