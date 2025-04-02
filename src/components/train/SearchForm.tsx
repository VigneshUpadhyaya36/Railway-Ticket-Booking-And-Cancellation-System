
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { cn } from '@/lib/utils';

const SearchForm = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [passengers, setPassengers] = useState('1');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct query parameters
    const params = new URLSearchParams();
    params.append('origin', origin);
    params.append('destination', destination);
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
              <Input 
                id="origin"
                placeholder="City or station"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Input 
                id="destination"
                placeholder="City or station"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="h-12"
              />
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
