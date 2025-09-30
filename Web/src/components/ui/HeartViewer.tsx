import React from 'react';

const HeartViewer: React.FC = () => {
  return (
    <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
      <iframe
        src="/heart-wrapper.html"
        title="3D Heart Viewer" // Changed title for clarity
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
};

export default HeartViewer;