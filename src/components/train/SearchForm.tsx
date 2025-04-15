
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFormProps {
  onSearch?: (searchData: { origin: string; destination: string; date: string; passengers: string }) => void;
  origin?: string;
  destination?: string;
  date?: string;
  passengers?: string;
}

const SearchForm = ({
  onSearch,
  origin: initialOrigin = '',
  destination: initialDestination = '',
  date: initialDate = '',
  passengers: initialPassengers = '1'
}: SearchFormProps) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(initialPassengers);
  const [availableStations, setAvailableStations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : new Date()
  );

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        // Get all unique source stations
        const { data: sourceData, error: sourceError } = await supabase
          .from('train')
          .select('source')
          .order('source');
        
        if (sourceError) throw sourceError;
        
        // Get all unique destination stations
        const { data: destData, error: destError } = await supabase
          .from('train')
          .select('destination')
          .order('destination');
          
        if (destError) throw destError;
        
        // Combine and deduplicate stations
        const sources = sourceData.map(item => item.source);
        const destinations = destData.map(item => item.destination);
        const allStations = [...new Set([...sources, ...destinations])].filter(station => station && station.trim() !== '').sort();
        
        setAvailableStations(allStations);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, []);

  // Update date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch({
        origin,
        destination,
        date,
        passengers
      });
    }
  };

  const today = new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-2 border-railway-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Origin */}
          <div>
            <Label htmlFor="origin" className="block mb-2 text-railway-800 font-medium">From</Label>
            <div className="relative">
              <Select
                value={origin}
                onValueChange={setOrigin}
              >
                <SelectTrigger className="border-2 border-railway-100 h-12 focus:border-railway-500 focus:ring-railway-500 bg-white text-railway-800">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent className="bg-white border-railway-100">
                  {!isLoading && availableStations.length > 0 ? (
                    availableStations.map(station => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      {isLoading ? 'Loading stations...' : 'No stations available'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Destination */}
          <div>
            <Label htmlFor="destination" className="block mb-2 text-railway-800 font-medium">To</Label>
            <div className="relative">
              <Select
                value={destination}
                onValueChange={setDestination}
              >
                <SelectTrigger className="border-2 border-railway-100 h-12 focus:border-railway-500 focus:ring-railway-500 bg-white text-railway-800">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="bg-white border-railway-100">
                  {!isLoading && availableStations.length > 0 ? (
                    availableStations.map(station => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      {isLoading ? 'Loading stations...' : 'No stations available'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Date */}
          <div>
            <Label htmlFor="date" className="block mb-2 text-railway-800 font-medium">
              Travel Date
            </Label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2 border-railway-100 focus:border-railway-500 focus:ring-railway-500",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < today}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Passengers */}
          <div>
            <Label htmlFor="passengers" className="block mb-2 text-railway-800 font-medium">
              Passengers
            </Label>
            <Select
              value={passengers}
              onValueChange={setPassengers}
            >
              <SelectTrigger className="border-2 border-railway-100 h-12 focus:border-railway-500 focus:ring-railway-500 bg-white text-railway-800">
                <SelectValue placeholder="No. of passengers" />
              </SelectTrigger>
              <SelectContent className="bg-white border-railway-100">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Passenger{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-railway-600 hover:bg-railway-700 text-white h-12 px-8 transform transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Search className="mr-2 h-4 w-4" /> Find Trains
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
