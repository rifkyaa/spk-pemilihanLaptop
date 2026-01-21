// RENTANG KONVERSI NILAI 1-5

export const CONVERSION_RANGES = {
  // HARGA (dalam Rupiah) - DIPERBAIKI MENJADI 5 SKALA
  harga: [
    { max: 16000000, nilai: 1 },                       // < 16jt = 1
    { min: 17000000, max: 18000000, nilai: 2 },        // 17-18jt = 2
    { min: 18000000, max: 19000000, nilai: 3 },        // 18-19jt = 3
    { min: 19000000, max: 20000000, nilai: 4 },        // 19-20jt = 4
    { min: 20000000, nilai: 5 }                       // >= 20jt = 5
  ],
  
  // GPU (numeric comparison based on model number)
  gpu: [
    { max: 2050, nilai: 1 },                           // < RTX 2050 = 1
    { min: 2050, max: 2080, nilai: 2 },                // RTX 2050-2080 = 2
    { min: 2080, max: 3090, nilai: 3 },                // RTX 2080-3090 = 3
    { min: 3090, max: 4090, nilai: 4 },                // RTX 3090-4090 = 4
    { min: 4090, nilai: 5 }                           // >= RTX 4090 = 5
  ],
  
  // SSD (dalam GB)
  ssd: [
    { max: 128, nilai: 1 },                            // < 128 GB = 1
    { min: 129, max: 255, nilai: 2 },                  // 129-255 GB = 2
    { min: 256, max: 511, nilai: 3 },                  // 256-511 GB = 3
    { min: 512, max: 999, nilai: 4 },                  // 512-999 GB = 4
    { min: 1000, max: 1999, nilai: 5 }                 // 1-2 TB (1000-1999 GB) = 5
  ],
  
  // RAM (dalam GB)
  ram: [
    { max: 8, nilai: 1 },                              // < 8 GB = 1
    { min: 9, max: 11, nilai: 2 },                     // 9-11 GB = 2
    { min: 12, max: 15, nilai: 3 },                    // 12-15 GB = 3
    { min: 16, max: 31, nilai: 4 },                    // 16-31 GB = 4
    { min: 32, max: 64, nilai: 5 }                     // 32-64 GB = 5
  ],
  
  // PROCESSOR (model comparison)
  processor: [
    { max: 'i3', nilai: 1 },                           // < Core i3 = 1
    { min: 'i5', max: 'i6', nilai: 2 },                // Core i5 - i6 = 2
    { min: 'i7', max: 'i8', nilai: 3 },                // Core i7 - i8 = 3
    { min: 'i9', nilai: 4 }                           // >= Core i9 = 4
  ]
};

/**
 * BOBOT DEFAULT (dari Excel)
 * Note: Harga adalah COST, lainnya BENEFIT
 */
export const DEFAULT_WEIGHTS = {
  harga: 5,      // Cost → sangat tidak penting = 1
  gpu: 4,        // Benefit → tidak penting = 2
  ssd: 3,        // Benefit → cukup penting = 3
  ram: 3,        // Benefit → penting = 4
  processor: 4   // Benefit → sangat penting = 5
};

/**
 * DATA SAMPEL dari Excel Anda
 */
export const SAMPLE_LAPTOPS = [
  {
    id: 1,
    name: "Legion 5",
    harga: 19500000,
    gpu: "RTX 5050",
    ssd: 512,
    ram: 16,
    processor: "i7"
  },
  {
    id: 2,
    name: "Acer Nitro 5",
    harga: 18300000,
    gpu: "RTX 4060",
    ssd: 1024,
    ram: 20,
    processor: "i9"
  },
  {
    id: 3,
    name: "ASUS ROG Strix G16",
    harga: 19100000,
    gpu: "RTX 4050",
    ssd: 1024,
    ram: 32,
    processor: "i7"
  },
  {
    id: 4,
    name: "Lenovo LOQ 15",
    harga: 17500000,
    gpu: "RTX 4050",
    ssd: 512,
    ram: 12,
    processor: "i7"
  },
  {
    id: 5,
    name: "HP Victus 16",
    harga: 18100000,
    gpu: "RTX 4060",
    ssd: 1024,
    ram: 32,
    processor: "i7"
  }
];