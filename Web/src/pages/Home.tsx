import React from 'react';
import { ArrowRight, Brain, Heart, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from '../components/ui/Link';


const Home: React.FC = () => {
  return (
    <div>
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-20 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Revolutionary Medical Education Through Technology
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Experience interactive 3D models and AI-powered learning to enhance your medical knowledge and skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                icon={<ArrowRight size={20} />}
                onClick={() => {
                  window.history.pushState({}, '', '/features');
                  window.dispatchEvent(new CustomEvent('locationchange', { detail: '/features' }));
                }}
              >
                Try Our Features
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => {
                  window.history.pushState({}, '', '/products');
                  window.dispatchEvent(new CustomEvent('locationchange', { detail: '/products' }));
                }}
              >
                Our Products
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ArrowUpRight className="h-8 w-8 rotate-90" />
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Interactive Learning Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our cutting-edge features designed to transform medical education through immersive 3D visualization and AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="transform hover:scale-105 hover:border-blue-500 border-2 border-transparent">
              <CardContent className="text-center py-8">
                <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">3D Brain Model</h3>
                <p className="text-gray-600 mb-6">
                  Explore the human brain in interactive 3D. Rotate, zoom, and identify different regions with detailed annotations.
                </p>
                <Link 
                  to="/features#brain" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  Explore Brain Model <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="transform hover:scale-105 hover:border-blue-500 border-2 border-transparent">
              <CardContent className="text-center py-8">
                <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">3D Heart Model</h3>
                <p className="text-gray-600 mb-6">
                  Visualize the human heart in detailed 3D. Examine chambers, valves, and blood flow with interactive features.
                </p>
                <Link 
                  to="/features#heart" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  Explore Heart Model <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="transform hover:scale-105 hover:border-blue-500 border-2 border-transparent">
              <CardContent className="text-center py-8">
                <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Medical AI Chatbot</h3>
                <p className="text-gray-600 mb-6">
                  Get instant answers to medical questions with our AI-powered chatbot trained on medical literature.
                </p>
                <Link 
                  to="/features#chatbot" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  Try Medical AI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Why Choose MediLearn?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our innovative approach to medical education combines cutting-edge technology with evidence-based learning principles.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-900">Interactive Learning</h3>
                    <p className="text-gray-600">Engage with 3D models that respond to your inputs for deeper understanding.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-900">Evidence-Based</h3>
                    <p className="text-gray-600">All our content is developed by medical professionals and based on current research.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-900">Accessible Anywhere</h3>
                    <p className="text-gray-600">Study on any device, anywhere, with our responsive platform design.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <ArrowRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-900">Continuous Updates</h3>
                    <p className="text-gray-600">We regularly update our content to reflect the latest medical knowledge.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button 
                  size="lg"
                  onClick={() => {
                    window.history.pushState({}, '', '/products');
                    window.dispatchEvent(new CustomEvent('locationchange', { detail: '/products' }));
                  }}
                >
                  Explore Our Products
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-xl transform -rotate-6 z-0"></div>
              <img 
                src="/assets/students-using-medilearn.png"
                alt="Medical students using MediLearn" 
                className="rounded-lg shadow-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Medical Education?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of medical students and professionals who are enhancing their knowledge with MediLearn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50"
              style={{ color: 'black' }}
              onClick={() => {
                window.history.pushState({}, '', '/features');
                window.dispatchEvent(new CustomEvent('locationchange', { detail: '/features' }));
              }}
            >
              Try Our Features Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
              style={{ color: 'black' }}
              onClick={() => {
                window.history.pushState({}, '', '/contact');
                window.dispatchEvent(new CustomEvent('locationchange', { detail: '/contact' }));
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;