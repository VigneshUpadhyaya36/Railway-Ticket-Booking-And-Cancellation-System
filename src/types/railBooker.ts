
import { Tables } from '@/integrations/supabase/types';

// Train type based on the Supabase schema
export type TrainData = Tables<'train'> & {
  fares?: FareData[];
};

// Fare type based on the Supabase schema
export type FareData = Tables<'fare'>;

// Passenger type based on the Supabase schema
export type PassengerData = Tables<'passenger'>;

// Booking type based on the Supabase schema
export type BookingData = Tables<'booking'> & {
  passenger?: PassengerData;
  train?: TrainData;
  fare?: FareData;
};

// Payment type based on the Supabase schema
export type PaymentData = Tables<'payment'>;

// Cancellation type based on the Supabase schema
export type CancellationData = Tables<'cancellation'>;

// Admin type based on the Supabase schema
export type AdminData = Tables<'admin'>;

// Custom train type for UI rendering (matches existing TrainCard component)
export type Train = {
  id: string;
  name: string;
  number: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  date: string;
};

// Helper function to convert TrainData from Supabase to UI Train type
export const mapTrainDataToTrain = (trainData: TrainData, fareClass?: string): Train => {
  // Find the appropriate fare or use the first one
  const fare = trainData.fares?.find(f => f.class === fareClass) || trainData.fares?.[0];
  
  // Calculate duration (simple string for now)
  const deptTime = new Date(`2000-01-01T${trainData.departure_time}`);
  const arrTime = new Date(`2000-01-01T${trainData.arrival_time}`);
  let durationMs = arrTime.getTime() - deptTime.getTime();
  // If arrival is earlier than departure, it means the train arrives the next day
  if (durationMs < 0) {
    durationMs += 24 * 60 * 60 * 1000; // Add 24 hours
  }
  const durationHours = Math.floor(durationMs / (60 * 60 * 1000));
  const durationMinutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
  const duration = `${durationHours}h ${durationMinutes}m`;

  return {
    id: trainData.train_id,
    name: trainData.train_name,
    number: trainData.train_number,
    origin: trainData.source,
    destination: trainData.destination,
    departureTime: trainData.departure_time.slice(0, 5),
    arrivalTime: trainData.arrival_time.slice(0, 5),
    duration,
    price: fare?.fare_amount ? Number(fare.fare_amount) : 0,
    availableSeats: trainData.available_seats,
    date: trainData.schedule ? new Date(trainData.schedule).toLocaleDateString() : '',
  };
};
