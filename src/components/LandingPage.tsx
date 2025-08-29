import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Star, Users, TrendingUp, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { User } from '../types';
import { getAuthCookie } from '../utils/auth';

export const LandingPage: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setAnimationStarted(true);
    const savedUser = getAuthCookie();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const features = [
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: "Community Network",
      description: "Connect with young entrepreneurs from around the world",
      details: "Join a vibrant community of like-minded kidpreneurs. Share ideas, collaborate on projects, and build lasting friendships while learning from each other's experiences."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-blue-600" />,
      title: "Business Mentorship",
      description: "Get guidance from experienced mentors and successful entrepreneurs",
      details: "Access one-on-one mentorship sessions with industry experts who understand the unique challenges of young entrepreneurs. Learn practical skills and gain valuable insights."
    },
    {
      icon: <Star className="h-12 w-12 text-green-600" />,
      title: "Startup Showcase",
      description: "Display your startup ideas and get feedback from the community",
      details: "Present your business ideas in our startup showcase. Get constructive feedback, find potential co-founders, and attract early supporters for your venture."
    }
  ];

  const testimonials = [
    {
      name: "Emma Thompson",
      age: 14,
      startup: "EcoKids",
      content: "Solace helped me connect with mentors who guided me through launching my eco-friendly product line. The community support has been incredible!",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Alex Rodriguez",
      age: 16,
      startup: "TechTutors",
      content: "The mentorship program at Solace gave me the confidence to start my tutoring app. Now it's being used by students in three different schools!",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Sophia Chen",
      age: 15,
      startup: "ArtisanCrafts",
      content: "I found my co-founder through Solace! Together we've built a platform that helps young artists sell their handmade crafts online.",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold gradient-text">Solace</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-all">About</a>
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-all">Features</a>
              <Link to="/startups" className="text-gray-700 hover:text-purple-600 transition-all">Startups</Link>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-all">Testimonials</a>
              {user ? (
                <Link to="/dashboard" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 btn-hover">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 btn-hover">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#about" className="text-gray-700 hover:text-purple-600 px-4">About</a>
                <a href="#features" className="text-gray-700 hover:text-purple-600 px-4">Features</a>
                <Link to="/startups" className="text-gray-700 hover:text-purple-600 px-4">Startups</Link>
                <a href="#testimonials" className="text-gray-700 hover:text-purple-600 px-4">Testimonials</a>
                {user ? (
                  <Link to="/dashboard" className="mx-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-center">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className="mx-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-center">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            {animationStarted && (
              <>
                <Rocket className={`h-24 w-24 mx-auto text-purple-600 mb-6 ${animationStarted ? 'logo-intro' : ''}`} />
                <h1 className={`text-5xl md:text-7xl font-bold gradient-text mb-6 ${animationStarted ? 'name-fade-in' : ''}`}>
                  Solace
                </h1>
              </>
            )}
          </div>
          
          <div className={animationStarted ? 'content-fade-in' : ''}>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering young entrepreneurs to build, connect, and grow their dreams into reality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-700 btn-hover"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-700 btn-hover"
                  >
                    Start Your Journey
                  </Link>
                  <a
                    href="#about"
                    className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-600 hover:text-white transition-all btn-hover"
                  >
                    Learn More
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Solace</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solace is more than just a community—it's a launchpad for the next generation of entrepreneurs. 
              We believe that age is just a number when it comes to innovation and business success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                To provide young entrepreneurs with the tools, community, and mentorship they need to transform 
                their ideas into successful businesses. We're building a world where young minds can flourish 
                and create positive change.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Expert mentorship from successful entrepreneurs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Collaborative community of young innovators</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Resources and tools to build real businesses</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Young entrepreneurs collaborating"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Solace?</h2>
            <p className="text-xl text-gray-600">
              Discover the tools and community that will accelerate your entrepreneurial journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front bg-white shadow-lg">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  <div className="flip-card-back bg-purple-600 text-white">
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-purple-100">{feature.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600">
              Hear from young entrepreneurs who've found their path through Solace
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 object-cover"
              />
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div>
                <div className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</div>
                <div className="text-purple-600">Age {testimonials[currentTestimonial].age} • Founder of {testimonials[currentTestimonial].startup}</div>
              </div>
            </div>
            
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl btn-hover"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl btn-hover"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold">Solace</span>
              </div>
              <p className="text-gray-400">
                Empowering the next generation of entrepreneurs to build amazing businesses.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-all">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-all">Our Mission</a></li>
                <li><a href="#" className="hover:text-white transition-all">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-all">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-all">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-all">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-all">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-all">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-all">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-all">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-all">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Solace. All rights reserved. Built for young entrepreneurs, by young entrepreneurs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
