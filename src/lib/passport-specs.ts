export interface PassportSpec {
  country: string;
  width: number; // in mm
  height: number; // in mm
  resolution: number; // in DPI
  headHeight?: { min: number; max: number }; // percentage of photo height
  headPosition?: number; // distance from top to top of head in mm
  backgroundColor?: string[];
  notes?: string;
}

export const passportSpecs: PassportSpec[] = [
  {
    country: "United States",
    width: 51,
    height: 51,
    resolution: 300,
    headHeight: { min: 50, max: 69 },
    backgroundColor: ["white", "off-white"],
    notes: "2 x 2 inches. Head must be between 1 -1 3/8 inches (25 - 35 mm) from the bottom of the chin to the top of the head.",
  },
  {
    country: "United Kingdom",
    width: 35,
    height: 45,
    resolution: 600,
    headHeight: { min: 72, max: 80 }, // Approx 29-34mm
    backgroundColor: ["light-grey", "cream"],
    notes: "Head must be between 29mm and 34mm high.",
  },
  {
    country: "Schengen Area",
    width: 35,
    height: 45,
    resolution: 600,
    headHeight: { min: 70, max: 80 }, // 32-36mm
    backgroundColor: ["light blue", "grey", "white"],
    notes: "Head height from chin to crown should be between 32mm and 36mm.",
  },
  {
    country: "Canada",
    width: 50,
    height: 70,
    resolution: 600,
    headHeight: { min: 44, max: 51 }, // 31-36mm
    backgroundColor: ["white", "light-colored"],
    notes: "The face, from chin to crown, must be between 31 mm (1 1/4 inches) and 36 mm (1 7/16 inches).",
  },
  {
    country: "Australia",
    width: 35,
    height: 45,
    resolution: 600,
    headHeight: { min: 71, max: 80 }, // 32-36mm
    backgroundColor: ["white", "light grey"],
    notes: "Size of the head, from chin to crown, can be up to a maximum of 36mm, with a minimum of 32mm.",
  },
  {
    country: "China",
    width: 33,
    height: 48,
    resolution: 300,
    headHeight: { min: 58, max: 73 }, // 28-33mm
    backgroundColor: ["white", "light blue"],
    notes: "Head width: 21-24mm. Head height: 28-33mm.",
  },
  {
    country: "India",
    width: 51,
    height: 51,
    resolution: 300,
    headHeight: { min: 67, max: 78 }, // 34-40mm
    backgroundColor: ["white"],
    notes: "2x2 inch photo. Head from top of hair to bottom of chin should be between 1 inch and 1-3/8 inches (25 mm and 35 mm).",
  },
];

export function mmToPixels(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}
