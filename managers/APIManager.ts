import axios from 'axios';
import CITIES from '../utils/constants/CITIES';
import { debugLog } from '../utils/DebugLogger';

export async function fetchAirQuality(location: string) {
  debugLog('API MANAGER', 'Fetching air quality in', location);

  const response = await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${CITIES[location].lat}&lon=${CITIES[location].lon}&appid=APPID`
  );

  debugLog('API MANAGER', 'Fetched air quality successfully', response.data.list[0].components.so2);

  return response.data.list[0].components.so2;
}

// AI FUNCTIONS
export async function electricBillScan(image: string) {
  debugLog('API MANAGER', 'Scanning bill', image);

  const response = await axios.get(`https://ecopal-api.vercel.app/ai/energy_bill?uri=${image}`);

  debugLog('API MANAGER', 'Scanned bill successfully', response.data);

  return response.data;
}
export async function assertionCheck(image: string, assertion: string) {
  debugLog('API MANAGER', 'Checking assertion', assertion, image);

  const response = await axios.get(`https://ecopal-api.vercel.app/ai/assertion?prompt=${assertion}&uri=${image}`);

  debugLog('API MANAGER', 'Assertion checked successfully', response.data);

  return response.data;
}
export async function recycleSuggestion(image: string) {
  debugLog('API MANAGER', 'Asking for recycling suggestion', image);

  const response = await axios.get(`https://ecopal-api.vercel.app/ai/recycle?uri=${image}`);

  debugLog('API MANAGER', 'Recycle suggestion received successfully', response.data);

  return response.data;
}
