import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gold/20 rounded-full"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
