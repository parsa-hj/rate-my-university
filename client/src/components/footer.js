import React from "react";

function Footer() {
  return (
    <div className="bg-gray-200 mt-20">
      {/* Line above the text */}
      <hr className="border-t border-gray-400 my-3" />

      {/* Footer Text */}
      <div className="flex justify-center py-3">
        <span className="text-gray-700 text-xl">
          2024 Parsa Hajiha All Rights Reserved
        </span>
      </div>
    </div>
  );
}

export default Footer;
