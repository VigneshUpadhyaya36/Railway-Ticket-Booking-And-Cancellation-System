
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TrainCard, { Train } from '@/components/train/TrainCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowDownAZ, ArrowUpAZ, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

// Mock data for trains
const mockTrains: Train[] = [
  {
    id: "1",
    name: "Rajdhani Express",
    number: "12301",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "16:55",
    arrivalTime: "08:15",
    duration: "15h 20m",
    price: 1200,
    availableSeats: 42,
    date: "2023-08-15",
  },
  {
    id: "2",
    name: "Shatabdi Express",
    number: "12045",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "06:15",
    arrivalTime: "22:30",
    duration: "16h 15m",
    price: 850,
    availableSeats: 120,
    date: "2023-08-15",
  },
  {
    id: "3",
    name: "Duronto Express",
    number: "12213",
    origin: "New Delhi",
    destination: "Mumbai",
    departureTime: "23:00",
    arrivalTime: "15:20",
    duration: "16h 20m",
    price: 1450,
    availableSeats: 25,
    date: "2023-08-15",
  },
];

const TrainListing = () => {
  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const passengers = searchParams.get('passengers') || '1';
  
  const [trains, setTrains] = useState<Train[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [departureTime, setDepartureTime] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("departureTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  useEffect(() => {
    // Simulate API call to get trains
    setTimeout(() => {
      // Filter mock data based on search params
      const filtered = mockTrains.filter(
        train => 
          (!origin || train.origin.toLowerCase().includes(origin.toLowerCase())) && 
          (!destination || train.destination.toLowerCase().includes(destination.toLowerCase()))
      );
      setTrains(filtered);
      setFilteredTrains(filtered);
      setLoading(false);
    }, 1000);
  }, [origin, destination]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...trains];
    
    // Filter by price range
    result = result.filter(
      train => train.price >= priceRange[0] && train.price <= priceRange[1]
    );
    
    // Filter by departure time
    if (departureTime !== "all") {
      const filterDepartureTimes = (train: Train) => {
        const hour = parseInt(train.departureTime.split(":")[0]);
        switch (departureTime) {
          case "morning": return hour >= 4 && hour < 12;
          case "afternoon": return hour >= 12 && hour < 16;
          case "evening": return hour >= 16 && hour < 20;
          case "night": return hour >= 20 || hour < 4;
          default: return true;
        }
      };
      result = result.filter(filterDepartureTimes);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        case "duration":
          const getDuration = (duration: string) => {
            const parts = duration.split("h ");
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1].replace("m", ""));
            return hours * 60 + minutes;
          };
          return sortOrder === "asc" 
            ? getDuration(a.duration) - getDuration(b.duration)
            : getDuration(b.duration) - getDuration(a.duration);
        case "departureTime":
          const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
          };
          return sortOrder === "asc" 
            ? timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime)
            : timeToMinutes(b.departureTime) - timeToMinutes(a.departureTime);
        default:
          return 0;
      }
    });
    
    setFilteredTrains(result);
  }, [trains, priceRange, departureTime, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const minMaxPrice = trains.length > 0 
    ? [
        Math.min(...trains.map(train => train.price)),
        Math.max(...trains.map(train => train.price))
      ] 
    : [0, 2000];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Trains from {origin} to {destination}
          </h1>
          <p className="text-gray-600">
            {filteredTrains.length} trains found • {date} • {passengers} passenger(s)
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider 
                  value={priceRange} 
                  min={minMaxPrice[0]} 
                  max={minMaxPrice[1]}
                  step={50}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              
              {/* Departure Time Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Departure Time</h3>
                <Select value={departureTime} onValueChange={setDepartureTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Times</SelectItem>
                    <SelectItem value="morning">Morning (04:00 - 11:59)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12:00 - 15:59)</SelectItem>
                    <SelectItem value="evening">Evening (16:00 - 19:59)</SelectItem>
                    <SelectItem value="night">Night (20:00 - 03:59)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Sort By</h3>
                <div className="space-y-2">
                  <Button 
                    variant={sortBy === "price" ? "default" : "outline"} 
                    className="w-full justify-between"
                    onClick={() => { setSortBy("price"); }}
                  >
                    Price
                    <span onClick={(e) => { e.stopPropagation(); toggleSortOrder(); }}>
                      {sortOrder === "asc" ? <ArrowDownToLine size={16} /> : <ArrowUpToLine size={16} />}
                    </span>
                  </Button>
                  <Button 
                    variant={sortBy === "departureTime" ? "default" : "outline"} 
                    className="w-full justify-between"
                    onClick={() => { setSortBy("departureTime"); }}
                  >
                    Departure Time
                    <span onClick={(e) => { e.stopPropagation(); toggleSortOrder(); }}>
                      {sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                    </span>
                  </Button>
                  <Button 
                    variant={sortBy === "duration" ? "default" : "outline"} 
                    className="w-full justify-between"
                    onClick={() => { setSortBy("duration"); }}
                  >
                    Duration
                    <span onClick={(e) => { e.stopPropagation(); toggleSortOrder(); }}>
                      {sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                    </span>
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPriceRange([minMaxPrice[0], minMaxPrice[1]]);
                  setDepartureTime("all");
                  setSortBy("departureTime");
                  setSortOrder("asc");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Train listings */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-2 text-gray-600">Searching for trains...</p>
              </div>
            ) : filteredTrains.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-medium mb-2">No trains found</h3>
                <p className="text-gray-600">Try adjusting your filters or search for a different route.</p>
              </div>
            ) : (
              filteredTrains.map(train => (
                <TrainCard key={train.id} train={train} />
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrainListing;
