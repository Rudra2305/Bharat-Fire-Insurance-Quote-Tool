import { Flame, CloudLightning, Bomb, Plane, Users, CloudRainWind, Activity, Car, Mountain, Droplets, Target, Sprout } from 'lucide-react';

export interface Peril {
  name: string;
  description: string;
  icon: any;
}

export const standardPerils: Peril[] = [
  { name: "Fire", description: "Damage from ignition, including spontaneous combustion risks.", icon: Flame },
  { name: "Lightning", description: "Direct damage to structure or electrical systems.", icon: CloudLightning },
  { name: "Explosion / Implosion", description: "Sudden pressure failure (excluding high-pressure steam boilers).", icon: Bomb },
  { name: "Aircraft Damage", description: "Impact from aerial devices or articles dropped from them.", icon: Plane },
  { name: "RSMD", description: "Riot, Strike, and Malicious Damage by external parties.", icon: Users },
  { name: "STFI", description: "Storm, Tempest, Flood, and Inundation (Natural water damage).", icon: CloudRainWind },
  { name: "Earthquake", description: "Fire and Shock damage based on seismic zone mapping.", icon: Activity },
  { name: "Impact Damage", description: "Collision by road/rail vehicles or animals not owned by the insured.", icon: Car },
  { name: "Subsidence/Landslide", description: "Damage from ground movement or rockslides.", icon: Mountain },
  { name: "Bursting of Tanks/Pipes", description: "Failure of overhead water tanks or plumbing apparatus.", icon: Droplets },
  { name: "Missile Testing", description: "Damage caused by authorized government weapons testing.", icon: Target },
  { name: "Bush Fire", description: "Naturally occurring vegetation fires (excluding forest fires).", icon: Sprout }
];

export const optionalAddons = [
  { id: "architectFees", name: "Architects / Surveyors Fees", description: "Covers professional fees exceeding 3% of the claim amount." },
  { id: "debrisRemoval", name: "Removal of Debris", description: "Covers site clearing costs exceeding 1% of the claim amount." },
  { id: "omissionToInsure", name: "Omission to Insure", description: "Covers newly added assets missed during initial declaration." },
  { id: "spontaneousCombustion", name: "Spontaneous Combustion", description: "For high-risk commodities like coal, cotton, or oilseeds." },
  { id: "ownVehicleImpact", name: "Impact Damage (Own Vehicles)", description: "Includes damage by insured's own forklifts or trucks." },
  { id: "terrorism", name: "Terrorism", description: "Protection against acts of organized violence." }
];
