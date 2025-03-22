import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewsAndRatings = () => {
  const [userRating, setUserRating] = useState(0);

  const handleRating = (rating :any) => {
    setUserRating(rating);
  };

  const recentRatings = [3.0, 4.0, 1.0, 5.0, 2.0, 1.0, 1.0, 5.0];

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6  mx-auto mt-8">
      {/* Reviews Header */}
      <h2 className="text-lg font-bold mb-4">Reviews & Ratings</h2>

      {/* Overall Rating Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="bg-green-500 text-white rounded-md px-4 py-2 text-2xl font-bold">
            4.2
          </div>
          <span className="text-sm text-gray-500">813 Ratings</span>
        </div>
        <p className="text-sm text-gray-500">
          JD rating index based on 813 ratings across the web
        </p>
      </div>

      {/* Start Your Review Section */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Start your Review</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`text-3xl ${
                userRating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              <FaStar />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Rating Trend */}
      <div>
        <h3 className="text-md font-semibold mb-2">Recent rating trend</h3>
        <div className="flex flex-wrap items-center space-x-2">
          {recentRatings.map((rating, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
            >
              <span>{rating.toFixed(1)}</span>
              <FaStar className="text-orange-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsAndRatings;
