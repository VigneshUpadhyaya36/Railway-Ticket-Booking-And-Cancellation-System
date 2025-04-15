
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Train {
  id: string;
  name: string;
  number: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  price: number;
  availableSeats: number;
  duration: string;
}

interface TrainCardProps {
  train: Train;
  passengers: number;
}

const TrainCard: React.FC<TrainCardProps> = ({ train, passengers = 1 }) => {
  // Format time to ensure it's in HH:MM format
  const formatTime = (time: string) => {
    // If it's already in HH:MM format, return as is
    if (/^\d{1,2}:\d{2}$/.test(time)) return time;
    
    try {
      // Try to parse as a date string
      const date = new Date(`2000-01-01T${time}`);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      // If parsing fails, return original
      return time;
    }
  };

  // Calculate if low seats warning should be shown
  const isLowSeats = train.availableSeats <= 10;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center mb-1">
              <h3 className="text-xl font-bold text-railway-800">{train.name}</h3>
              <Badge className="ml-2 bg-blue-100 text-blue-800">{train.number}</Badge>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{train.date}</span>
            </div>
          </div>
          
          <div className="md:text-right">
            <div className="text-2xl font-bold text-railway-700">₹{train.price}</div>
            <p className="text-sm text-gray-500">per passenger</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
            <div className="text-center">
              <p className="text-xl font-bold">{formatTime(train.departureTime)}</p>
              <p className="text-sm text-gray-500">{train.origin}</p>
            </div>
            
            <div className="flex-grow mx-4 flex flex-col items-center">
              <div className="flex items-center w-full">
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 border border-gray-300">
                  <Clock className="h-3 w-3 text-gray-600" />
                </div>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
              </div>
              <span className="text-sm text-gray-500 mt-1">{train.duration}</span>
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold">{formatTime(train.arrivalTime)}</p>
              <p className="text-sm text-gray-500">{train.destination}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="flex-grow md:flex-grow-0">
              <Badge className={`${
                isLowSeats 
                  ? 'bg-red-100 text-red-800 border-red-200' 
                  : 'bg-green-100 text-green-800 border-green-200'
              } text-sm py-1 px-2 flex items-center justify-center md:justify-start`}>
                <Users className="h-3 w-3 mr-1" />
                {train.availableSeats} seats left
              </Badge>
            </div>
            
            <Link to={`/booking/${train.id}?passengers=${passengers}`} className="flex-shrink-0">
              <Button className="bg-railway-600 hover:bg-railway-700">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;
