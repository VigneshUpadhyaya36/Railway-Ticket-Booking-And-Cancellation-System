
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Train } from './TrainCard';

interface BookingFormProps {
  train: Train;
  passengers: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ train, passengers }) => {
  const [passengerDetails, setPassengerDetails] = useState(
    Array(Number(passengers)).fill({
      name: '',
      age: '',
      gender: 'male'
    })
  );
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const navigate = useNavigate();

  const updatePassenger = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengerDetails(updatedPassengers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would connect to your backend API
    // For now, just show a success toast and redirect
    toast.success("Booking successful! Your tickets have been reserved.");
    navigate('/bookings');
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Passenger Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Passenger details */}
          {Array.from({ length: Number(passengers) }).map((_, index) => (
            <div key={index} className="space-y-4 border-b pb-4 last:border-b-0">
              <h3 className="font-medium">Passenger {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Full Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={passengerDetails[index]?.name || ''}
                    onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`age-${index}`}>Age</Label>
                  <Input
                    id={`age-${index}`}
                    type="number"
                    min="0"
                    max="120"
                    value={passengerDetails[index]?.age || ''}
                    onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select 
                    value={passengerDetails[index]?.gender || 'male'} 
                    onValueChange={(value) => updatePassenger(index, 'gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-medium">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking" className="cursor-pointer">Net Banking</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Fare Summary */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">Fare Summary</h3>
            <div className="flex justify-between">
              <span>Base Fare ({passengers} passengers)</span>
              <span>₹{train.price * Number(passengers)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>₹50</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{train.price * Number(passengers) + 50}</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-railway-600 hover:bg-railway-700">
            Confirm & Pay ₹{train.price * Number(passengers) + 50}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
