import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Star, Users, TrendingUp, ChevronLeft, ChevronRight, Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, useScroll, useTransform } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const testimonialsRef = useRef<HTMLElement | null>(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -45]);
  
  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Handle hash links on page load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetElement = document.querySelector(hash) as HTMLElement;
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 100);
        }
      }
    };

    // Handle initial hash
    handleHashChange();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const features = [
    {
      icon: <Users className="h-12 w-12 text-white" />,
      title: 'Community Network',
      description: 'Connect with young entrepreneurs from around the world',
      details: "Join a vibrant community of like-minded kidpreneurs. Share ideas, collaborate on projects, and build lasting friendships while learning from each other's experiences."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-white" />,
      title: 'Business Mentorship',
      description: 'Get guidance from experienced mentors and successful entrepreneurs',
      details: 'Access one-on-one mentorship sessions with industry experts who understand the unique challenges of young entrepreneurs. Learn practical skills and gain valuable insights.'
    },
    {
      icon: <Star className="h-12 w-12 text-white" />,
      title: 'Startup Showcase',
      description: 'Display your startup ideas and get feedback from the community',
      details: 'Present your business ideas in our startup showcase. Get constructive feedback, find potential co-founders, and attract early supporters for your venture.'
    }
  ];
  const testimonials = [
    {
      name: 'Emma Thompson',
      age: 14,
      startup: 'EcoKids',
      content: 'Solace helped me connect with mentors who guided me through launching my eco-friendly product line. The community support has been incredible!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Alex Rodriguez',
      age: 16,
      startup: 'TechTutors',
      content: "The mentorship program at Solace gave me the confidence to start my tutoring app. Now it's being used by students in three different schools!",
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Sophia Chen',
      age: 15,
      startup: 'ArtisanCrafts',
      content: "I found my co-founder through Solace! Together we've built a platform that helps young artists sell their handmade crafts online.",
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const nextTestimonial = () => setCurrentTestimonial((p) => (p + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/30 via-gray-900/70 to-gray-900 pointer-events-none"></div>

      {/* Background decorative elements - updated for dark theme */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-900 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <nav className="bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/30 fixed w-full top-0 z-50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75"></div>
                <Rocket className="h-8 w-8 text-white relative transform hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Solace</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection(aboutRef)} className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">About</button>
              <button onClick={() => scrollToSection(featuresRef)} className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">Features</button>
              <Link to="/startups" className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">Startups</Link>
              <button onClick={() => scrollToSection(testimonialsRef)} className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">Testimonials</button>
              {user ? (
                <Link to="/dashboard" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link to="/login" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25">Sign In</Link>
              )}
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                {isMenuOpen ? <X className="h-6 w-6 text-gray-300" /> : <Menu className="h-6 w-6 text-gray-300" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-700/50 py-4 bg-gray-900/90 backdrop-blur-md rounded-lg mt-2">
              <div className="flex flex-col space-y-4">
                <button onClick={() => { scrollToSection(aboutRef); setIsMenuOpen(false); }} className="text-gray-300 hover:text-purple-400 px-4 py-2 rounded-lg hover:bg-gray-800/50 text-left">About</button>
                <button onClick={() => { scrollToSection(featuresRef); setIsMenuOpen(false); }} className="text-gray-300 hover:text-purple-400 px-4 py-2 rounded-lg hover:bg-gray-800/50 text-left">Features</button>
                <Link to="/startups" className="text-gray-300 hover:text-purple-400 px-4 py-2 rounded-lg hover:bg-gray-800/50">Startups</Link>
                <button onClick={() => { scrollToSection(testimonialsRef); setIsMenuOpen(false); }} className="text-gray-300 hover:text-purple-400 px-4 py-2 rounded-lg hover:bg-gray-800/50 text-left">Testimonials</button>
                {user ? (
                  <Link to="/dashboard" className="mx-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-center shadow-lg">Dashboard</Link>
                ) : (
                  <Link to="/login" className="mx-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-center shadow-lg">Sign In</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <motion.section ref={heroRef} className="min-h-screen pt-16 pb-12 px-4 flex items-center justify-center relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-16 w-16 text-yellow-400 filter drop-shadow-lg animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.38, ease: [0.22, 0.9, 0.39, 1] }}
            style={{ y: yTitle }}
          >
            Solace
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.46, ease: [0.22, 0.9, 0.39, 1] }}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Empowering young entrepreneurs to build, connect, and grow their dreams into reality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group">
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <button onClick={() => scrollToSection(aboutRef)} className="border-2 border-purple-600 text-purple-400 px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-600 hover:text-white transition-all backdrop-blur-sm bg-gray-800/30">Learn More</button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section ref={aboutRef} id="about" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }} className="min-h-screen py-20 px-4 flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">About Solace</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Solace is more than just a community—it's a launchpad for the next generation of entrepreneurs. We believe that age is just a number when it comes to innovation and business success.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 mb-6">To provide young entrepreneurs with the tools, community, and mentorship they need to transform their ideas into successful businesses. We're building a world where young minds can flourish and create positive change.</p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300">Expert mentorship from successful entrepreneurs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300">Collaborative community of young innovators</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300">Resources and tools to build real businesses</span>
                </li>
              </ul>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="rounded-2xl shadow-lg overflow-hidden border-2 border-gray-700/50">
              <div className="relative">
                <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Young entrepreneurs collaborating" className="w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section ref={featuresRef} id="features" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }} className="min-h-screen py-20 px-4 flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">Why Choose Solace?</h2>
            <p className="text-xl text-gray-300">Discover the tools and community that will accelerate your entrepreneurial journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.46, delay: index * 0.12, ease: [0.22, 0.9, 0.39, 1] }} className="flip-card h-96">
                <div className="flip-card-inner rounded-2xl shadow-lg">
                  <div className="flip-card-front bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center rounded-2xl">
                    <div className="mb-6 bg-white/20 p-4 rounded-full backdrop-blur-sm">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
                    <p className="text-purple-100 text-center">{feature.description}</p>
                  </div>
                  <div className="flip-card-back bg-gray-800/90 backdrop-blur-md p-8 flex flex-col items-center justify-center rounded-2xl border border-gray-700/50">
                    <h3 className="text-xl font-bold mb-4 text-white text-center">{feature.title}</h3>
                    <p className="text-gray-300 text-center">{feature.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section ref={testimonialsRef} id="testimonials" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }} className="min-h-screen py-20 px-4 flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">Success Stories</h2>
            <p className="text-xl text-gray-300">Hear from young entrepreneurs who've found their path through Solace</p>
          </div>

          <div className="relative">
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 text-center border border-gray-700/50 shadow-lg">
              <div className="relative inline-block">
                <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-4 border-gray-700 shadow-lg" />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <blockquote className="text-lg text-gray-300 mb-6 italic relative">
                <div className="absolute -top-4 -left-4 text-4xl text-purple-500 opacity-50">"</div>
                {testimonials[currentTestimonial].content}
                <div className="absolute -bottom-4 -right-4 text-4xl text-purple-500 opacity-50">"</div>
              </blockquote>
              <div>
                <div className="font-bold text-white">{testimonials[currentTestimonial].name}</div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Age {testimonials[currentTestimonial].age} • Founder of {testimonials[currentTestimonial].startup}</div>
              </div>
            </div>

            <button onClick={prevTestimonial} className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gray-800/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:shadow-xl btn-hover border border-gray-700/50">
              <ChevronLeft className="h-6 w-6 text-gray-300" />
            </button>

            <button onClick={nextTestimonial} className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gray-800/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:shadow-xl btn-hover border border-gray-700/50">
              <ChevronRight className="h-6 w-6 text-gray-300" />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentTestimonial ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'}`} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Glossy Footer Container - Centered with working links */}
      <footer className="py-12 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-gray-700/50 p-8 text-center">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Solace</span>
              </div>
              <p className="text-gray-400 max-w-md">Empowering the next generation of entrepreneurs to build amazing businesses.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-purple-400 transition-all hover:underline">About</button></li>
                  <li><button onClick={() => scrollToSection(featuresRef)} className="hover:text-purple-400 transition-all hover:underline">Features</button></li>
                  <li><Link to="/startups" className="hover:text-purple-400 transition-all hover:underline">Startups</Link></li>
                  <li><button onClick={() => scrollToSection(testimonialsRef)} className="hover:text-purple-400 transition-all hover:underline">Testimonials</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Account</h4>
                <ul className="space-y-2 text-gray-400">
                  {user ? (
                    <>
                      <li><Link to="/dashboard" className="hover:text-purple-400 transition-all hover:underline">Dashboard</Link></li>
                      <li><Link to="/profile" className="hover:text-purple-400 transition-all hover:underline">Profile</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/login" className="hover:text-purple-400 transition-all hover:underline">Sign In</Link></li>
                      <li><Link to="/signup" className="hover:text-purple-400 transition-all hover:underline">Register</Link></li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Solace. All rights reserved. Built for young entrepreneurs, by young entrepreneurs.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};