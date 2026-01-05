import React from "react";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/50">
          Dashboard
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
