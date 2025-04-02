
import React from 'react';
import SearchForm from '@/components/train/SearchForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TrainFront, Map, CreditCard, CalendarCheck } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-railway-700 to-railway-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Train Tickets Made Easy</h1>
            <p className="text-xl opacity-90">Fast, convenient, and hassle-free train booking experience</p>
          </div>
          <SearchForm />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RailBooker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-railway-50 p-4 inline-flex rounded-full mb-4">
                <TrainFront className="h-8 w-8 text-railway-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Extensive Network</h3>
              <p className="text-gray-600">Access to all trains across the country with real-time availability.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-railway-50 p-4 inline-flex rounded-full mb-4">
                <Map className="h-8 w-8 text-railway-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Route Tracking</h3>
              <p className="text-gray-600">Live train tracking and journey updates for your peace of mind.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-railway-50 p-4 inline-flex rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-railway-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with secure and encrypted transactions.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-railway-50 p-4 inline-flex rounded-full mb-4">
                <CalendarCheck className="h-8 w-8 text-railway-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Instant Confirmation</h3>
              <p className="text-gray-600">Quick booking process with instant confirmation and e-tickets.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-railway-100 rounded-full flex items-center justify-center text-railway-600 font-bold">
                  RS
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Rahul Singh</h3>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600">"The booking process is so smooth and intuitive. I love how I can quickly check train timings and book my tickets in minutes."</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-railway-100 rounded-full flex items-center justify-center text-railway-600 font-bold">
                  AP
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Anjali Patel</h3>
                  <p className="text-sm text-gray-500">Regular Commuter</p>
                </div>
              </div>
              <p className="text-gray-600">"The e-ticket system makes traveling so much easier. No more standing in long queues. Highly recommend RailBooker!"</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-railway-100 rounded-full flex items-center justify-center text-railway-600 font-bold">
                  VK
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Vikram Kumar</h3>
                  <p className="text-sm text-gray-500">Family Traveler</p>
                </div>
              </div>
              <p className="text-gray-600">"Planning family trips has never been easier. The interface is user-friendly, and customer support is excellent when needed."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-railway-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Book Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Experience the easiest way to book train tickets online. Start your journey with RailBooker today.</p>
          <div className="flex flex-wrap justify-center">
            <a href="/trains" className="bg-white text-railway-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium text-lg mr-4 mb-4">Search Trains</a>
            <a href="#" className="bg-transparent border-2 border-white hover:bg-white hover:text-railway-600 px-8 py-3 rounded-md font-medium text-lg mb-4 transition-colors duration-200">Learn More</a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
