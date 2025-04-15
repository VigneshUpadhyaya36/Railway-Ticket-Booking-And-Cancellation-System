
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TrainForm from '@/components/admin/TrainForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAdminData, 
  getTrains, 
  deleteTrain, 
  getBookings, 
  getCancellations 
} from '@/services/trainService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Train, BookingData, CancellationData } from '@/types/railBooker';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  TrainFrontIcon, 
  UsersIcon, 
  TicketIcon, 
  FileText, 
  RefreshCw, 
  PlusCircle, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  DollarSign 
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const queryClient = useQueryClient();
  
  const { data: adminData, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminData'],
    queryFn: getAdminData,
  });
  
  const { data: trains, isLoading: isTrainsLoading } = useQuery({
    queryKey: ['trains'],
    queryFn: () => getTrains(),
  });
  
  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
  
  const { data: cancellations, isLoading: isCancellationsLoading } = useQuery({
    queryKey: ['cancellations'],
    queryFn: getCancellations,
  });
  
  const handleTrainAdded = () => {
    // Refresh trains data after adding a new train
    queryClient.invalidateQueries({ queryKey: ['trains'] });
    queryClient.invalidateQueries({ queryKey: ['adminData'] });
    setActiveTab("trains");
    toast.success("Train added successfully");
  };
  
  const handleTrainUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['trains'] });
    setSelectedTrain(null);
    toast.success("Train updated successfully");
  };
  
  const handleDeleteTrain = async (trainId: string) => {
    try {
      await deleteTrain(trainId);
      queryClient.invalidateQueries({ queryKey: ['trains'] });
      toast.success("Train deleted successfully");
    } catch (error) {
      console.error("Error deleting train:", error);
      toast.error("Failed to delete train");
    }
  };
  
  const handleEditTrain = (train: Train) => {
    setSelectedTrain(train);
    setActiveTab("edit-train");
  };
  
  // Process booking data for charts
  const processBookingData = () => {
    if (!bookings) return [];
    
    const classData: Record<string, number> = {
      'AC First Class': 0,
      'AC 2 Tier': 0,
      'AC 3 Tier': 0,
      'Sleeper': 0
    };
    
    bookings.forEach(booking => {
      if (booking.booking_status === 'Confirmed' && booking.class) {
        classData[booking.class] = (classData[booking.class] || 0) + 1;
      }
    });
    
    return Object.keys(classData).map(key => ({
      class: key,
      bookings: classData[key]
    }));
  };
  
  // Get monthly revenue data
  const getMonthlyRevenueData = () => {
    if (!bookings) return [];
    
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: Record<string, number> = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[month.getMonth()];
      monthlyData[monthKey] = 0;
    }
    
    // Process bookings
    bookings.forEach(booking => {
      if (booking.payment_status === 'Successful') {
        const bookingDate = new Date(booking.booking_date);
        const monthKey = monthNames[bookingDate.getMonth()];
        
        // Only count last 6 months
        if (bookingDate >= new Date(now.getFullYear(), now.getMonth() - 5, 1)) {
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 2000; // Placeholder amount
        }
      }
    });
    
    return Object.keys(monthlyData).map(month => ({
      month,
      revenue: monthlyData[month]
    }));
  };
  
  // Get occupancy data by class
  const getOccupancyData = () => {
    return [
      { class: 'AC First Class', occupancy: 82 },
      { class: 'AC 2 Tier', occupancy: 90 },
      { class: 'AC 3 Tier', occupancy: 75 },
      { class: 'Sleeper', occupancy: 95 }
    ];
  };
  
  // Colors for pie chart
  const COLORS = ['#7B4DFF', '#4BB543', '#FF9800', '#E91E63'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage trains, view bookings, and monitor performance</p>
          </div>
          <Button 
            className="flex items-center gap-2" 
            onClick={() => queryClient.invalidateQueries()}
          >
            <RefreshCw size={16} /> Refresh Data
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText size={16} /> Overview
            </TabsTrigger>
            <TabsTrigger value="trains" className="flex items-center gap-2">
              <TrainFrontIcon size={16} /> Trains
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <TicketIcon size={16} /> Bookings
            </TabsTrigger>
            <TabsTrigger value="cancellations" className="flex items-center gap-2">
              <XCircle size={16} /> Cancellations
            </TabsTrigger>
            <TabsTrigger value="add-train" className="flex items-center gap-2">
              <PlusCircle size={16} /> Add Train
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <DollarSign className="text-yellow-500" size={20} /> Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-railway-700">
                    ₹{isAdminLoading ? '...' : adminData?.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">All time earnings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <TicketIcon className="text-blue-500" size={20} /> Active Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-railway-700">
                    {isBookingsLoading ? '...' : bookings?.filter(b => b.booking_status === 'Confirmed').length || 0}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Current confirmed bookings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <UsersIcon className="text-green-500" size={20} /> Total Passengers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-railway-700">
                    {isBookingsLoading ? '...' : bookings?.length || 0}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">All time passengers</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Revenue Card */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-railway-700">
                      ₹{isAdminLoading ? '...' : adminData?.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">All time</p>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-2">Revenue Sources</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center"><div className="w-3 h-3 bg-[#7B4DFF] rounded-full mr-2"></div> Online Bookings</span>
                          <span>78%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center"><div className="w-3 h-3 bg-[#4BB543] rounded-full mr-2"></div> Counter Bookings</span>
                          <span>22%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={getMonthlyRevenueData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#7B4DFF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Booking Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Distribution by Class</CardTitle>
                  <CardDescription>Breakdown of bookings by train class</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={processBookingData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="bookings"
                          nameKey="class"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {processBookingData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.class]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Occupancy Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Train Occupancy by Class</CardTitle>
                  <CardDescription>Average seat occupancy percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={getOccupancyData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                      <Legend />
                      <Bar dataKey="occupancy" fill="#4BB543" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trains Tab */}
          <TabsContent value="trains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrainFrontIcon size={20} /> Train Management
                  </span>
                  <Button 
                    onClick={() => setActiveTab("add-train")}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle size={16} /> Add New Train
                  </Button>
                </CardTitle>
                <CardDescription>Manage all trains, schedules and fares</CardDescription>
              </CardHeader>
              <CardContent>
                {isTrainsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-railway-600"></div>
                  </div>
                ) : trains && trains.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Train</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Schedule</TableHead>
                          <TableHead>Seats</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trains.map((train: Train) => (
                          <TableRow key={train.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="font-medium">{train.name}</div>
                              <div className="text-sm text-gray-500">{train.number}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-50">
                                  {train.origin}
                                </Badge>
                                {" to "}
                                <Badge variant="outline" className="bg-green-50">
                                  {train.destination}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <CalendarIcon size={14} className="text-gray-500" />
                                {train.date}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {train.departureTime} - {train.arrivalTime}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Badge className={train.availableSeats < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                  {train.availableSeats} available
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                of {train.totalSeats} total
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleEditTrain(train)}
                                >
                                  <Edit size={14} /> Edit
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 size={14} /> Delete
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirm Deletion</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                      Are you sure you want to delete {train.name} ({train.number})? This action cannot be undone.
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <Button variant="outline">Cancel</Button>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => handleDeleteTrain(train.id)}
                                      >
                                        Delete Train
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No trains available</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab("add-train")}
                    >
                      Add New Train
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TicketIcon size={20} /> Booking Management
                </CardTitle>
                <CardDescription>Track all passenger bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {isBookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-railway-600"></div>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PNR</TableHead>
                          <TableHead>Passenger</TableHead>
                          <TableHead>Train</TableHead>
                          <TableHead>Travel Class</TableHead>
                          <TableHead>Booking Status</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking: BookingData) => (
                          <TableRow key={booking.pnr} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="font-medium">{booking.pnr}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(booking.booking_date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{booking.passenger?.name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">
                                Seat: {booking.seat_no}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{booking.train?.train_name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">
                                {booking.train?.source} to {booking.train?.destination}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50">
                                {booking.class}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {booking.booking_status === 'Confirmed' ? (
                                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Confirmed
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                                  <XCircle size={12} /> Cancelled
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <CreditCard size={14} className="text-gray-500" />
                                {booking.payment_status === 'Successful' ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    Paid
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No bookings available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Cancellations Tab */}
          <TabsContent value="cancellations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle size={20} /> Cancellation Records
                </CardTitle>
                <CardDescription>Track all booking cancellations and refunds</CardDescription>
              </CardHeader>
              <CardContent>
                {isCancellationsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-railway-600"></div>
                  </div>
                ) : cancellations && cancellations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PNR</TableHead>
                          <TableHead>Cancellation Date</TableHead>
                          <TableHead>Refund Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cancellations.map((cancellation: CancellationData) => (
                          <TableRow key={cancellation.cancel_id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="font-medium">{cancellation.pnr}</div>
                            </TableCell>
                            <TableCell>
                              {new Date(cancellation.cancellation_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">₹{cancellation.refund_amount}</div>
                            </TableCell>
                            <TableCell>
                              {cancellation.status === 'Processed' ? (
                                <Badge className="bg-green-100 text-green-800">
                                  Processed
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No cancellations available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Add Train Tab */}
          <TabsContent value="add-train">
            <TrainForm onSubmit={handleTrainAdded} />
          </TabsContent>
          
          {/* Edit Train Tab */}
          <TabsContent value="edit-train">
            {selectedTrain && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Edit Train</h2>
                  <Button variant="outline" onClick={() => setActiveTab("trains")}>
                    Back to Trains
                  </Button>
                </div>
                <TrainForm 
                  onSubmit={handleTrainUpdated}
                  initialData={{
                    name: selectedTrain.name,
                    number: selectedTrain.number,
                    origin: selectedTrain.origin,
                    destination: selectedTrain.destination,
                    departureTime: selectedTrain.departureTime,
                    arrivalTime: selectedTrain.arrivalTime,
                    date: selectedTrain.date,
                    price: selectedTrain.price.toString(),
                    availableSeats: selectedTrain.availableSeats.toString(),
                    id: selectedTrain.id
                  }}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
