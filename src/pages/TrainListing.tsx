
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getTrains } from '@/services/trainService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchForm from '@/components/train/SearchForm';
import TrainCard from '@/components/train/TrainCard';
import { Train } from '@/types/railBooker';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

const TrainListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const passengers = searchParams.get('passengers') || '1';
  const [showSearchTip, setShowSearchTip] = useState(true);
  
  const { data: trains, isLoading, error } = useQuery({
    queryKey: ['trains', origin, destination, date],
    queryFn: () => getTrains({ origin, destination, date }),
  });

  // Show search tip when no origin/destination is provided
  useEffect(() => {
    if ((!origin || !destination) && showSearchTip) {
      // Fixed typing error by using JSX directly instead of a function component
      toast(
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Search for Trains</h3>
            <p className="text-sm text-gray-600">
              Use the search form to find trains between stations. Enter origin, destination and travel date.
            </p>
            <button
              className="text-sm text-railway-600 mt-2"
              onClick={() => {
                setShowSearchTip(false);
                toast.dismiss();
              }}
            >
              Don't show again
            </button>
          </div>
        </div>,
        {
          duration: 8000,
          id: 'search-tip',
        }
      );
    }
  }, [origin, destination, showSearchTip]);

  // Handle search form submissions
  const handleSearch = (searchData: { origin: string; destination: string; date: string }) => {
    navigate(`/trains?origin=${searchData.origin}&destination=${searchData.destination}&date=${searchData.date}`);
  };

  // Show title based on search params
  const getPageTitle = () => {
    if (origin && destination) {
      return `Trains from ${origin} to ${destination}`;
    }
    if (origin) {
      return `Trains from ${origin}`;
    }
    if (destination) {
      return `Trains to ${destination}`;
    }
    return "All Available Trains";
  };

  // Function to transform Train to match TrainCard requirements
  const mapTrainToCardFormat = (train: Train) => {
    return {
      ...train,
      duration: train.duration || "Unknown" // Provide fallback for duration
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <SearchForm 
            onSearch={handleSearch}
            origin={origin} 
            destination={destination} 
            date={date} 
          />
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{getPageTitle()}</h1>
          <p className="text-gray-500">{date ? date : 'All dates'} · {passengers} Passenger(s)</p>
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
              <TrainCard key={train.id} train={mapTrainToCardFormat(train)} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TrainListing;
