
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Map, Train, Calendar as CalendarIcon2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SearchFormProps {
  onSearch?: (search: { origin: string; destination: string; date: string }) => void;
  origin?: string;
  destination?: string;
  date?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, origin = '', destination = '', date = '' }) => {
  const navigate = useNavigate();
  const [originSearch, setOriginSearch] = useState(origin);
  const [destinationSearch, setDestinationSearch] = useState(destination);
  const [dateSearch, setDateSearch] = useState<Date | undefined>(date ? new Date(date) : undefined);
  const [availableStations, setAvailableStations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available stations from the database
  useEffect(() => {
    async function fetchStations() {
      setIsLoading(true);
      try {
        // Fetch distinct sources
        const { data: sourceData, error: sourceError } = await supabase
          .from('train')
          .select('source')
          .limit(50);
        
        if (sourceError) throw sourceError;
        
        // Fetch distinct destinations
        const { data: destData, error: destError } = await supabase
          .from('train')
          .select('destination')
          .limit(50);
        
        if (destError) throw destError;
        
        // Combine and deduplicate stations
        const sources = sourceData.map(item => item.source);
        const destinations = destData.map(item => item.destination);
        const allStations = [...new Set([...sources, ...destinations])].sort();
        
        setAvailableStations(allStations);
      } catch (error) {
        console.error('Error fetching stations:', error);
        toast.error('Failed to load station data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStations();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originSearch) {
      toast.error("Please select origin station");
      return;
    }
    
    if (!destinationSearch) {
      toast.error("Please select destination station");
      return;
    }
    
    if (!dateSearch) {
      toast.error("Please select travel date");
      return;
    }
    
    if (originSearch === destinationSearch) {
      toast.error("Origin and destination cannot be the same");
      return;
    }
    
    const searchParams = {
      origin: originSearch,
      destination: destinationSearch,
      date: format(dateSearch, 'yyyy-MM-dd')
    };
    
    // Call onSearch if provided
    if (onSearch) {
      onSearch(searchParams);
    }
    
    // Navigate to the listing page with search params
    navigate(`/trains?origin=${originSearch}&destination=${destinationSearch}&date=${format(dateSearch, 'yyyy-MM-dd')}`);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="md:col-span-3">
              <div className="flex flex-col space-y-2">
                <label htmlFor="origin" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Map size={16} className="text-railway-600" />
                    From
                  </div>
                </label>
                <Select 
                  value={originSearch} 
                  onValueChange={setOriginSearch}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select origin station" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStations.length > 0 ? (
                      availableStations.map(station => (
                        <SelectItem key={station} value={station}>{station}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {isLoading ? 'Loading stations...' : 'No stations available'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="flex flex-col space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Map size={16} className="text-railway-600" />
                    To
                  </div>
                </label>
                <Select 
                  value={destinationSearch} 
                  onValueChange={setDestinationSearch}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select destination station" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStations.length > 0 ? (
                      availableStations.map(station => (
                        <SelectItem key={station} value={station}>{station}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {isLoading ? 'Loading stations...' : 'No stations available'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <CalendarIcon2 size={16} className="text-railway-600" />
                    Date
                  </div>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-12 justify-start text-left font-normal",
                        !dateSearch && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateSearch ? format(dateSearch, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateSearch}
                      onSelect={setDateSearch}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium opacity-0">Search</label>
                <Button type="submit" className="h-12 bg-railway-600 hover:bg-railway-700">
                  <div className="flex items-center gap-2">
                    <Search size={16} />
                    Find Trains
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
