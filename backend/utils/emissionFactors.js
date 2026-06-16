const emissionFactors = {
  transport: {
    car: 0.192,
    bike: 0.0,
    bus: 0.089,
    train: 0.041,
    flight: 0.255,
    walk: 0.0,
  },
  food: {
    meat: 6.61,
    dairy: 1.9,
    vegetarian: 1.7,
    vegan: 0.9,
  },
  electricity: {
    grid: 0.475,
    solar: 0.041,
  },
  water: {
    household: 0.344,
    irrigation: 0.15,
  },
  gas: {
    cooking: 2.983,
    heating: 2.983,
  },
  waste: {
    recycled: 0.021,
    landfill: 0.58,
  },
  other: {
    general: 0.5,
  },
};

const calculateCO2 = (category, subType, quantity) => {
  const categoryFactors = emissionFactors[category];
  if (!categoryFactors) return 0;

  const factor = categoryFactors[subType];
  if (factor === undefined) return 0;

  const co2 = factor * Number(quantity);
  return Math.round(co2 * 1000) / 1000;
};

module.exports = { emissionFactors, calculateCO2 };