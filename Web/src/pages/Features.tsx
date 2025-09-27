import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, MessageSquare, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import BrainModel from '../features/BrainModel';
import HeartModel from '../features/HeartModel';
import AiChatbot from '../features/AiChatbot';

const Features: React.FC = () => {
  const [showBrainModel, setShowBrainModel] = useState(false);
    const [showHeartModel , setShowHeartModel]= useState(false)
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
      const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How accurate are the 3D models?",
      answer: "Our 3D models are created based on real anatomical data and are reviewed by medical professionals to ensure accuracy. They are designed to be educational tools that represent standard anatomy, though individual variations exist in real human bodies."
    },
    {
      question: "Can I use these features on mobile devices?",
      answer: "Yes, all our features are designed to be responsive and work on mobile devices. However, for the best experience with 3D models, we recommend using a device with a larger screen."
    },
    {
      question: "How is the AI chatbot trained?",
      answer: "Our AI chatbot is trained on a large dataset of medical literature, textbooks, and clinical guidelines. It is designed to provide evidence-based information on medical topics, though it should not replace professional medical advice."
    },
    {
      question: "Can I download the 3D models for offline use?",
      answer: "Currently, the 3D models are only available for online viewing. However, subscribers to our Pro and Institution plans can export certain views and annotations for educational purposes."
    },
    {
      question: "Are regular updates made to the content?",
      answer: "Yes, we regularly update our 3D models and AI knowledge base to reflect the latest medical understanding and to add new features based on user feedback."
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="pt-20 py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Try Our Features</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Experience our interactive medical education tools firsthand. Explore 3D models and interact with our AI assistant.
          </p>
        </div>
      </section>
      
      {/* Brain Model Section */}
      <section id="brain" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900">3D Brain Model</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Explore the human brain in interactive 3D. Rotate, zoom, and examine different regions with detailed annotations.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Click and drag to rotate the model</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Use scroll wheel to zoom in and out</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Hover over annotations to learn more(Coming Soon....)</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                onClick={() => {
                  window.history.pushState({}, '', '/products');
                  window.dispatchEvent(new CustomEvent('locationchange', { detail: '/products' }));
                }}
              >
                Try Full Version
              </Button>          </div>
            <div className="relative">
                {!showBrainModel ? (
                  <button onClick={() => setShowBrainModel(true)} className="w-full">
                    <img
                      src="/assets/Brain.png" // 👈 your preview image here
                      alt="Click to load 3D brain"
                      className="rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                    />
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg font-semibold">
                      Click to load 3D Brain Model
                    </div> */}
                  </button>
                ) : (
                  <BrainModel className="shadow-lg" />
                )}
              </div>

          </div>
        </div>
      </section>
      
      {/* Heart Model Section */}
      <section id="heart" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
                {!showHeartModel ? (
                  <button onClick={() => setShowHeartModel(true)} className="w-full">
                    <img
                      src="/assets/Heart.png" // 👈 your preview image here
                      alt="Click to load 3D brain"
                      className="rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                    />
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg font-semibold">
                      Click to load 3D Brain Model
                    </div> */}
                  </button>
                ) : (
                  <HeartModel className="shadow-lg" />
                )}
              </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900">3D Heart Model</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Visualize the human heart in detailed 3D. Examine chambers, valves, and blood flow with interactive features.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Interact with a realistic heart model</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Learn about blood flow and cardiac cycles</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Study cardiac anatomy with detailed labels (coming Soon....)</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                onClick={() => {
                  window.history.pushState({}, '', '/products');
                  window.dispatchEvent(new CustomEvent('locationchange', { detail: '/products' }));
                }}
              >
                Try Full Version
              </Button>             </div>
          </div>
        </div>
      </section>
      
      {/* AI Chatbot Section */}
      <section id="chatbot" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900">Medical AI Chatbot</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Get instant answers to medical questions with our AI-powered chatbot trained on medical literature.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Ask questions about medical concepts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Receive evidence-based explanations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">Enhance your study sessions with AI support</p>
                  </div>
                </div>
              </div>
              <Button size="lg" onClick={() => window.location.href = '/DownloadAppPage'}>
                Get Mobile App
              </Button>
            </div>

            {/* ✅ Wrap the AiChatbot in a fixed-height container */}
            <div className="max-h-[500px] overflow-hidden">
                <div className="w-full max-w-[500px] h-[500px] overflow-hidden">
                  <AiChatbot className="h-full" />
                </div>


              </div>
          </div>
        </div>
      </section>

      
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our features and how to get the most out of them.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-blue-900 text-left">{faq.question}</span>
                  {activeFaq === index ? (
                    <Minus className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-blue-600" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="bg-white p-4 rounded-b-lg shadow-sm mt-1">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Medical Education?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Get full access to all features and take your learning to the next level with MediLearn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-700"
              onClick={() => {
                window.history.pushState({}, '', '/products');
                window.dispatchEvent(new CustomEvent('locationchange', { detail: '/products' }));
              }}
            >
              View Pricing Plans
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-blue-600"
              onClick={() => {
                window.history.pushState({}, '', '/contact');
                window.dispatchEvent(new CustomEvent('locationchange', { detail: '/contact' }));
              }}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;