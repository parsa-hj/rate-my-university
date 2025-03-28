import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { GraduationCap, Users, Database, Star } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Rate My University
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering students to make informed decisions through authentic
            peer reviews and ratings
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Mission Statement */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Rate My University aims to revolutionize how students choose
                their educational institutions by providing authentic, real-time
                feedback from current and former students.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">
                    Student-Centric Approach
                  </h3>
                </div>
                <p className="text-gray-600">
                  Unlike traditional institutional rankings, our platform
                  provides real-time feedback from students with direct
                  experience with their universities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Community-Driven</h3>
                </div>
                <p className="text-gray-600">
                  Join thousands of students who are helping others make
                  informed decisions about their education through honest
                  reviews and ratings.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Database className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">
                    Comprehensive Database
                  </h3>
                </div>
                <p className="text-gray-600">
                  Our robust database system manages various entities including
                  students, universities, ratings, and categories to ensure
                  accurate and reliable information.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Star className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Quality Control</h3>
                </div>
                <p className="text-gray-600">
                  Each student can rate a university once, ensuring fair and
                  balanced reviews while maintaining data integrity.
                </p>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">How It Works</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our platform allows students to rate and review their
                  universities based on various categories such as academic
                  quality, campus facilities, social life, and more.
                </p>
                <p>
                  The ratings help prospective students make informed decisions
                  about where to study and give universities direct feedback on
                  areas of improvement.
                </p>
                <p>
                  Through our database system, we ensure that user data is
                  properly stored and retrieved, enabling complex queries for
                  filtering ratings by category or student demographics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Share Your Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of students and help others make informed
            decisions about their education
          </p>
          <a
            href="/signup"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
