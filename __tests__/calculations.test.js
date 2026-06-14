describe('Carbon Footprint Calculations', () => {
  const calculateEmissions = (base, commuteReduction, energyReduction) => {
    const commuteImpact = 1500 * (commuteReduction / 100);
    const energyImpact = 1200 * (energyReduction / 100);
    return base - commuteImpact - energyImpact;
  };

  it('should calculate reduced emissions correctly', () => {
    const baseEmissions = 4200;
    const result = calculateEmissions(baseEmissions, 50, 50); // 50% reduction in transport & energy
    // 1500 * 0.5 = 750
    // 1200 * 0.5 = 600
    // 4200 - 1350 = 2850
    expect(result).toBe(2850);
  });

  it('should handle zero reductions correctly', () => {
    expect(calculateEmissions(4200, 0, 0)).toBe(4200);
  });
});
