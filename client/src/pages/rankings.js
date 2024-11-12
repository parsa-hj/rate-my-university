import React from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import DropDown from "../components/dropdown";

function Rankings() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-between mt-12 ml-20 mr-20">
        <h1 className="text-2xl font-bold">Rankings</h1>
        <DropDown />
      </div>
      <Footer />
    </div>
  );
}

export default Rankings;
