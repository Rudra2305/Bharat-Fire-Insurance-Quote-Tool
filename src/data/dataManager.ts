import pincodesRaw from './generated/pincodes.json';
import occupanciesRaw from './generated/occupancies.json';
import ratesRaw from './generated/rates.json';

export interface PincodeData {
  pincode: string;
  state: string;
  district: string;
  eqZone: number;
}

export interface Occupancy {
  name: string;
  categoryCode: string;
  flexaRate: number;
}

// Map Pincodes
export const pincodes: PincodeData[] = (pincodesRaw as any[]).map((p: any) => ({
  pincode: String(p["Pincode"]),
  state: p["State"],
  district: p["District"],
  eqZone: p["Earthquake zone"]
}));

// Map Occupancies
export const occupancies: Occupancy[] = occupanciesRaw.map((o: any) => ({
  name: o["Occupancy Description"],
  categoryCode: o["Code"],
  flexaRate: o["Flexa Rate"]
}));

// Map Rates
const rateList = ratesRaw["EQ STFI and Terrorism Rate"];

// Manual override for Terrorism Rates as per latest tariff
export const terrorismRates: Record<string, number> = {
  A: 0.08,
  B: 0.13,
  C: 0.21,
  D: 0.21,
  E: 0.21,
  F: 0.21,
  G: 0.21,
  H: 0.21,
  I: 0.21,
  J: 0.21,
};

// Initialize rate objects
export const stfiRates: Record<string, number> = {};
export const eqRates: Record<string, Record<number, number>> = {};

rateList.forEach((r: any) => {
  const code = r["Code"];
  if (code) {
    stfiRates[code] = r["STFI"];
    // Terrorism rates are now handled by the manual override above
    eqRates[code] = {
      1: r[" EQ Zone I"] || r["EQ Zone I"], // Handle potential leading space
      2: r["EQ Zone II"],
      3: r["EQ Zone III"],
      4: r["EQ Zone IV"]
    };
  }
});

// Default fallback for terrorism if not found per code
export const DEFAULT_TERRORISM_RATE = 0.15;
