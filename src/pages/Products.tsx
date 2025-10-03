import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const Products: React.FC = () => {
  const navigate = useNavigate();
    const products = [ 
    {
      id: 1,
      name: 'MediLearn Web Demo',
      description: 'Try our interactive tools directly in your browser.',
      price: 'Free',
      period: 'Demo',
      features: [
        '3D Brain and Heart Viewer',
        'Zoom, Rotate & Explore Tools',
        'Label Hover and Info Panels',
        'Web-Based Chat Assistant',
        'No Installation Needed',
        'Compatible with All Devices',
      ],
      recommended: false,
      cta: 'Try Web Demo',
      link: '/features'
    },
    {
      id: 2,
      name: 'MediLearn VR Experience',
      description: 'Immersive anatomical exploration in virtual reality.',
      price: 'Available',
      period: 'on request',
      features: [
        'Interactive 3D Organ Disassembly',
        'Controller-Based Navigation',
        'Real-Time Labeling & Highlighting',
        'Oculus Quest 2 / Meta XR Compatible',
        'Voice-Assisted AI Tutor',
        'Ideal for Classrooms & Labs',
      ],
      recommended: true,
      cta: 'Launch VR App',
      link: 'https://maiegypt.my.canva.site/coming-soooon',
      external: true
    },    
    {
      id: 3,
      name: 'MediLearn AI Mobile',
      description: 'Your AI-powered medical tutor on the go.',
      price: 'Free',
      period: 'Download',
      features: [
        'AI Chatbot for Medical Q&A',
        'iOS and Android Support',
        'Contextual Study Recommendations',
        'Medical Condition Explanations',
        'Built for Mobility and Speed',
      ],
      recommended: false,
      cta: 'Download Now',
      link: '/DownloadAppPage'
    }
 
  ];

  return (
    <div>
      <section className="pt-20 py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Products</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover our range of innovative medical education solutions designed to enhance learning through interactive technology.
          </p>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Choose Your way</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select the package that best fits your learning needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`${
                  product.recommended 
                    ? 'border-2 border-blue-500 transform scale-105' 
                    : 'border border-gray-200'
                } transition-all duration-300 hover:shadow-xl`}
              >
                {product.recommended && (
                  <div className="bg-blue-500 text-white text-center py-2 font-medium">
                    Recommended
                  </div>
                )}
                <CardHeader className="text-center">
                  <h3 className="text-2xl font-bold text-blue-900">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                </CardHeader>
                <CardContent className="text-center border-t border-b border-gray-100 py-8">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-900">{product.price}</span>
                    {product.period && (
                      <span className="text-gray-500 ml-2">{product.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="text-green-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="text-center">
                <Button 
                    variant={product.recommended ? 'primary' : 'outline'} 
                    fullWidth
                    icon={<ArrowRight size={16} />}
                    onClick={() => {
                      if (product.external) {
                        window.open(product.link, '_blank');
                      } else {
                        navigate(product.link);
                      }
                    }}
                  >
                    {product.cta}
                  </Button>

                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Product Details</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the immersive, intelligent, and accessible experiences offered across our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">MediLearn VR Experience</h3>
            <p className="text-gray-600 mb-6">
              Dive into a new dimension of anatomy learning. MediLearn VR enables full-scale disassembly of human organs in an interactive VR environment, complete with AI-powered voice explanations and intuitive controls.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">Interactive organ disassembly and assembly</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">Real-time highlighting and educational overlays</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">AI tutor integrated with Meta Quest controls</span>
              </li>
            </ul>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-64 md:h-96 rounded-lg"
              src="https://www.youtube.com/embed/E-hqM-S5SSo?si=qy8iIecaVSDYkjjb"
              title="VR App Teaser"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 relative">
            <img 
              src="/assets/Purple App Phone Mockup Sales Marketing Presentation.png"
              alt="AI Chatbot App" 
              className="rounded-lg shadow-lg relative z-10"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">MediLearn AI Mobile</h3>
            <p className="text-gray-600 mb-6">
              Never study alone again. MediLearn AI Mobile delivers smart answers to your medical questions anytime, anywhere — built for mobile-first learning with offline-ready tools.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">AI Chatbot for clinical & academic topics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">Native iOS and Android compatibility</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">Personalized study recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">MediLearn Web Demo</h3>
            <p className="text-gray-600 mb-6">
              Explore our interactive medical tools instantly through your browser. No installs, no delays — just hands-on anatomical learning and AI-powered assistance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">3D Brain and Heart model explorer</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">Zoom, rotate, hover labels and panels</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-1" />
                <span className="ml-3 text-gray-700">Instant access with no login or setup</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src="/assets/web-demo-preview.png" 
              alt="Web Demo" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Medical Education?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of medical students and professionals who are already enhancing their learning with MediLearn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-700"
              onClick={() => {
                navigate('/features');
              }}
            >
              Try Our Features
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-blue-800"
              onClick={() => {
                navigate('/contact');
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

export default Products;