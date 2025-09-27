const HeartViewer = () => {
    return (
      <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
        <iframe
          src="/heart-wrapper.html"
          title="3D Brain Viewer"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    );
  };
  
  export default HeartViewer;
  