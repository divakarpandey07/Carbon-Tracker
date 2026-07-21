const carFactors = {
  petrol: { small: 0.142, medium: 0.192, large: 0.278 },
  diesel: { small: 0.131, medium: 0.171, large: 0.249 },
  cng: { small: 0.098, medium: 0.132, label: 0.184 },
  electric: { small: 0.045, medium: 0.065, large: 0.090 },
};

const carAgeMultipliers = {
  new: 0.85,    // < 5 years old (more efficient engine/emissions standards)
  mid: 1.0,     // 5 - 10 years old
  old: 1.25,    // > 10 years old (degraded engine, higher emissions)
};

const emissionFactors = {
  transport: {
    car: 0.192, // fallback
    bike: 0.0,
    bus: 0.089,
    train: 0.041,
    flight: 0.255,
    walk: 0.0,
  },
  food: {
    meat: 6.61,
    beef: 27.0,
    poultry: 6.9,
    pork: 12.0,
    fish: 5.4,
    dairy: 1.9,
    vegetarian: 1.7,
    vegan: 0.9,
  },
  electricity: {
    grid: 0.716, // Grid average CO2 (kg/kWh)
    solar: 0.041,
    renewable_mix: 0.25,
  },
  water: {
    household: 0.344,
    irrigation: 0.15,
    borewell: 0.12,
  },
  gas: {
    cooking: 2.983,
    heating: 2.983,
    lpg: 2.983,
    cng: 2.204,
  },
  waste: {
    landfill: 0.58,
    recycled: 0.021,
    composted: 0.05,
    incinerated: 0.90,
  },
  other: {
    general: 0.5,
  },
};

const calculateCO2 = (category, subType, quantity, metadata = {}) => {
  const numQty = Number(quantity);
  if (isNaN(numQty) || numQty <= 0) return 0;

  let factor = 0;

  if (category === "transport" && subType === "car") {
    const fuel = (metadata.fuelType || "petrol").toLowerCase();
    const size = (metadata.carSize || "medium").toLowerCase();
    const age = (metadata.carAge || "mid").toLowerCase();

    const baseFactor = carFactors[fuel]?.[size] ?? 0.192;
    const ageMultiplier = carAgeMultipliers[age] ?? 1.0;
    
    factor = baseFactor * ageMultiplier;
  } else {
    const categoryFactors = emissionFactors[category];
    if (categoryFactors) {
      factor = categoryFactors[subType] ?? categoryFactors.general ?? 0;
    }
  }

  const co2 = factor * numQty;
  return Math.round(co2 * 1000) / 1000;
};

module.exports = { emissionFactors, carFactors, carAgeMultipliers, calculateCO2 };