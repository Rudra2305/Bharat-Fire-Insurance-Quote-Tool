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

// Map Pincodes - Filtering out invalid entries
export const pincodeMap: Record<string, PincodeData> = {};
((pincodesRaw as any) || []).forEach((p: any) => {
  if (p && p["Pincode"]) {
    const code = String(p["Pincode"]);
    pincodeMap[code] = {
      pincode: code,
      state: p["State"] || "Unknown",
      district: p["District"] || "Unknown",
      eqZone: Number(p["Earthquake zone"]) || 3
    };
  }
});

// Map Occupancies - Ensuring Name and Code exist
export const occupancies: Occupancy[] = ((occupanciesRaw as any) || [])
  .filter((o: any) => o && o["Occupancy Description"])
  .map((o: any) => ({
    name: String(o["Occupancy Description"]),
    categoryCode: String(o["Code"] || "A"),
    flexaRate: Number(o["Flexa Rate"]) || 0
  }));

// Map Rates
const rateList = (ratesRaw as any)?.["EQ STFI and Terrorism Rate"] || [];

export const terrorismRates: Record<string, number> = {
  A: 0.08, B: 0.13, C: 0.21, D: 0.21, E: 0.21, F: 0.21, G: 0.21, H: 0.21, I: 0.21, J: 0.21,
};

export const stfiRates: Record<string, number> = {};
export const eqRates: Record<string, Record<number, number>> = {};

rateList.forEach((r: any) => {
  const code = r["Code"];
  if (code) {
    stfiRates[code] = Number(r["STFI"]) || 0;
    eqRates[code] = {
      1: Number(r[" EQ Zone I"] || r["EQ Zone I"]) || 0,
      2: Number(r["EQ Zone II"]) || 0,
      3: Number(r["EQ Zone III"]) || 0,
      4: Number(r["EQ Zone IV"]) || 0
    };
  }
});

export const DEFAULT_TERRORISM_RATE = 0.15;
