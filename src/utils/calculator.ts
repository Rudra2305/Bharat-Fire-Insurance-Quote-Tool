import { stfiRates, eqRates, terrorismRates, DEFAULT_TERRORISM_RATE } from '../data/dataManager';
import type { Occupancy, PincodeData } from '../data/dataManager';

export interface QuoteInputs {
  buildingSI: number;
  pmSI: number;
  furnitureSI: number;
  stocksSI: number;
  otherSI: number;
  discount: number;
  includeTerrorism: boolean;
  occupancy: Occupancy | null;
  pincode: PincodeData | null;
  // Underwriting Fields
  isRenewal: boolean;
  hasClaims: boolean;
  pastPremium: number;
  pastClaims: number;
  // New Add-ons
  selectedAddons: string[]; 
}

export interface QuoteResult {
  policyType: string;
  totalSI: number;
  netFlexaRate: number;
  stfiRate: number;
  eqRate: number;
  terrorismRate: number;
  netRate: number;
  flexaPremium: number;
  stfiPremium: number;
  eqPremium: number;
  terrorismPremium: number;
  netPremium: number;
  gst: number;
  totalPremium: number;
  claimRatio: number;
  isBlocked: boolean;
  compulsoryDeductible: string; // New field
}

export function calculateQuote(inputs: QuoteInputs): QuoteResult | null {
  const { 
    buildingSI, pmSI, furnitureSI, stocksSI, otherSI, 
    discount, includeTerrorism, occupancy, pincode,
    isRenewal, hasClaims, pastPremium, pastClaims,
    selectedAddons
  } = inputs;

  if (!occupancy || !pincode) return null;

  const totalSI = buildingSI + pmSI + furnitureSI + stocksSI + otherSI;
  if (totalSI <= 0) return null;

  // Underwriting Gatekeeper: 70% Claim Ratio Rule
  let claimRatio = 0;
  let isBlocked = false;

  if (isRenewal && hasClaims) {
    if (pastPremium > 0) {
      claimRatio = (pastClaims / pastPremium) * 100;
      if (claimRatio > 70) {
        isBlocked = true;
      }
    } else if (pastClaims > 0) {
      claimRatio = 100;
      isBlocked = true;
    }
  }

  // Policy Classification & Deductible Logic
  let policyType = "";
  let compulsoryDeductible = "";
  const siInCr = totalSI / 10000000;

  if (siInCr <= 5) {
    policyType = "Bharat Sookshma Udyam Suraksha";
    compulsoryDeductible = "₹5,000";
  } else if (siInCr <= 50) {
    policyType = "Bharat Laghu Udyam Suraksha";
    compulsoryDeductible = "5% of claim (Min ₹10,000)";
  } else {
    policyType = "Standard Fire & Special Perils (SFSP)";
    if (siInCr <= 100) {
      compulsoryDeductible = "5% of claim (Min ₹25,000)";
    } else if (siInCr <= 1500) {
      compulsoryDeductible = "5% of claim (Min ₹5,00,000)";
    } else if (siInCr <= 2500) {
      compulsoryDeductible = "5% of claim (Min ₹25,00,000)";
    } else {
      compulsoryDeductible = "5% of claim (Min ₹50,00,000)";
    }
  }

  const categoryCode = occupancy.categoryCode;
  const eqZone = pincode.eqZone;

  // Rates
  const flexaRate = occupancy.flexaRate;
  const clampedDiscount = Math.min(discount, 80);
  const netFlexaRate = flexaRate * (1 - clampedDiscount / 100);

  const stfiRate = stfiRates[categoryCode] || 0;
  const eqRate = eqRates[categoryCode]?.[eqZone] || 0;
  const terrorismRate = (includeTerrorism || selectedAddons.includes('terrorism')) 
    ? (terrorismRates[categoryCode] || DEFAULT_TERRORISM_RATE) 
    : 0;

  const netRate = netFlexaRate + stfiRate + eqRate + terrorismRate;

  // Premiums
  const flexaPremium = (totalSI * netFlexaRate) / 1000;
  const stfiPremium = (totalSI * stfiRate) / 1000;
  const eqPremium = (totalSI * eqRate) / 1000;
  const terrorismPremium = (totalSI * terrorismRate) / 1000;

  const netPremium = flexaPremium + stfiPremium + eqPremium + terrorismPremium;
  const gst = netPremium * 0.18;
  const totalPremium = netPremium + gst;

  return {
    policyType,
    totalSI,
    netFlexaRate,
    stfiRate,
    eqRate,
    terrorismRate,
    netRate,
    flexaPremium,
    stfiPremium,
    eqPremium,
    terrorismPremium,
    netPremium,
    gst,
    totalPremium,
    claimRatio,
    isBlocked,
    compulsoryDeductible
  };
}
