
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrainFront } from "lucide-react";

export type Train = {
  id: string;
  name: string;
  number: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  date: string;
};

interface TrainCardProps {
  train: Train;
}

const TrainCard: React.FC<TrainCardProps> = ({ train }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Train Basic Info */}
          <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{train.name}</h3>
                <p className="text-sm text-gray-500">{train.number}</p>
              </div>
              <Badge variant="outline" className="bg-railway-50 text-railway-700 border-railway-200">
                {train.availableSeats} seats left
              </Badge>
            </div>
            
            <div className="flex items-center text-sm mb-4">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{train.date}</span>
            </div>
            
            <div className="flex justify-between items-center">
              {/* Departure */}
              <div>
                <p className="text-2xl font-bold">{train.departureTime}</p>
                <p className="text-sm text-gray-500">{train.origin}</p>
              </div>
              
              {/* Journey visualization */}
              <div className="flex-1 mx-4 px-4 relative">
                <div className="h-0.5 bg-gray-300 w-full absolute top-1/2"></div>
                <div className="flex justify-between">
                  <div className="w-3 h-3 rounded-full bg-railway-600 relative z-10"></div>
                  <TrainFront className="w-5 h-5 text-railway-600 relative z-10 -mt-1" />
                  <div className="w-3 h-3 rounded-full bg-railway-800 relative z-10"></div>
                </div>
                <p className="text-xs text-center mt-2 text-gray-500 flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {train.duration}
                </p>
              </div>
              
              {/* Arrival */}
              <div className="text-right">
                <p className="text-2xl font-bold">{train.arrivalTime}</p>
                <p className="text-sm text-gray-500">{train.destination}</p>
              </div>
            </div>
          </div>
          
          {/* Price and Book Button */}
          <div className="p-6 flex flex-col justify-between bg-gray-50 md:w-56">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Price per person</p>
              <p className="text-2xl font-bold">₹{train.price}</p>
            </div>
            <Link to={`/booking/${train.id}`}>
              <Button className="w-full bg-railway-600 hover:bg-railway-700">Book Now</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainCard;
