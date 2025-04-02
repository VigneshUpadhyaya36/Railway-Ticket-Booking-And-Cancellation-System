
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Download, ExternalLink } from 'lucide-react';

// Mock data for bookings
const mockBookings = [
  {
    id: "B001",
    trainName: "Rajdhani Express",
    trainNumber: "12301",
    origin: "New Delhi",
    destination: "Mumbai",
    date: "2023-08-15",
    departureTime: "16:55",
    arrivalTime: "08:15",
    passengers: [
      { name: "John Doe", age: 32, gender: "male" }
    ],
    status: "confirmed",
    pnr: "2457896532",
    totalAmount: 1250,
  },
  {
    id: "B002",
    trainName: "Shatabdi Express",
    trainNumber: "12045",
    origin: "Chennai",
    destination: "Bangalore",
    date: "2023-09-20",
    departureTime: "06:15",
    arrivalTime: "12:30",
    passengers: [
      { name: "Jane Smith", age: 28, gender: "female" },
      { name: "Mike Johnson", age: 30, gender: "male" }
    ],
    status: "confirmed",
    pnr: "7856432190",
    totalAmount: 1700,
  },
  {
    id: "B003",
    trainName: "Duronto Express",
    trainNumber: "12213",
    origin: "Mumbai",
    destination: "Kolkata",
    date: "2023-10-05",
    departureTime: "23:00",
    arrivalTime: "15:20",
    passengers: [
      { name: "John Doe", age: 32, gender: "male" }
    ],
    status: "waitlisted",
    pnr: "3654789012",
    waitlistNumber: 5,
    totalAmount: 1450,
  },
];

const UserBookings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage all your train tickets and reservations</p>
        </div>
        
        {mockBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-medium mb-3">No bookings found</h2>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <Button asChild>
              <a href="/trains">Find Trains</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {mockBookings.map(booking => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-wrap items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-gray-900 mr-3">
                            {booking.trainName}
                          </h3>
                          {booking.status === "confirmed" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>
                          ) : booking.status === "waitlisted" ? (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                              WL {booking.waitlistNumber}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{booking.trainNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">PNR</p>
                        <p className="font-medium">{booking.pnr}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium">{booking.origin} ({booking.departureTime})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium">{booking.destination} ({booking.arrivalTime})</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Passengers</p>
                      <div className="space-y-1">
                        {booking.passengers.map((passenger, idx) => (
                          <div key={idx} className="flex text-sm">
                            <span className="font-medium mr-2">{passenger.name}</span>
                            <span className="text-gray-600">
                              ({passenger.age} yrs, {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold">₹{booking.totalAmount}</p>
                      </div>
                      
                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {booking.status === "confirmed" && (
                          <>
                            <Button size="sm" variant="outline" className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              Download E-Ticket
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </>
                        )}
                        
                        {booking.status === "waitlisted" && (
                          <Button size="sm" variant="outline" className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Check Status
                          </Button>
                        )}
                        
                        {booking.status !== "cancelled" && (
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {booking.status === "confirmed" && (
                    <div className="p-4 bg-green-50 flex items-center text-green-800">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Your e-ticket has been sent to your email address.</span>
                    </div>
                  )}
                  
                  {booking.status === "waitlisted" && (
                    <div className="p-4 bg-yellow-50 flex items-center text-yellow-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Your booking is waitlisted. We'll notify you when it's confirmed.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default UserBookings;
