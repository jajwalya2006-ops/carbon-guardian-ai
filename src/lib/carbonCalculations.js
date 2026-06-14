/**
 * Carbon Guardian AI — Core Calculation Engine
 * 
 * Pure, testable functions for all carbon footprint calculations.
 * Used across Dashboard, Coach, Twin, Simulator, and Assessment pages.
 */

// ─── Constants ──────────────────────────────────────────────────────────────────

/** Average CO2 absorbed by one tree per year in kg */
export const CO2_PER_TREE_PER_YEAR = 21.77;

/** Average CO2 per car mile in kg */
export const CO2_PER_CAR_MILE = 0.404;

/** Average monthly electricity cost per kg CO2 factor */
export const ELECTRICITY_CO2_FACTOR = 0.015;

/** Category baselines in kg CO2/year */
export const BASELINES = {
  transport: 1500,
  energy: 1200,
  diet: 1500,
};

/** Commute emission factors per km */
export const COMMUTE_FACTORS = {
  'Car (Gasoline)': 0.15,
  'Car (Electric)': 0.05,
  'Public Transit': 0.03,
  'Bicycle / Walk': 0.0,
};

/** Diet annual emission additions in tons */
export const DIET_FACTORS = {
  'Omnivore (Meat daily)': 1.5,
  'Flexitarian (Meat occasionally)': 0.8,
  'Vegetarian': 0.4,
  'Vegan': 0.15,
};

/** Heating source annual additions in tons */
export const HEATING_FACTORS = {
  'Oil': 0.5,
  'Natural Gas': 0.3,
  'Electric': 0.1,
  'Other': 0.2,
};

/** Clothing purchase frequency emissions in tons */
export const CLOTHING_FACTORS = {
  'Weekly': 0.6,
  'Monthly': 0.3,
  'Rarely': 0.1,
};

// ─── Core Calculations ──────────────────────────────────────────────────────────

/**
 * Calculate annual carbon footprint from assessment inputs.
 * @param {object} params
 * @param {string} params.commuteType - Primary commute method
 * @param {number} params.commuteDistance - Daily commute in km
 * @param {number} params.flights - Annual flights taken
 * @param {number} params.energyBill - Monthly electricity bill in $
 * @param {string} params.heatingSource - Primary heating source
 * @param {string} params.diet - Dietary preference
 * @param {string} params.clothing - Clothing purchase frequency
 * @returns {number} Annual footprint in tons CO2
 */
export function calculateFootprint({
  commuteType = 'Car (Gasoline)',
  commuteDistance = 0,
  flights = 0,
  energyBill = 0,
  heatingSource = 'Natural Gas',
  diet = 'Omnivore (Meat daily)',
  clothing = 'Monthly',
} = {}) {
  let base = 1.2; // base emissions in tons

  // Commute contribution
  const factor = COMMUTE_FACTORS[commuteType] ?? 0.15;
  base += (Math.max(0, commuteDistance) * factor);

  // Flights
  base += (Math.max(0, flights) * 0.4);

  // Energy
  base += (Math.max(0, energyBill) * ELECTRICITY_CO2_FACTOR);

  // Heating
  base += (HEATING_FACTORS[heatingSource] ?? 0.3);

  // Diet
  base += (DIET_FACTORS[diet] ?? 1.5);

  // Clothing
  base += (CLOTHING_FACTORS[clothing] ?? 0.3);

  return Math.round(base * 10) / 10;
}

/**
 * Calculate simulator reduction from percentage sliders.
 * @param {number} baseEmissions - Base emissions in kg (e.g. 4200)
 * @param {number} commutePercent - 0-100 percentage of baseline commute
 * @param {number} energyPercent - 0-100 percentage of baseline energy
 * @param {number} dietPercent - 0-100 percentage of baseline diet
 * @returns {object} { transport, energy, diet, total, savings }
 */
export function calculateReduction(baseEmissions, commutePercent, energyPercent, dietPercent) {
  const safeCommute = clamp(commutePercent, 0, 100);
  const safeEnergy = clamp(energyPercent, 0, 100);
  const safeDiet = clamp(dietPercent, 0, 100);

  const transport = Math.round((safeCommute / 100) * BASELINES.transport);
  const energy = Math.round((safeEnergy / 100) * BASELINES.energy);
  const diet = Math.round((safeDiet / 100) * BASELINES.diet);

  const total = transport + energy + diet;
  const savings = baseEmissions - total;

  return { transport, energy, diet, total, savings };
}

/**
 * Convert kg CO2 to equivalent number of trees needed to absorb it in a year.
 * @param {number} kgCO2 - Amount of CO2 in kg
 * @returns {number} Number of trees (rounded)
 */
export function calculateTreeEquivalent(kgCO2) {
  if (!isFinite(kgCO2) || kgCO2 < 0) return 0;
  return Math.round(kgCO2 / CO2_PER_TREE_PER_YEAR);
}

/**
 * Convert kg CO2 to equivalent car miles not driven.
 * @param {number} kgCO2 - Amount of CO2 in kg
 * @returns {number} Equivalent car miles (rounded)
 */
export function calculateCarMilesEquivalent(kgCO2) {
  if (!isFinite(kgCO2) || kgCO2 < 0) return 0;
  return Math.round(kgCO2 / CO2_PER_CAR_MILE);
}

/**
 * Predict monthly savings in dollars from CO2 reduction.
 * Approximation: $0.05 per kg CO2 saved (energy cost correlation).
 * @param {number} monthlyCO2Saved - kg CO2 saved per month
 * @returns {number} Estimated dollar savings
 */
export function calculateMonthlySavings(monthlyCO2Saved) {
  if (!isFinite(monthlyCO2Saved) || monthlyCO2Saved < 0) return 0;
  return Math.round(monthlyCO2Saved * 0.05 * 100) / 100;
}

/**
 * Get a breakdown of emission sources as percentages.
 * @param {number} transport - Transport emissions in kg
 * @param {number} energy - Energy emissions in kg
 * @param {number} diet - Diet emissions in kg
 * @returns {Array<{name: string, value: number, percentage: number, color: string}>}
 */
export function getEmissionBreakdown(transport, energy, diet) {
  const total = transport + energy + diet;
  if (total === 0) {
    return [
      { name: 'Transport', value: 0, percentage: 0, color: '#06b6d4' },
      { name: 'Home Energy', value: 0, percentage: 0, color: '#f59e0b' },
      { name: 'Diet & Food', value: 0, percentage: 0, color: '#10b981' },
    ];
  }

  return [
    { name: 'Transport', value: transport, percentage: Math.round((transport / total) * 100), color: '#06b6d4' },
    { name: 'Home Energy', value: energy, percentage: Math.round((energy / total) * 100), color: '#f59e0b' },
    { name: 'Diet & Food', value: diet, percentage: Math.round((diet / total) * 100), color: '#10b981' },
  ];
}

/**
 * Calculate an eco score from 0-100 based on emission levels.
 * Lower emissions = higher score.
 * @param {number} annualTonsCO2 - Annual carbon footprint in tons
 * @returns {number} Score 0-100
 */
export function getEcoScore(annualTonsCO2) {
  if (!isFinite(annualTonsCO2) || annualTonsCO2 < 0) return 0;
  // Global average ~4.5 tons → score ~45
  // Target 2.0 tons → score ~85
  // 0 tons → score 100
  const score = Math.round(100 - (annualTonsCO2 * 12));
  return clamp(score, 0, 100);
}

/**
 * Get a letter grade from an eco score.
 * @param {number} score - Eco score 0-100
 * @returns {{ grade: string, label: string, color: string }}
 */
export function getEcoGrade(score) {
  if (score >= 85) return { grade: 'A+', label: 'Exceptional', color: '#10b981' };
  if (score >= 70) return { grade: 'A', label: 'Excellent', color: '#34d399' };
  if (score >= 55) return { grade: 'B', label: 'Good', color: '#06b6d4' };
  if (score >= 40) return { grade: 'C', label: 'Average', color: '#f59e0b' };
  if (score >= 25) return { grade: 'D', label: 'Below Average', color: '#f97316' };
  return { grade: 'F', label: 'Needs Improvement', color: '#ef4444' };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Clamp a number between min and max.
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(value, min, max) {
  if (!isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
