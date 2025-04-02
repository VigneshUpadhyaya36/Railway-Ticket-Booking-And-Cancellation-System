
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getTrains } from '@/services/trainService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchForm from '@/components/train/SearchForm';
import TrainCard from '@/components/train/TrainCard';
import { Train } from '@/types/railBooker';

const TrainListing = () => {
  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const passengers = searchParams.get('passengers') || '1';
  
  const { data: trains, isLoading, error } = useQuery({
    queryKey: ['trains', origin, destination, date],
    queryFn: () => getTrains({ origin, destination, date }),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <SearchForm />
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Trains from {origin} to {destination}</h1>
          <p className="text-gray-500">{date} · {passengers} Passenger(s)</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-railway-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
            <p>Failed to load trains. Please try again later.</p>
          </div>
        ) : trains?.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-md text-center">
            <h3 className="font-medium text-lg mb-2">No trains found</h3>
            <p>Try changing your search criteria or date of travel.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {trains?.map((train: Train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TrainListing;
