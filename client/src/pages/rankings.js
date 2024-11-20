import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import DropDown from "../components/dropdown";

function Rankings() {
  const { id } = useParams(); // Get the university ID from the URL
  const [rankings, setRankings] = useState(null); // State to store rankings (single university)
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/universities/${id}/averages`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rankings");
        }
        const data = await response.json();
        setRankings(data); // Store the averages data in state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchRankings();
  }, [id]); // Only run when `id` changes

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  // If no rankings data, return a message
  if (!rankings) {
    return <div>No data available for this university</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-between mt-12 ml-20 mr-20">
        <h1 className="text-2xl font-bold">Rankings</h1>
        <DropDown />
      </div>
      <div className="mt-8 ml-20 mr-20">
        <div className="border p-4 rounded-md shadow-md">
          <div className="mt-2 space-y-1">
            <p>
              <span className="font-bold">Student Life:</span>{" "}
              {rankings.AvgStudentLife.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">Classes and Teachers:</span>{" "}
              {rankings.AvgClassesTeachers.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">Cost:</span>{" "}
              {rankings.AvgCost.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">Return on Investment:</span>{" "}
              {rankings.AvgReturnOnInvestment.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">Dining and Food:</span>{" "}
              {rankings.AvgDiningFood.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">Dorms and Housing:</span>{" "}
              {rankings.AvgDormsHousing.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">Health and Safety:</span>{" "}
              {rankings.AvgHealthSafety.toFixed(1)}
            </p>
            <p>
              <span className="font-bold">City Setting:</span>{" "}
              {rankings.AvgCitySetting.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Rankings;
