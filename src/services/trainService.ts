
import { supabase } from '@/integrations/supabase/client';
import { TrainData, FareData, mapTrainDataToTrain, Train } from '@/types/railBooker';

// Get all trains
export const getTrains = async (params?: { 
  origin?: string, 
  destination?: string, 
  date?: string
}): Promise<Train[]> => {
  let query = supabase.from('train').select(`
    *,
    fares:fare(*)
  `);
  
  // Apply filters if provided
  if (params?.origin) {
    query = query.ilike('source', `%${params.origin}%`);
  }
  
  if (params?.destination) {
    query = query.ilike('destination', `%${params.destination}%`);
  }
  
  if (params?.date) {
    query = query.eq('schedule', params.date);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching trains:', error);
    throw new Error(`Failed to fetch trains: ${error.message}`);
  }
  
  // Type assertion to tell TypeScript we know the shape of the data
  return (data as unknown as TrainData[]).map(train => mapTrainDataToTrain(train));
};

// Get a train by ID
export const getTrain = async (trainId: string): Promise<Train | null> => {
  const { data, error } = await supabase
    .from('train')
    .select(`
      *,
      fares:fare(*)
    `)
    .eq('train_id', trainId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching train:', error);
    throw new Error(`Failed to fetch train: ${error.message}`);
  }
  
  if (!data) return null;
  
  // Type assertion to tell TypeScript we know the shape of the data
  return mapTrainDataToTrain(data as unknown as TrainData);
};

// Get train fares
export const getTrainFares = async (trainId: string): Promise<FareData[]> => {
  const { data, error } = await supabase
    .from('fare')
    .select('*')
    .eq('train_id', trainId);
  
  if (error) {
    console.error('Error fetching fares:', error);
    throw new Error(`Failed to fetch fares: ${error.message}`);
  }
  
  // Type assertion to tell TypeScript we know the shape of the data
  return data as unknown as FareData[];
};
