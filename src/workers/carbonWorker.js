const BASELINES = {
  transport: 1500,
  energy: 1200,
  diet: 1500,
};

function clamp(value, min, max) {
  if (!isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function calculateReduction(baseEmissions, commutePercent, energyPercent, dietPercent) {
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

self.addEventListener('message', (event) => {
  const { id, type, payload } = event.data;
  
  if (type === 'CALCULATE_REDUCTION') {
    const { baseEmissions, commute, energy, diet } = payload;
    const result = calculateReduction(baseEmissions, commute, energy, diet);
    self.postMessage({ id, result });
  }
});
