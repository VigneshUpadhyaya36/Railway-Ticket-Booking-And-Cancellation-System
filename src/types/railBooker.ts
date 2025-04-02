
// Define our own types for the train booking system instead of using Tables

// Raw data types from Supabase
export type TrainData = {
  train_id: string;
  train_name: string;
  train_number: string;
  source: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  schedule: string;
  total_seats: number;
  available_seats: number;
  created_at?: string;
  fares?: FareData[];
};

// Fare type
export type FareData = {
  fare_id: string;
  train_id: string;
  class: string;
  fare_amount: number;
  created_at?: string;
};

// Passenger type
export type PassengerData = {
  passenger_id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  created_at?: string;
};

// Booking type
export type BookingData = {
  pnr: string;
  passenger_id: string;
  train_id: string;
  seat_no: string;
  class: string;
  fare_id: string;
  booking_date: string;
  payment_status: string;
  booking_status: string;
  created_at?: string;
  passenger?: PassengerData;
  train?: TrainData;
  fare?: FareData;
};

// Payment type
export type PaymentData = {
  payment_id: string;
  pnr: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  created_at?: string;
};

// Cancellation type
export type CancellationData = {
  cancel_id: string;
  pnr: string;
  refund_amount: number;
  cancellation_date: string;
  status: string;
  created_at?: string;
};

// Admin type
export type AdminData = {
  admin_id: string;
  username: string;
  password: string;
  created_at?: string;
};

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
