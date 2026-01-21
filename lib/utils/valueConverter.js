import { CONVERSION_RANGES } from '@/lib/constants/ranges';

/**
 * Konversi nilai spesifikasi ke skala 1-5
 * berdasarkan rentang yang sudah ditentukan
 */
export function convertToScore(value, criteria) {
  const ranges = CONVERSION_RANGES[criteria];
  
  if (!ranges) return 1;
  
  // Untuk kriteria numerik (harga, ssd, ram)
  if (typeof value === 'number') {
    // Khusus untuk HARGA: handle gap 16-17jt
    if (criteria === 'harga') {
      if (value >= 16000000 && value < 17000000) {
        return 1; // Gap: harga antara 16-17jt tetap nilai 1
      }
    }
    
    for (const range of ranges) {
      const isBelowMax = range.max !== undefined && value < range.max;
      const isAboveMin = range.min !== undefined && value >= range.min;
      const isNoMin = range.min === undefined;
      const isNoMax = range.max === undefined;
      
      // Logika untuk range yang berbeda-beda
      if (isNoMin && isBelowMax) {
        return range.nilai; // Contoh: harga < 16jt
      } else if (isNoMax && isAboveMin) {
        return range.nilai; // Contoh: harga >= 20jt
      } else if (isAboveMin && isBelowMax) {
        return range.nilai; // Contoh: harga 17-18jt, 18-19jt, 19-20jt
      } else if (range.max !== undefined && value === range.max && range.min === undefined) {
        return range.nilai; // Untuk kasus <= max
      }
    }
  }
  
  // Untuk kriteria GPU (ekstrak angka dari string)
  if (criteria === 'gpu' && typeof value === 'string') {
    const gpuMatch = value.match(/\d+/);
    if (gpuMatch) {
      const gpuNumber = parseInt(gpuMatch[0]);
      
      for (const range of ranges) {
        const isBelowMax = range.max !== undefined && gpuNumber < range.max;
        const isAboveMin = range.min !== undefined && gpuNumber >= range.min;
        const isNoMin = range.min === undefined;
        const isNoMax = range.max === undefined;
        
        if (isNoMin && isBelowMax) {
          return range.nilai; // < RTX 2050
        } else if (isNoMax && isAboveMin) {
          return range.nilai; // >= RTX 4090
        } else if (isAboveMin && isBelowMax) {
          return range.nilai; // Range 2050-2080, 2080-3090, 3090-4090
        }
      }
    }
    return 1; // Default jika tidak match
  }
  
  // Untuk kriteria Processor (string comparison)
  if (criteria === 'processor' && typeof value === 'string') {
    const procLower = value.toLowerCase();
    
    // Extract processor number
    const procMatch = procLower.match(/i[0-9]/);
    if (procMatch) {
      const procModel = procMatch[0]; // i3, i5, i7, i9
      
      for (const range of ranges) {
        const isBelowMax = range.max && procModel < range.max;
        const isAboveMin = range.min && procModel >= range.min;
        const isNoMin = range.min === undefined;
        const isNoMax = range.max === undefined;
        
        if (isNoMin && isBelowMax) {
          return range.nilai; // < i3
        } else if (isNoMax && isAboveMin) {
          return range.nilai; // >= i9
        } else if (isAboveMin && isBelowMax) {
          return range.nilai; // Range i5-i6, i7-i8
        } else if (range.max && procModel === range.max && range.min === undefined) {
          return range.nilai; // Untuk kasus <= max
        }
      }
    }
    return 1; // Default
  }
  
  return 1; // Default nilai terendah jika tidak ada yang match
}

/**
 * Fungsi helper untuk menampilkan range konversi dengan penjelasan
 */
export function getConversionInfo(criteria) {
  const ranges = CONVERSION_RANGES[criteria];
  if (!ranges) return [];
  
  const info = ranges.map(range => {
    if (range.min !== undefined && range.max !== undefined) {
      return {
        range: `${formatNumber(range.min)} - ${formatNumber(range.max)}`,
        nilai: range.nilai,
        description: `>= ${formatNumber(range.min)} - < ${formatNumber(range.max)}`
      };
    } else if (range.max !== undefined && range.min === undefined) {
      return {
        range: `< ${formatNumber(range.max)}`,
        nilai: range.nilai,
        description: `< ${formatNumber(range.max)}`
      };
    } else if (range.min !== undefined && range.max === undefined) {
      return {
        range: `>= ${formatNumber(range.min)}`,
        nilai: range.nilai,
        description: `>= ${formatNumber(range.min)}`
      };
    }
    return null;
  }).filter(Boolean);
  
  // Khusus untuk harga: tambah info tentang gap
  if (criteria === 'harga') {
    info.push({
      range: "16-17jt",
      nilai: 1,
      description: "Gap: 16-17jt (tetap nilai 1)",
      isGap: true
    });
  }
  
  return info;
}

// Helper untuk format angka
function formatNumber(num) {
  if (num >= 1000000) {
    return `Rp ${(num / 1000000).toFixed(1)}jt`.replace('.0', '');
  }
  return num.toString();
}

/**
 * Konversi semua spesifikasi laptop ke skala 1-5
 */
export function convertLaptopToScores(laptop) {
  return {
    name: laptop.name,
    scores: {
      harga: convertToScore(laptop.harga, 'harga'),
      gpu: convertToScore(laptop.gpu, 'gpu'),
      ssd: convertToScore(laptop.ssd, 'ssd'),
      ram: convertToScore(laptop.ram, 'ram'),
      processor: convertToScore(laptop.processor, 'processor')
    },
    raw: laptop
  };
}