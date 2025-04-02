
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

interface TrainFormProps {
  onSubmit: (trainData: any) => void;
  initialData?: any;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrainData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(trainData);
    toast.success(initialData ? "Train updated successfully" : "New train added successfully");
    
    if (!initialData) {
      // Clear the form if it's a new train submission
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Train' : 'Add New Train'}</CardTitle>
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
                placeholder="HH:MM"
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
                placeholder="HH:MM"
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
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={trainData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSeats">Available Seats</Label>
              <Input
                id="availableSeats"
                name="availableSeats"
                type="number"
                min="0"
                value={trainData.availableSeats}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-railway-600 hover:bg-railway-700">
            {initialData ? 'Update Train' : 'Add Train'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrainForm;
