
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainFront, Users, Ticket, Plus, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import TrainForm from "@/components/admin/TrainForm";
import CustomerForm from "@/components/admin/CustomerForm";
import { toast } from "sonner";

// Mock data
const mockTrains = [
  {
    id: "1",
    name: "Rajdhani Express",
    number: "12301",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "16:55",
    arrivalTime: "08:15",
    date: "2023-08-15",
    price: 1200,
    availableSeats: 42,
  },
  {
    id: "2",
    name: "Shatabdi Express",
    number: "12045",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "06:15",
    arrivalTime: "22:30",
    date: "2023-08-15",
    price: 850,
    availableSeats: 120,
  },
];

const mockCustomers = [
  {
    id: "C001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    gender: "male",
    address: "123 Main St, New Delhi",
  },
  {
    id: "C002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+91 8765432109",
    gender: "female",
    address: "456 Park Ave, Mumbai",
  },
];

const mockBookings = [
  {
    id: "B001",
    customer: "John Doe",
    train: "Rajdhani Express (12301)",
    date: "2023-08-15",
    origin: "New Delhi",
    destination: "Mumbai",
    passengers: 1,
    status: "Confirmed",
    amount: 1250,
  },
  {
    id: "B002",
    customer: "Jane Smith",
    train: "Shatabdi Express (12045)",
    date: "2023-09-20",
    origin: "Chennai",
    destination: "Bangalore",
    passengers: 2,
    status: "Confirmed",
    amount: 1700,
  },
  {
    id: "B003",
    customer: "John Doe",
    train: "Duronto Express (12213)",
    date: "2023-10-05",
    origin: "Mumbai",
    destination: "Kolkata",
    passengers: 1,
    status: "Waitlisted",
    amount: 1450,
  },
];

const AdminDashboard = () => {
  const [trains, setTrains] = useState(mockTrains);
  const [customers, setCustomers] = useState(mockCustomers);
  const [bookings] = useState(mockBookings);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [deleteTrainId, setDeleteTrainId] = useState<string | null>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [isTrainDialogOpen, setIsTrainDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);

  const handleAddTrain = (trainData: any) => {
    const newTrain = {
      id: Date.now().toString(),
      ...trainData,
    };
    setTrains([...trains, newTrain]);
    setIsTrainDialogOpen(false);
  };

  const handleEditTrain = (trainData: any) => {
    setTrains(trains.map(train => 
      train.id === selectedTrain.id ? { ...train, ...trainData } : train
    ));
    setSelectedTrain(null);
    setIsTrainDialogOpen(false);
  };

  const handleDeleteTrain = () => {
    if (deleteTrainId) {
      setTrains(trains.filter(train => train.id !== deleteTrainId));
      setDeleteTrainId(null);
      toast.success("Train deleted successfully");
    }
  };

  const handleAddCustomer = (customerData: any) => {
    const newCustomer = {
      id: `C${Date.now().toString().slice(-3)}`,
      ...customerData,
    };
    setCustomers([...customers, newCustomer]);
    setIsCustomerDialogOpen(false);
  };

  const handleEditCustomer = (customerData: any) => {
    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer.id ? { ...customer, ...customerData } : customer
    ));
    setSelectedCustomer(null);
    setIsCustomerDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (deleteCustomerId) {
      setCustomers(customers.filter(customer => customer.id !== deleteCustomerId));
      setDeleteCustomerId(null);
      toast.success("Customer deleted successfully");
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                        <th className="pb-3 font-medium">Passengers</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Amount</th>
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
                          <td className="py-4">{booking.passengers}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "Confirmed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4">₹{booking.amount}</td>
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
