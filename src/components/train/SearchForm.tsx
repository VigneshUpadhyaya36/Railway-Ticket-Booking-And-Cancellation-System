
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const SearchForm = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [passengers, setPassengers] = useState('1');
  const [stations, setStations] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch available stations from the database
  useEffect(() => {
    const fetchStations = async () => {
      try {
        // Get unique sources
        const { data: sourceData } = await supabase
          .from('train')
          .select('source')
          .order('source');
          
        // Get unique destinations
        const { data: destData } = await supabase
          .from('train')
          .select('destination')
          .order('destination');
          
        if (sourceData && destData) {
          // Extract and deduplicate station names
          const sources = sourceData.map(item => item.source);
          const destinations = destData.map(item => item.destination);
          const uniqueStations = [...new Set([...sources, ...destinations])];
          setStations(uniqueStations);
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
    
    fetchStations();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct query parameters
    const params = new URLSearchParams();
    if (origin) params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', format(date, 'yyyy-MM-dd'));
    params.append('passengers', passengers);
    
    // Navigate to trains listing with search parameters
    navigate(`/trains?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <Select 
                value={origin} 
                onValueChange={setOrigin}
              >
                <SelectTrigger id="origin" className="h-12">
                  <SelectValue placeholder="Select origin station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={`origin-${station}`} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Select 
                value={destination} 
                onValueChange={setDestination}
              >
                <SelectTrigger id="destination" className="h-12">
                  <SelectValue placeholder="Select destination station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={`dest-${station}`} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="9" 
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="flex items-end">
              <Button type="submit" className="w-full h-12 bg-railway-600 hover:bg-railway-700">
                <Search className="mr-2 h-4 w-4" />
                Search Trains
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
