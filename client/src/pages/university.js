import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Navbar from "../components/navbar";

function University() {
  const { id } = useParams(); // Get the university ID from the URL
  const [university, setUniversity] = useState(null); // State to store university data

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
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Cost:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Dining and Food:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Dorms and Housing:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Classes and Teachers:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Return on Investment:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Health and Safety:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">City Setting:</span>
            <span className="ml-2 text-xl font-semibold">4.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default University;
