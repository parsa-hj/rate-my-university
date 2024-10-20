import React from "react";
import Navbar from "../components/navbar";

function About() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl text-center mt-20">
          <h1 className="text-3xl font-bold mb-6">About Rate My University</h1>
          <p className="text-lg text-gray-700">
            The project aims to build an application called{" "}
            <strong>Rate My University</strong>, where students can rate and
            review their universities based on various categories such as
            academic quality, campus facilities, social life, etc. Unlike
            traditional institutional rankings, this platform provides real-time
            feedback from students with direct experience with their
            universities. The ratings will help prospective students make
            informed decisions about where to study and give universities direct
            feedback on areas of improvement.
          </p>
          <p className="text-lg text-gray-700 my-4">
            A database system is crucial to manage various entities such as
            students, universities, ratings, and categories. It ensures that
            user data is properly stored and retrieved, allowing students to
            post their ratings, comments, and reviews. The database will also
            allow for complex queries, such as filtering ratings by category or
            student demographics and displaying results for university rankings.
            Each student can only rate the university once, which will also be
            managed through the database.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
