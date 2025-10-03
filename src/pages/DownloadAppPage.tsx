import React, { useState } from 'react';
import './DownloadAppPage.css';

const screenshots = [
  { src: '/assets/ss1.jpg', title: 'Chat history screen' },
  { src: '/assets/ss2.jpg', title: 'Chatbot feature' },
  { src: '/assets/ss3.jpg', title: 'Settings screen' },
  { src: '/assets/ss4.jpg', title: 'Help screen' },
];

const DownloadAppPage: React.FC = () => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const nextImage = () => {
    if (previewIndex !== null) {
      setPreviewIndex((previewIndex + 1) % screenshots.length);
    }
  };

  const prevImage = () => {
    if (previewIndex !== null) {
      setPreviewIndex((previewIndex - 1 + screenshots.length) % screenshots.length);
    }
  };

  return (
    <main className="container download-page">
      <section className="hero">
        <h1 className="page-title">Download Our Mobile App</h1>
        <p className="page-subtitle">Your AI assistant — anywhere, anytime.</p>
      </section>

      <section className="download-section">
        {/* ✅ MODIFIED: The App Store link is removed, and the Google Play link is updated */}
        <div className="download-links">
          <a href="https://www.mediafire.com/file/3eswj94re6zkaj1/app-release.apk/file" target="_blank" rel="noopener noreferrer">
            <img src="/assets/playstore-badge.png" alt="Get it on Google Play" className="store-badge" />
          </a>
        </div>
      </section>

      <section className="screenshots">
        <h2 className="section-title">App Screenshots</h2>
        <div className="carousel">
          <button className="carousel-button left" onClick={prevImage}>&lt;</button>
          <div className="carousel-track">
            {screenshots.map((item, index) => (
              <div
                key={index}
                className="carousel-slide"
                onClick={() => setPreviewIndex(index)}
              >
                <img src={item.src} alt={item.title} className="carousel-image" />
              </div>
            ))}
          </div>
          <button className="carousel-button right" onClick={nextImage}>&gt;</button>
        </div>
        {previewIndex !== null && (
          <div className="image-lightbox" onClick={() => setPreviewIndex(null)}>
            <div
              className="image-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-arrow left" onClick={prevImage}>
                &lt;
              </button>
              <img
                src={screenshots[previewIndex].src}
                alt="Enlarged Screenshot"
                className="lightbox-image"
              />
              <button className="lightbox-arrow right" onClick={nextImage}>
                &gt;
              </button>
              <button className="lightbox-close" onClick={() => setPreviewIndex(null)}>
                &times;
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="features">
        <h2 className="section-title">Key Features</h2>
        <ul className="feature-list">
          <li><strong>⚡ Fast Answers:</strong> Instant chatbot responses, anytime.</li>
          <li><strong>🧠 Personalized Help:</strong> Advice tailored to your habits and needs.</li>
          <li><strong>📱 Modern UI:</strong> Beautiful, intuitive design built for mobile.</li>
          <li><strong>🔒 Secure:</strong> End-to-end encrypted conversations.</li>
          <li><strong>🌐 Offline Mode:</strong> Use it even with limited internet.</li>
        </ul>
      </section>
    </main>
  );
};

export default DownloadAppPage;