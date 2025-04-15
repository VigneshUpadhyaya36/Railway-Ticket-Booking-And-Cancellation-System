
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrain } from '@/services/trainService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/train/BookingForm';
import { ArrowLeft, Clock, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Train } from '@/types/railBooker';

const BookingDetail = () => {
  const { trainId } = useParams();
  const [searchParams] = useSearchParams();
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const { data: train, isLoading, error } = useQuery({
    queryKey: ['train', trainId],
    queryFn: () => getTrain(trainId as string),
    enabled: !!trainId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-railway-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !train) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-md">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>Failed to load train details. Please try again later.</p>
            <Link to="/trains">
              <Button className="mt-4">Return to Train Listing</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/trains" className="inline-flex items-center text-railway-600 hover:text-railway-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to train listing
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">{train.name}</h1>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Train Number</p>
              <p className="font-medium">{train.number}</p>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{train.date}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>{passengers} Passenger(s)</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-1 mb-4 md:mb-0">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold">{train.departureTime}</p>
                  <p className="text-gray-500">{train.origin}</p>
                </div>
                <div className="mx-4 text-gray-400 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                  <Clock className="h-4 w-4 mx-1" />
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold">{train.arrivalTime}</p>
                  <p className="text-gray-500">{train.destination}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{train.duration || "Unknown"} journey</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Price per person</p>
              <p className="text-2xl font-bold">₹{train.price}</p>
            </div>
          </div>
        </div>
        
        <BookingForm train={train} passengers={passengers} />
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingDetail;
