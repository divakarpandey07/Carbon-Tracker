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
  food: ["meat", "beef", "poultry", "pork", "fish", "dairy", "vegetarian", "vegan"],
  electricity: ["grid", "solar", "renewable_mix"],
  water: ["household", "irrigation", "borewell"],
  gas: ["cooking", "heating", "lpg", "cng"],
  waste: ["landfill", "recycled", "composted", "incinerated"],
  other: ["general"],
};

export const UNITS = ["km", "miles", "kg", "meals", "kWh", "liters", "cubic_m", "hours", "count"];

export const CAR_FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "cng", label: "CNG" },
  { value: "electric", label: "Electric (EV)" },
];

export const CAR_SIZES = [
  { value: "small", label: "Small Hatchback" },
  { value: "medium", label: "Medium SUV" },
  { value: "large", label: "Large SUV / Truck" },
];

export const CAR_AGES = [
  { value: "new", label: "New (< 5 yrs)" },
  { value: "mid", label: "Mid (5 - 10 yrs)" },
  { value: "old", label: "Old (> 10 yrs)" },
];