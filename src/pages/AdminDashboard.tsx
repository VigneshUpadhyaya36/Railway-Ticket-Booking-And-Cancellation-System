
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainFront, Users, Ticket, Plus, Edit, Trash, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import TrainForm from "@/components/admin/TrainForm";
import CustomerForm from "@/components/admin/CustomerForm";
import { toast } from "sonner";
import { getTrains, getBookings, getAdminData, addTrain, cancelBooking } from '@/services/trainService';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const [trains, setTrains] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [deleteTrainId, setDeleteTrainId] = useState<string | null>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [isTrainDialogOpen, setIsTrainDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch trains
      const trainsData = await getTrains();
      setTrains(trainsData);
      
      // Fetch bookings
      const bookingsData = await getBookings();
      
      // Transform booking data for UI
      const transformedBookings = bookingsData.map(booking => {
        const train = booking.train;
        const passenger = booking.passenger;
        
        return {
          id: booking.pnr,
          customer: passenger?.name || 'Unknown',
          train: `${train?.train_name || 'Unknown'} (${train?.train_number || 'N/A'})`,
          date: train?.schedule ? new Date(train.schedule).toLocaleDateString() : 'N/A',
          origin: train?.source || 'N/A',
          destination: train?.destination || 'N/A',
          passengers: 1, // Hard-coded for now
          status: booking.booking_status,
          amount: 1200, // Hard-coded for now, would come from payment
          created_at: booking.created_at,
        };
      });
      
      setBookings(transformedBookings);
      
      // Get unique customers from bookings
      const uniqueCustomers = Array.from(
        new Set(bookingsData.map(b => b.passenger?.passenger_id))
      )
        .filter(Boolean)
        .map(id => {
          const booking = bookingsData.find(b => b.passenger?.passenger_id === id);
          const passenger = booking?.passenger;
          
          return {
            id: passenger?.passenger_id,
            name: passenger?.name || 'Unknown',
            email: 'customer@example.com', // Placeholder
            phone: passenger?.contact || 'N/A',
            gender: passenger?.gender || 'N/A',
            address: 'India', // Placeholder
          };
        });
      
      setCustomers(uniqueCustomers);
      
      // Fetch admin data (total revenue)
      const adminData = await getAdminData();
      setTotalRevenue(adminData.totalRevenue);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTrain = async (trainData: any) => {
    try {
      await addTrain({
        name: trainData.name,
        number: trainData.number,
        origin: trainData.origin,
        destination: trainData.destination,
        departureTime: trainData.departureTime,
        arrivalTime: trainData.arrivalTime,
        date: trainData.date,
        totalSeats: parseInt(trainData.availableSeats),
        fares: [
          { class: 'AC First Class', price: parseInt(trainData.price) },
          { class: 'AC 2 Tier', price: parseInt(trainData.price) * 0.8 },
          { class: 'AC 3 Tier', price: parseInt(trainData.price) * 0.6 },
          { class: 'Sleeper', price: parseInt(trainData.price) * 0.4 }
        ]
      });
      
      // Refresh trains data
      const trainsData = await getTrains();
      setTrains(trainsData);
      
      setIsTrainDialogOpen(false);
    } catch (error) {
      console.error("Error adding train:", error);
      toast.error("Failed to add train");
    }
  };

  const handleEditTrain = (trainData: any) => {
    // This would be replaced with an API call in a real app
    setTrains(trains.map(train => 
      train.id === selectedTrain.id ? { ...train, ...trainData } : train
    ));
    setSelectedTrain(null);
    setIsTrainDialogOpen(false);
    toast.success("Train updated successfully");
  };

  const handleDeleteTrain = () => {
    if (deleteTrainId) {
      // This would be replaced with an API call in a real app
      setTrains(trains.filter(train => train.id !== deleteTrainId));
      setDeleteTrainId(null);
      toast.success("Train deleted successfully");
    }
  };

  const handleAddCustomer = (customerData: any) => {
    // This would be replaced with an API call in a real app
    const newCustomer = {
      id: `C${Date.now().toString().slice(-3)}`,
      ...customerData,
    };
    setCustomers([...customers, newCustomer]);
    setIsCustomerDialogOpen(false);
    toast.success("Customer added successfully");
  };

  const handleEditCustomer = (customerData: any) => {
    // This would be replaced with an API call in a real app
    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer.id ? { ...customer, ...customerData } : customer
    ));
    setSelectedCustomer(null);
    setIsCustomerDialogOpen(false);
    toast.success("Customer updated successfully");
  };

  const handleDeleteCustomer = () => {
    if (deleteCustomerId) {
      // This would be replaced with an API call in a real app
      setCustomers(customers.filter(customer => customer.id !== deleteCustomerId));
      setDeleteCustomerId(null);
      toast.success("Customer deleted successfully");
    }
  };

  const handleCancelBooking = async (pnr: string, amount: number) => {
    try {
      await cancelBooking(pnr, amount);
      
      // Update local state
      setBookings(prevBookings => prevBookings.map(booking => 
        booking.id === pnr 
          ? { ...booking, status: 'Cancelled' } 
          : booking
      ));
      
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  // Format time for admin view
  const formatTime = (timeString: string) => {
    return timeString?.slice(0, 5) || 'N/A';
  };

  // Format revenue
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-railway-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <header className="bg-railway-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <TrainFront className="h-8 w-8" />
                <span className="ml-2 text-2xl font-bold">RailBooker Admin</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" className="text-white" asChild>
                <Link to="/">Back to Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-railway-100 p-4 rounded-full mr-4">
                <TrainFront className="h-6 w-6 text-railway-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Trains</p>
                <h3 className="text-3xl font-bold">{trains.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-railway-100 p-4 rounded-full mr-4">
                <Users className="h-6 w-6 text-railway-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <h3 className="text-3xl font-bold">{customers.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-railway-100 p-4 rounded-full mr-4">
                <Ticket className="h-6 w-6 text-railway-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-3xl font-bold">{bookings.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-railway-100 p-4 rounded-full mr-4">
                <IndianRupee className="h-6 w-6 text-railway-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-3xl font-bold">{formatCurrency(totalRevenue)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="trains">
          <TabsList className="mb-6">
            <TabsTrigger value="trains">Manage Trains</TabsTrigger>
            <TabsTrigger value="customers">Manage Customers</TabsTrigger>
            <TabsTrigger value="bookings">View Bookings</TabsTrigger>
          </TabsList>
          
          {/* Trains Tab */}
          <TabsContent value="trains">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Trains</CardTitle>
                <Dialog open={isTrainDialogOpen} onOpenChange={setIsTrainDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-railway-600 hover:bg-railway-700">
                      <Plus className="h-4 w-4 mr-2" /> Add Train
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Train</DialogTitle>
                    </DialogHeader>
                    <TrainForm onSubmit={handleAddTrain} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-medium">Train Name</th>
                        <th className="pb-3 font-medium">Number</th>
                        <th className="pb-3 font-medium">Route</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Time</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Seats</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trains.map(train => (
                        <tr key={train.id} className="border-b">
                          <td className="py-4">{train.name}</td>
                          <td className="py-4">{train.number}</td>
                          <td className="py-4">{train.origin} to {train.destination}</td>
                          <td className="py-4">{train.date}</td>
                          <td className="py-4">{train.departureTime} - {train.arrivalTime}</td>
                          <td className="py-4">₹{train.price}</td>
                          <td className="py-4">{train.availableSeats}</td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedTrain(train)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Edit Train</DialogTitle>
                                  </DialogHeader>
                                  {selectedTrain && (
                                    <TrainForm onSubmit={handleEditTrain} initialData={selectedTrain} />
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setDeleteTrainId(train.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Train</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {train.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={handleDeleteTrain}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customers</CardTitle>
                <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-railway-600 hover:bg-railway-700">
                      <Plus className="h-4 w-4 mr-2" /> Add Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <CustomerForm onSubmit={handleAddCustomer} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-medium">ID</th>
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Phone</th>
                        <th className="pb-3 font-medium">Gender</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(customer => (
                        <tr key={customer.id} className="border-b">
                          <td className="py-4">{customer.id}</td>
                          <td className="py-4">{customer.name}</td>
                          <td className="py-4">{customer.email}</td>
                          <td className="py-4">{customer.phone}</td>
                          <td className="py-4 capitalize">{customer.gender}</td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedCustomer(customer)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Edit Customer</DialogTitle>
                                  </DialogHeader>
                                  {selectedCustomer && (
                                    <CustomerForm onSubmit={handleEditCustomer} initialData={selectedCustomer} />
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setDeleteCustomerId(customer.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete customer {customer.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={handleDeleteCustomer}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-medium">Booking ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Train</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Route</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-4">{booking.id}</td>
                          <td className="py-4">{booking.customer}</td>
                          <td className="py-4">{booking.train}</td>
                          <td className="py-4">{booking.date}</td>
                          <td className="py-4">{booking.origin} to {booking.destination}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "Confirmed" 
                                ? "bg-green-100 text-green-800" 
                                : booking.status === "Waitlisted"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4">₹{booking.amount}</td>
                          <td className="py-4">
                            {booking.status !== "Cancelled" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel booking {booking.id}? The seat will be made available for other customers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleCancelBooking(booking.id, booking.amount)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Yes, Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
