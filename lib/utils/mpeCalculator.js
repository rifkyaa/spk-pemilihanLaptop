import { convertLaptopToScores } from './valueConverter';

/**
 * Hitung Total Nilai (TN) dengan rumus MPE:
 * TN = Σ(RK ^ bobot)
 * dimana RK = nilai konversi kriteria (1-5)
 */
export function calculateMPE(laptops, weights) {
  if (!laptops.length || !weights) return [];
  
  // 1. Konversi semua laptop ke skala 1-5
  const convertedLaptops = laptops.map(laptop => ({
    ...convertLaptopToScores(laptop),
    raw: laptop
  }));
  
  // 2. Hitung TN untuk setiap laptop
  const results = convertedLaptops.map(laptop => {
    let totalScore = 0;
    const calculationSteps = {};
    
    // Untuk setiap kriteria, hitung: nilai^bobot
    Object.keys(laptop.scores).forEach(criteria => {
      const score = laptop.scores[criteria];
      const weight = weights[criteria];
      const poweredValue = Math.pow(score, weight);
      
      totalScore += poweredValue;
      calculationSteps[criteria] = {
        nilai: score,
        bobot: weight,
        hasil: poweredValue,
        rumus: `${score}^${weight} = ${poweredValue}`
      };
    });
    
    return {
      ...laptop,
      totalScore: Math.round(totalScore * 100) / 100, // Bulatkan 2 desimal
      calculationSteps,
      rank: 0 // Akan diisi setelah sorting
    };
  });
  
  // 3. Urutkan berdasarkan totalScore (descending)
  const sortedResults = results.sort((a, b) => b.totalScore - a.totalScore);
  
  // 4. Tambahkan ranking
  return sortedResults.map((result, index) => ({
    ...result,
    rank: index + 1
  }));
}

/**
 * Validasi apakah data cukup untuk perhitungan
 */
export function validateCalculation(laptops, weights) {
  const errors = [];
  
  if (laptops.length < 2) {
    errors.push('Minimal 2 laptop untuk dibandingkan');
  }
  
  const requiredCriteria = ['harga', 'gpu', 'ssd', 'ram', 'processor'];
  for (const criteria of requiredCriteria) {
    if (!weights[criteria]) {
      errors.push(`Bobot untuk kriteria ${criteria} belum diatur`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}