
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TrainForm from '@/components/admin/TrainForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminData, getTrains } from '@/services/trainService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Train } from '@/types/railBooker';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: adminData, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminData'],
    queryFn: getAdminData,
  });
  
  const { data: trains, isLoading: isTrainsLoading } = useQuery({
    queryKey: ['trains'],
    queryFn: () => getTrains(),
  });
  
  const handleTrainAdded = () => {
    // Refresh trains data after adding a new train
    // This would be handled by React Query's invalidation in a real app
  };
  
  // Sample revenue data (in a real app, this would come from the backend)
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 49000 },
    { month: 'Apr', revenue: 63000 },
    { month: 'May', revenue: 58000 },
    { month: 'Jun', revenue: 72000 },
  ];
  
  // Sample occupancy data grouped by train class (in a real app, this would come from the backend)
  const occupancyData = [
    { class: 'AC First Class', occupancy: 82 },
    { class: 'AC 2 Tier', occupancy: 90 },
    { class: 'AC 3 Tier', occupancy: 75 },
    { class: 'Sleeper', occupancy: 95 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Manage trains, view bookings, and monitor performance</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trains">Trains</TabsTrigger>
            <TabsTrigger value="add-train">Add Train</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Card */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-railway-700">
                      ₹{isAdminLoading ? '...' : adminData?.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">All time</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={revenueData}>
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
            
            {/* Occupancy Card */}
            <Card>
              <CardHeader>
                <CardTitle>Train Occupancy by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occupancyData}>
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
          </TabsContent>
          
          <TabsContent value="trains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Train Management</CardTitle>
              </CardHeader>
              <CardContent>
                {isTrainsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-railway-600"></div>
                  </div>
                ) : trains && trains.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left">Train</th>
                          <th className="px-4 py-3 text-left">Route</th>
                          <th className="px-4 py-3 text-left">Schedule</th>
                          <th className="px-4 py-3 text-left">Seats</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trains.map((train: Train) => (
                          <tr key={train.id} className="border-b">
                            <td className="px-4 py-3">
                              <div className="font-medium">{train.name}</div>
                              <div className="text-sm text-gray-500">{train.number}</div>
                            </td>
                            <td className="px-4 py-3">
                              {train.origin} to {train.destination}
                            </td>
                            <td className="px-4 py-3">
                              <div>{train.date}</div>
                              <div className="text-sm text-gray-500">
                                {train.departureTime} - {train.arrivalTime}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {train.availableSeats} available
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                              <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          
          <TabsContent value="add-train">
            <TrainForm onSubmit={handleTrainAdded} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
