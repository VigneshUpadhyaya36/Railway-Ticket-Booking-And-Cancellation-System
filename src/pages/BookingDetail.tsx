
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/train/BookingForm';
import { Card, CardContent } from '@/components/ui/card';
import { Train } from '@/components/train/TrainCard';
import { Calendar, Clock, Users } from 'lucide-react';

// Mock data for trains (same as in TrainListing for consistency)
const mockTrains: Train[] = [
  {
    id: "1",
    name: "Rajdhani Express",
    number: "12301",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "16:55",
    arrivalTime: "08:15",
    duration: "15h 20m",
    price: 1200,
    availableSeats: 42,
    date: "2023-08-15",
  },
  {
    id: "2",
    name: "Shatabdi Express",
    number: "12045",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "06:15",
    arrivalTime: "22:30",
    duration: "16h 15m",
    price: 850,
    availableSeats: 120,
    date: "2023-08-15",
  },
  {
    id: "3",
    name: "Duronto Express",
    number: "12213",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "23:00",
    arrivalTime: "15:20",
    duration: "16h 20m",
    price: 1450,
    availableSeats: 25,
    date: "2023-08-15",
  },
];

const BookingDetail = () => {
  const { trainId } = useParams<{ trainId: string }>();
  const [searchParams] = useSearchParams();
  const passengers = searchParams.get('passengers') || '1';
  const [train, setTrain] = useState<Train | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch train details
    setTimeout(() => {
      const foundTrain = mockTrains.find(t => t.id === trainId) || null;
      setTrain(foundTrain);
      setLoading(false);
    }, 500);
  }, [trainId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading train details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Train Not Found</h2>
            <p className="text-gray-600">The train you are looking for does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Journey</h1>
          <p className="text-gray-600">Complete your booking details below</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Train summary sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Journey Summary</h2>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">{train.name}</h3>
                  <p className="text-sm text-gray-500">{train.number}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-gray-600">{train.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Departure</p>
                      <p className="text-gray-600">{train.departureTime} • {train.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Arrival</p>
                      <p className="text-gray-600">{train.arrivalTime} • {train.destination}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Passengers</p>
                      <p className="text-gray-600">{passengers} passenger(s)</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Base Fare x {passengers}</span>
                    <span>₹{train.price * Number(passengers)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service Fee</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>₹{train.price * Number(passengers) + 50}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking form */}
          <div className="lg:col-span-3">
            <BookingForm train={train} passengers={Number(passengers)} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingDetail;
