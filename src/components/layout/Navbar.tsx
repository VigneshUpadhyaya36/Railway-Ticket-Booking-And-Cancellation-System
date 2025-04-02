
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { TrainFront, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <TrainFront className="h-8 w-8 text-railway-600" />
              <span className="ml-2 text-2xl font-bold text-railway-800">RailBooker</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-railway-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/trains" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Find Trains
              </Link>
              <Link to="/bookings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                My Bookings
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/admin">
              <Button variant="outline" className="mr-2">Admin</Button>
            </Link>
            <Link to="/login">
              <Button className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
