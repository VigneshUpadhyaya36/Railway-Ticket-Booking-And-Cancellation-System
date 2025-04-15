
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { addTrain, updateTrain } from '@/services/trainService';

interface TrainFormProps {
  onSubmit: (trainData: any) => void;
  initialData?: {
    id?: string;
    name: string;
    number: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
    price: string;
    availableSeats: string;
  };
}

const TrainForm: React.FC<TrainFormProps> = ({ onSubmit, initialData }) => {
  const [trainData, setTrainData] = useState({
    name: initialData?.name || '',
    number: initialData?.number || '',
    origin: initialData?.origin || '',
    destination: initialData?.destination || '',
    departureTime: initialData?.departureTime || '',
    arrivalTime: initialData?.arrivalTime || '',
    date: initialData?.date || '',
    price: initialData?.price || '',
    availableSeats: initialData?.availableSeats || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrainData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'number', 'origin', 'destination', 
      'departureTime', 'arrivalTime', 'date', 
      'price', 'availableSeats'
    ];
    
    for (const field of requiredFields) {
      if (!trainData[field]) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(trainData.departureTime)) {
      toast.error("Departure time should be in HH:MM format");
      return false;
    }
    if (!timeRegex.test(trainData.arrivalTime)) {
      toast.error("Arrival time should be in HH:MM format");
      return false;
    }
    
    // Validate numeric fields
    if (isNaN(Number(trainData.price)) || Number(trainData.price) <= 0) {
      toast.error("Price must be a positive number");
      return false;
    }
    if (isNaN(Number(trainData.availableSeats)) || Number(trainData.availableSeats) <= 0) {
      toast.error("Available seats must be a positive number");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (initialData?.id) {
        // Update existing train
        await updateTrain({
          ...trainData,
          id: initialData.id
        });
      } else {
        // Add new train
        await addTrain(trainData);
      }
      
      // Call the onSubmit function passed as prop
      onSubmit(trainData);
      
      // Clear the form if it's a new train submission
      if (!initialData) {
        setTrainData({
          name: '',
          number: '',
          origin: '',
          destination: '',
          departureTime: '',
          arrivalTime: '',
          date: '',
          price: '',
          availableSeats: '',
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while saving the train");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit Train' : 'Add New Train'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Train Name</Label>
              <Input
                id="name"
                name="name"
                value={trainData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Chennai Express"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Train Number</Label>
              <Input
                id="number"
                name="number"
                value={trainData.number}
                onChange={handleChange}
                required
                placeholder="e.g. 12302"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                name="origin"
                value={trainData.origin}
                onChange={handleChange}
                required
                placeholder="e.g. Delhi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={trainData.destination}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureTime">Departure Time</Label>
              <Input
                id="departureTime"
                name="departureTime"
                value={trainData.departureTime}
                onChange={handleChange}
                required
                placeholder="HH:MM (e.g. 08:30)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input
                id="arrivalTime"
                name="arrivalTime"
                value={trainData.arrivalTime}
                onChange={handleChange}
                required
                placeholder="HH:MM (e.g. 22:15)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={trainData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={trainData.price}
                onChange={handleChange}
                required
                placeholder="e.g. 1500"
              />
              <p className="text-xs text-gray-500">
                Fare for AC First Class. Other classes will be calculated automatically.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSeats">Total Seats</Label>
              <Input
                id="availableSeats"
                name="availableSeats"
                type="number"
                min="0"
                value={trainData.availableSeats}
                onChange={handleChange}
                required
                placeholder="e.g. 120"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-railway-600 hover:bg-railway-700"
            disabled={isLoading}
          >
            {isLoading 
              ? 'Processing...' 
              : initialData?.id ? 'Update Train' : 'Add Train'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrainForm;
