/**
 * Carbon Calculations — Comprehensive Test Suite
 *
 * Tests all exported functions from src/lib/carbonCalculations.js
 * including edge cases, boundary conditions, and invalid inputs.
 */
import {
  calculateFootprint,
  calculateReduction,
  calculateTreeEquivalent,
  calculateCarMilesEquivalent,
  calculateMonthlySavings,
  getEmissionBreakdown,
  getEcoScore,
  getEcoGrade,
  clamp,
  CO2_PER_TREE_PER_YEAR,
  CO2_PER_CAR_MILE,
  ELECTRICITY_CO2_FACTOR,
  BASELINES,
  COMMUTE_FACTORS,
  DIET_FACTORS,
  HEATING_FACTORS,
  CLOTHING_FACTORS,
} from '@/lib/carbonCalculations';

// ─── Constants Validation ────────────────────────────────────────────────────

describe('Exported Constants', () => {
  test('CO2_PER_TREE_PER_YEAR is a positive finite number', () => {
    expect(CO2_PER_TREE_PER_YEAR).toBe(21.77);
    expect(Number.isFinite(CO2_PER_TREE_PER_YEAR)).toBe(true);
  });

  test('CO2_PER_CAR_MILE is a positive finite number', () => {
    expect(CO2_PER_CAR_MILE).toBe(0.404);
    expect(Number.isFinite(CO2_PER_CAR_MILE)).toBe(true);
  });

  test('ELECTRICITY_CO2_FACTOR is a positive finite number', () => {
    expect(ELECTRICITY_CO2_FACTOR).toBe(0.015);
  });

  test('BASELINES contains transport, energy, and diet', () => {
    expect(BASELINES).toEqual({
      transport: 1500,
      energy: 1200,
      diet: 1500,
    });
  });

  test('COMMUTE_FACTORS has all expected commute types', () => {
    expect(COMMUTE_FACTORS).toHaveProperty('Car (Gasoline)');
    expect(COMMUTE_FACTORS).toHaveProperty('Car (Electric)');
    expect(COMMUTE_FACTORS).toHaveProperty('Public Transit');
    expect(COMMUTE_FACTORS).toHaveProperty('Bicycle / Walk');
    expect(COMMUTE_FACTORS['Bicycle / Walk']).toBe(0.0);
  });

  test('DIET_FACTORS has all expected diet types', () => {
    expect(Object.keys(DIET_FACTORS)).toHaveLength(4);
    expect(DIET_FACTORS['Vegan']).toBeLessThan(DIET_FACTORS['Omnivore (Meat daily)']);
  });

  test('HEATING_FACTORS has all expected heating sources', () => {
    expect(Object.keys(HEATING_FACTORS)).toHaveLength(4);
    expect(HEATING_FACTORS['Oil']).toBeGreaterThan(HEATING_FACTORS['Electric']);
  });

  test('CLOTHING_FACTORS has all expected frequencies', () => {
    expect(Object.keys(CLOTHING_FACTORS)).toHaveLength(3);
    expect(CLOTHING_FACTORS['Weekly']).toBeGreaterThan(CLOTHING_FACTORS['Rarely']);
  });
});

// ─── clamp ───────────────────────────────────────────────────────────────────

describe('clamp', () => {
  test('returns value when within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  test('clamps to min when value is below', () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  test('clamps to max when value is above', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  test('returns min for exact min boundary', () => {
    expect(clamp(0, 0, 100)).toBe(0);
  });

  test('returns max for exact max boundary', () => {
    expect(clamp(100, 0, 100)).toBe(100);
  });

  test('returns min for NaN input', () => {
    expect(clamp(NaN, 0, 100)).toBe(0);
  });

  test('returns min for Infinity input', () => {
    expect(clamp(Infinity, 0, 100)).toBe(0);
  });

  test('returns min for -Infinity input', () => {
    expect(clamp(-Infinity, 0, 100)).toBe(0);
  });

  test('handles equal min and max', () => {
    expect(clamp(50, 42, 42)).toBe(42);
  });
});

// ─── calculateFootprint ─────────────────────────────────────────────────────

describe('calculateFootprint', () => {
  test('returns base emissions with default parameters', () => {
    const result = calculateFootprint();
    expect(typeof result).toBe('number');
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeGreaterThan(0);
  });

  test('returns correct value for default params', () => {
    // base=1.2, commute=Car(Gasoline)*0=0, flights=0, energy=0,
    // heating=NaturalGas=0.3, diet=Omnivore=1.5, clothing=Monthly=0.3
    // total = 1.2 + 0 + 0 + 0 + 0.3 + 1.5 + 0.3 = 3.3
    expect(calculateFootprint()).toBe(3.3);
  });

  test('calculates correctly for Car (Gasoline) commute', () => {
    const result = calculateFootprint({ commuteType: 'Car (Gasoline)', commuteDistance: 10 });
    // base + 10*0.15 = adds 1.5 to base
    expect(result).toBeGreaterThan(calculateFootprint({ commuteDistance: 0 }));
  });

  test('calculates correctly for Car (Electric) commute', () => {
    const gasoline = calculateFootprint({ commuteType: 'Car (Gasoline)', commuteDistance: 20 });
    const electric = calculateFootprint({ commuteType: 'Car (Electric)', commuteDistance: 20 });
    expect(electric).toBeLessThan(gasoline);
  });

  test('calculates correctly for Public Transit', () => {
    const car = calculateFootprint({ commuteType: 'Car (Gasoline)', commuteDistance: 20 });
    const transit = calculateFootprint({ commuteType: 'Public Transit', commuteDistance: 20 });
    expect(transit).toBeLessThan(car);
  });

  test('Bicycle/Walk adds zero commute emissions', () => {
    const withBike = calculateFootprint({ commuteType: 'Bicycle / Walk', commuteDistance: 50 });
    const withoutCommute = calculateFootprint({ commuteType: 'Bicycle / Walk', commuteDistance: 0 });
    expect(withBike).toBe(withoutCommute);
  });

  test('flights increase emissions', () => {
    const noFlights = calculateFootprint({ flights: 0 });
    const withFlights = calculateFootprint({ flights: 5 });
    expect(withFlights).toBeGreaterThan(noFlights);
    // 5 flights * 0.4 = 2.0 tons added
    expect(withFlights - noFlights).toBeCloseTo(2.0, 1);
  });

  test('energy bill increases emissions', () => {
    const noBill = calculateFootprint({ energyBill: 0 });
    const withBill = calculateFootprint({ energyBill: 100 });
    expect(withBill).toBeGreaterThan(noBill);
  });

  test('all heating sources produce different results', () => {
    const oil = calculateFootprint({ heatingSource: 'Oil' });
    const gas = calculateFootprint({ heatingSource: 'Natural Gas' });
    const electric = calculateFootprint({ heatingSource: 'Electric' });
    expect(oil).toBeGreaterThan(gas);
    expect(gas).toBeGreaterThan(electric);
  });

  test('all diet types produce different results', () => {
    const omnivore = calculateFootprint({ diet: 'Omnivore (Meat daily)' });
    const flexitarian = calculateFootprint({ diet: 'Flexitarian (Meat occasionally)' });
    const vegetarian = calculateFootprint({ diet: 'Vegetarian' });
    const vegan = calculateFootprint({ diet: 'Vegan' });
    expect(omnivore).toBeGreaterThan(flexitarian);
    expect(flexitarian).toBeGreaterThan(vegetarian);
    expect(vegetarian).toBeGreaterThan(vegan);
  });

  test('all clothing frequencies produce different results', () => {
    const weekly = calculateFootprint({ clothing: 'Weekly' });
    const monthly = calculateFootprint({ clothing: 'Monthly' });
    const rarely = calculateFootprint({ clothing: 'Rarely' });
    expect(weekly).toBeGreaterThan(monthly);
    expect(monthly).toBeGreaterThan(rarely);
  });

  test('negative commuteDistance is clamped to 0', () => {
    const negative = calculateFootprint({ commuteDistance: -100 });
    const zero = calculateFootprint({ commuteDistance: 0 });
    expect(negative).toBe(zero);
  });

  test('negative flights are clamped to 0', () => {
    const negative = calculateFootprint({ flights: -5 });
    const zero = calculateFootprint({ flights: 0 });
    expect(negative).toBe(zero);
  });

  test('negative energyBill is clamped to 0', () => {
    const negative = calculateFootprint({ energyBill: -50 });
    const zero = calculateFootprint({ energyBill: 0 });
    expect(negative).toBe(zero);
  });

  test('unknown commuteType defaults to gasoline factor', () => {
    const unknown = calculateFootprint({ commuteType: 'Hovercraft', commuteDistance: 10 });
    const gasoline = calculateFootprint({ commuteType: 'Car (Gasoline)', commuteDistance: 10 });
    expect(unknown).toBe(gasoline);
  });

  test('unknown heatingSource defaults to Natural Gas factor', () => {
    const unknown = calculateFootprint({ heatingSource: 'Solar' });
    const gas = calculateFootprint({ heatingSource: 'Natural Gas' });
    expect(unknown).toBe(gas);
  });

  test('result is rounded to 1 decimal place', () => {
    const result = calculateFootprint({ commuteDistance: 7, flights: 3, energyBill: 55 });
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(1);
  });

  test('handles all params set to maximum reasonable values', () => {
    const result = calculateFootprint({
      commuteType: 'Car (Gasoline)',
      commuteDistance: 200,
      flights: 50,
      energyBill: 500,
      heatingSource: 'Oil',
      diet: 'Omnivore (Meat daily)',
      clothing: 'Weekly',
    });
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeGreaterThan(10);
  });

  test('handles empty object input', () => {
    expect(calculateFootprint({})).toBeGreaterThan(0);
  });

  test('unknown diet defaults to 1.5 factor', () => {
    const fp = calculateFootprint({ diet: 'Unknown' });
    expect(fp).toBeGreaterThan(0);
  });

  test('unknown clothing defaults to 0.3 factor', () => {
    const fp = calculateFootprint({ clothing: 'Unknown' });
    expect(fp).toBeGreaterThan(0);
  });
});

// ─── calculateReduction ─────────────────────────────────────────────────────

describe('calculateReduction', () => {
  const baseEmissions = 4200;

  test('returns correct structure', () => {
    const result = calculateReduction(baseEmissions, 50, 50, 50);
    expect(result).toHaveProperty('transport');
    expect(result).toHaveProperty('energy');
    expect(result).toHaveProperty('diet');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('savings');
  });

  test('100% across all categories returns baselines', () => {
    const result = calculateReduction(baseEmissions, 100, 100, 100);
    expect(result.transport).toBe(BASELINES.transport);
    expect(result.energy).toBe(BASELINES.energy);
    expect(result.diet).toBe(BASELINES.diet);
    expect(result.total).toBe(BASELINES.transport + BASELINES.energy + BASELINES.diet);
  });

  test('0% across all categories returns zero emissions', () => {
    const result = calculateReduction(baseEmissions, 0, 0, 0);
    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.diet).toBe(0);
    expect(result.total).toBe(0);
    expect(result.savings).toBe(baseEmissions);
  });

  test('50% reduction in all areas', () => {
    const result = calculateReduction(baseEmissions, 50, 50, 50);
    expect(result.transport).toBe(750);
    expect(result.energy).toBe(600);
    expect(result.diet).toBe(750);
    expect(result.total).toBe(2100);
    expect(result.savings).toBe(2100);
  });

  test('savings equals baseEmissions minus total', () => {
    const result = calculateReduction(baseEmissions, 75, 60, 40);
    expect(result.savings).toBe(baseEmissions - result.total);
  });

  test('clamps negative percentages to 0', () => {
    const result = calculateReduction(baseEmissions, -50, -100, -25);
    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.diet).toBe(0);
  });

  test('clamps percentages above 100 to 100', () => {
    const result = calculateReduction(baseEmissions, 200, 150, 300);
    expect(result.transport).toBe(BASELINES.transport);
    expect(result.energy).toBe(BASELINES.energy);
    expect(result.diet).toBe(BASELINES.diet);
  });

  test('handles NaN percentages gracefully', () => {
    const result = calculateReduction(baseEmissions, NaN, 50, 50);
    expect(Number.isFinite(result.transport)).toBe(true);
    expect(Number.isFinite(result.total)).toBe(true);
  });

  test('individual category calculations are independent', () => {
    const r1 = calculateReduction(baseEmissions, 80, 50, 50);
    const r2 = calculateReduction(baseEmissions, 50, 50, 50);
    expect(r1.transport).toBeGreaterThan(r2.transport);
    expect(r1.energy).toBe(r2.energy);
    expect(r1.diet).toBe(r2.diet);
  });

  test('transport, energy, diet sum to total', () => {
    const result = calculateReduction(baseEmissions, 33, 67, 89);
    expect(result.total).toBe(result.transport + result.energy + result.diet);
  });
});

// ─── calculateTreeEquivalent ────────────────────────────────────────────────

describe('calculateTreeEquivalent', () => {
  test('calculates correct tree count', () => {
    const result = calculateTreeEquivalent(217.7);
    expect(result).toBe(10); // 217.7 / 21.77 = 10
  });

  test('returns 0 for zero input', () => {
    expect(calculateTreeEquivalent(0)).toBe(0);
  });

  test('returns 0 for negative input', () => {
    expect(calculateTreeEquivalent(-100)).toBe(0);
  });

  test('returns 0 for NaN', () => {
    expect(calculateTreeEquivalent(NaN)).toBe(0);
  });

  test('returns 0 for Infinity', () => {
    expect(calculateTreeEquivalent(Infinity)).toBe(0);
  });

  test('rounds to nearest integer', () => {
    const result = calculateTreeEquivalent(100);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('handles large values', () => {
    const result = calculateTreeEquivalent(1000000);
    expect(result).toBe(Math.round(1000000 / CO2_PER_TREE_PER_YEAR));
  });

  test('handles very small positive values', () => {
    const result = calculateTreeEquivalent(0.01);
    expect(result).toBe(0); // rounds to 0
  });
});

// ─── calculateCarMilesEquivalent ────────────────────────────────────────────

describe('calculateCarMilesEquivalent', () => {
  test('calculates correct miles', () => {
    const result = calculateCarMilesEquivalent(404);
    expect(result).toBe(1000); // 404 / 0.404 = 1000
  });

  test('returns 0 for zero input', () => {
    expect(calculateCarMilesEquivalent(0)).toBe(0);
  });

  test('returns 0 for negative input', () => {
    expect(calculateCarMilesEquivalent(-50)).toBe(0);
  });

  test('returns 0 for NaN', () => {
    expect(calculateCarMilesEquivalent(NaN)).toBe(0);
  });

  test('returns 0 for Infinity', () => {
    expect(calculateCarMilesEquivalent(Infinity)).toBe(0);
  });

  test('rounds to nearest integer', () => {
    const result = calculateCarMilesEquivalent(100);
    expect(Number.isInteger(result)).toBe(true);
  });
});

// ─── calculateMonthlySavings ────────────────────────────────────────────────

describe('calculateMonthlySavings', () => {
  test('calculates correct savings', () => {
    expect(calculateMonthlySavings(100)).toBe(5.0); // 100 * 0.05 = 5
  });

  test('returns 0 for zero input', () => {
    expect(calculateMonthlySavings(0)).toBe(0);
  });

  test('returns 0 for negative input', () => {
    expect(calculateMonthlySavings(-50)).toBe(0);
  });

  test('returns 0 for NaN', () => {
    expect(calculateMonthlySavings(NaN)).toBe(0);
  });

  test('returns 0 for Infinity', () => {
    expect(calculateMonthlySavings(Infinity)).toBe(0);
  });

  test('rounds to 2 decimal places', () => {
    const result = calculateMonthlySavings(33);
    // 33 * 0.05 = 1.65
    expect(result).toBe(1.65);
  });

  test('handles very small values', () => {
    const result = calculateMonthlySavings(0.1);
    expect(result).toBe(0.01); // 0.1 * 0.05 = 0.005 → rounds to 0.01
  });
});

// ─── getEmissionBreakdown ───────────────────────────────────────────────────

describe('getEmissionBreakdown', () => {
  test('returns array of 3 items', () => {
    const result = getEmissionBreakdown(500, 300, 200);
    expect(result).toHaveLength(3);
  });

  test('each item has required properties', () => {
    const result = getEmissionBreakdown(500, 300, 200);
    result.forEach((item) => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('value');
      expect(item).toHaveProperty('percentage');
      expect(item).toHaveProperty('color');
    });
  });

  test('names are Transport, Home Energy, Diet & Food', () => {
    const result = getEmissionBreakdown(100, 200, 300);
    expect(result[0].name).toBe('Transport');
    expect(result[1].name).toBe('Home Energy');
    expect(result[2].name).toBe('Diet & Food');
  });

  test('percentages sum to approximately 100', () => {
    const result = getEmissionBreakdown(500, 300, 200);
    const sum = result.reduce((acc, item) => acc + item.percentage, 0);
    // Due to rounding, may be 99 or 101
    expect(sum).toBeGreaterThanOrEqual(98);
    expect(sum).toBeLessThanOrEqual(102);
  });

  test('values match inputs', () => {
    const result = getEmissionBreakdown(500, 300, 200);
    expect(result[0].value).toBe(500);
    expect(result[1].value).toBe(300);
    expect(result[2].value).toBe(200);
  });

  test('all-zero inputs return zero percentages', () => {
    const result = getEmissionBreakdown(0, 0, 0);
    result.forEach((item) => {
      expect(item.percentage).toBe(0);
      expect(item.value).toBe(0);
    });
  });

  test('single source dominates correctly', () => {
    const result = getEmissionBreakdown(1000, 0, 0);
    expect(result[0].percentage).toBe(100);
    expect(result[1].percentage).toBe(0);
    expect(result[2].percentage).toBe(0);
  });

  test('colors are valid hex strings', () => {
    const result = getEmissionBreakdown(100, 100, 100);
    result.forEach((item) => {
      expect(item.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

// ─── getEcoScore ────────────────────────────────────────────────────────────

describe('getEcoScore', () => {
  test('0 tons returns 100', () => {
    expect(getEcoScore(0)).toBe(100);
  });

  test('very high emissions return 0', () => {
    expect(getEcoScore(20)).toBe(0);
  });

  test('global average ~4.5 tons returns ~46', () => {
    expect(getEcoScore(4.5)).toBe(46);
  });

  test('target 2.0 tons returns ~76', () => {
    expect(getEcoScore(2.0)).toBe(76);
  });

  test('returns 0 for NaN input', () => {
    expect(getEcoScore(NaN)).toBe(0);
  });

  test('returns 0 for negative input', () => {
    expect(getEcoScore(-5)).toBe(0);
  });

  test('score is clamped to 0-100 range', () => {
    const lowScore = getEcoScore(100);
    const highScore = getEcoScore(0);
    expect(lowScore).toBeGreaterThanOrEqual(0);
    expect(highScore).toBeLessThanOrEqual(100);
  });

  test('higher emissions yield lower score', () => {
    const low = getEcoScore(2);
    const high = getEcoScore(6);
    expect(low).toBeGreaterThan(high);
  });

  test('score is an integer', () => {
    expect(Number.isInteger(getEcoScore(3.7))).toBe(true);
  });
});

// ─── getEcoGrade ────────────────────────────────────────────────────────────

describe('getEcoGrade', () => {
  test('score 85+ returns A+', () => {
    const result = getEcoGrade(85);
    expect(result.grade).toBe('A+');
    expect(result.label).toBe('Exceptional');
  });

  test('score 70-84 returns A', () => {
    const result = getEcoGrade(70);
    expect(result.grade).toBe('A');
    expect(result.label).toBe('Excellent');
  });

  test('score 55-69 returns B', () => {
    const result = getEcoGrade(55);
    expect(result.grade).toBe('B');
    expect(result.label).toBe('Good');
  });

  test('score 40-54 returns C', () => {
    const result = getEcoGrade(40);
    expect(result.grade).toBe('C');
    expect(result.label).toBe('Average');
  });

  test('score 25-39 returns D', () => {
    const result = getEcoGrade(25);
    expect(result.grade).toBe('D');
    expect(result.label).toBe('Below Average');
  });

  test('score below 25 returns F', () => {
    const result = getEcoGrade(10);
    expect(result.grade).toBe('F');
    expect(result.label).toBe('Needs Improvement');
  });

  test('score 0 returns F', () => {
    expect(getEcoGrade(0).grade).toBe('F');
  });

  test('score 100 returns A+', () => {
    expect(getEcoGrade(100).grade).toBe('A+');
  });

  test('each grade has a color property', () => {
    [0, 25, 40, 55, 70, 85].forEach((score) => {
      const result = getEcoGrade(score);
      expect(result.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  test('boundary at 85 is A+ not A', () => {
    expect(getEcoGrade(85).grade).toBe('A+');
    expect(getEcoGrade(84).grade).toBe('A');
  });

  test('boundary at 70 is A not B', () => {
    expect(getEcoGrade(70).grade).toBe('A');
    expect(getEcoGrade(69).grade).toBe('B');
  });

  test('boundary at 55 is B not C', () => {
    expect(getEcoGrade(55).grade).toBe('B');
    expect(getEcoGrade(54).grade).toBe('C');
  });

  test('boundary at 40 is C not D', () => {
    expect(getEcoGrade(40).grade).toBe('C');
    expect(getEcoGrade(39).grade).toBe('D');
  });

  test('boundary at 25 is D not F', () => {
    expect(getEcoGrade(25).grade).toBe('D');
    expect(getEcoGrade(24).grade).toBe('F');
  });
});
