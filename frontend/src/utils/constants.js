export const CATEGORIES = [
  { value: "transport", label: "Transport" },
  { value: "food", label: "Food" },
  { value: "electricity", label: "Electricity" },
  { value: "water", label: "Water" },
  { value: "gas", label: "Gas" },
  { value: "waste", label: "Waste" },
  { value: "other", label: "Other" },
];

export const SUBTYPES = {
  transport: ["car", "bike", "bus", "train", "flight", "walk"],
  food: ["meat", "dairy", "vegetarian", "vegan"],
  electricity: ["grid", "solar"],
  water: ["household", "irrigation"],
  gas: ["cooking", "heating"],
  waste: ["recycled", "landfill"],
  other: ["general"],
};

export const UNITS = ["km", "miles", "kg", "meals", "kWh", "liters", "cubic_m", "hours", "count"];