
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { getBookings, cancelBooking } from '@/services/trainService';
import { BookingData } from '@/types/railBooker';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);
  const [cancelAmount, setCancelAmount] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const fetchedBookings = await getBookings();
      
      // Transform bookings to UI format
      const transformedBookings = fetchedBookings.map(booking => {
        const train = booking.train;
        return {
          id: booking.pnr,
          trainName: train?.train_name || "Unknown Train",
          trainNumber: train?.train_number || "N/A",
          origin: train?.source || "N/A",
          destination: train?.destination || "N/A",
          date: train?.schedule ? new Date(train.schedule).toLocaleDateString() : "N/A",
          departureTime: train?.departure_time || "N/A",
          arrivalTime: train?.arrival_time || "N/A",
          passengers: [{
            name: booking.passenger?.name || "N/A",
            age: booking.passenger?.age || 0,
            gender: booking.passenger?.gender || "N/A"
          }],
          status: booking.booking_status.toLowerCase(),
          pnr: booking.pnr,
          totalAmount: 1200, // Hard-coded for now, would come from payment record
        };
      });
      
      setBookings(transformedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellingPnr) return;
    
    try {
      await cancelBooking(cancellingPnr, cancelAmount);
      
      // Update local state to show cancellation
      setBookings(prevBookings => prevBookings.map(booking => 
        booking.pnr === cancellingPnr 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      setCancellingPnr(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const openCancelDialog = (pnr: string, amount: number) => {
    setCancellingPnr(pnr);
    setCancelAmount(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage all your train tickets and reservations</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-railway-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-medium mb-3">No bookings found</h2>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <Button asChild>
              <a href="/trains">Find Trains</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => openCancelDialog(booking.pnr, booking.totalAmount)}
                              >
                                Cancel Booking
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this booking? A cancellation fee of 10% will be applied.
                                  You will receive a refund of ₹{(booking.totalAmount * 0.9).toFixed(2)}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCancellingPnr(null)}>
                                  No, Keep Booking
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
                                  Yes, Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                  
                  {booking.status === "cancelled" && (
                    <div className="p-4 bg-red-50 flex items-center text-red-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>This booking has been cancelled. Refund has been processed.</span>
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
