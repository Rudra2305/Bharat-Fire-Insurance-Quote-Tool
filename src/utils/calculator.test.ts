import { describe, it, expect } from 'vitest';
import { calculateQuote } from './calculator';
import { Occupancy, PincodeData } from '../data/dataManager';

// Mock Data
const mockOccupancy: Occupancy = {
  name: "Offices, Hotels, Restaurants",
  categoryCode: "A",
  flexaRate: 0.15
};

const mockPincode: PincodeData = {
  pincode: "400001",
  state: "Maharashtra",
  district: "Mumbai",
  eqZone: 3
};

describe('calculateQuote', () => {
  it('calculates a basic quote for Fresh Insurance correctly', () => {
    const inputs = {
      buildingSI: 1000000, // 10L
      pmSI: 0,
      furnitureSI: 0,
      stocksSI: 0,
      otherSI: 0,
      discount: 0,
      includeTerrorism: false,
      occupancy: mockOccupancy,
      pincode: mockPincode,
      isRenewal: false,
      hasClaims: false,
      pastPremium: 0,
      pastClaims: 0
    };

    const result = calculateQuote(inputs);
    expect(result).not.toBeNull();
    if (result) {
      // Total SI = 10,00,000
      // Rate = Flexa(0.15) + STFI(0.075) + EQ(0.05) = 0.275 per 1000
      // Net Premium = (1,000,000 * 0.275) / 1000 = 275
      expect(result.netPremium).toBeCloseTo(275, 1);
      expect(result.policyType).toBe("Bharat Sookshma Udyam Suraksha");
      expect(result.isBlocked).toBe(false);
    }
  });

  it('blocks quotes when Claim Ratio exceeds 70%', () => {
    const inputs = {
      buildingSI: 1000000,
      pmSI: 0,
      furnitureSI: 0,
      stocksSI: 0,
      otherSI: 0,
      discount: 0,
      includeTerrorism: false,
      occupancy: mockOccupancy,
      pincode: mockPincode,
      isRenewal: true,
      hasClaims: true,
      pastPremium: 1000,
      pastClaims: 701 // 70.1% Ratio
    };

    const result = calculateQuote(inputs);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.isBlocked).toBe(true);
      expect(result.claimRatio).toBeGreaterThan(70);
    }
  });

  it('allows quotes when Claim Ratio is exactly 70%', () => {
    const inputs = {
      buildingSI: 1000000,
      pmSI: 0,
      furnitureSI: 0,
      stocksSI: 0,
      otherSI: 0,
      discount: 0,
      includeTerrorism: false,
      occupancy: mockOccupancy,
      pincode: mockPincode,
      isRenewal: true,
      hasClaims: true,
      pastPremium: 1000,
      pastClaims: 700 // 70% Ratio
    };

    const result = calculateQuote(inputs);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.isBlocked).toBe(false);
      expect(result.claimRatio).toBe(70);
    }
  });

  it('correctly classifies Bharat Laghu Udyam Suraksha (> 5 Cr SI)', () => {
    const inputs = {
      buildingSI: 60000000, // 6 Cr
      pmSI: 0,
      furnitureSI: 0,
      stocksSI: 0,
      otherSI: 0,
      discount: 0,
      includeTerrorism: false,
      occupancy: mockOccupancy,
      pincode: mockPincode,
      isRenewal: false,
      hasClaims: false,
      pastPremium: 0,
      pastClaims: 0
    };

    const result = calculateQuote(inputs);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.policyType).toBe("Bharat Laghu Udyam Suraksha");
    }
  });

  it('applies the 80% discount safety cap correctly', () => {
    const inputs = {
      buildingSI: 1000000,
      pmSI: 0,
      furnitureSI: 0,
      stocksSI: 0,
      otherSI: 0,
      discount: 95, // Trying to apply 95% discount
      includeTerrorism: false,
      occupancy: mockOccupancy,
      pincode: mockPincode,
      isRenewal: false,
      hasClaims: false,
      pastPremium: 0,
      pastClaims: 0
    };

    const result = calculateQuote(inputs);
    expect(result).not.toBeNull();
    if (result) {
      // Flexa was 0.15. 80% discount makes it 0.03.
      expect(result.netFlexaRate).toBeCloseTo(0.03, 4);
    }
  });
});
