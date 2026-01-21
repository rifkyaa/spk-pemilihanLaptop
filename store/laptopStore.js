import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WEIGHTS, SAMPLE_LAPTOPS } from '@/lib/constants/ranges';
import { calculateMPE } from '@/lib/utils/mpeCalculator';

export const useLaptopStore = create(
  persist(
    (set, get) => ({
      // STATE
      laptops: [],
      criteriaWeights: DEFAULT_WEIGHTS,
      calculationResults: null,
      
      // ACTIONS - LAPTOP
      addLaptop: (laptopData) => {
        const newLaptop = {
          id: Date.now(), // Simple ID generator
          ...laptopData,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          laptops: [...state.laptops, newLaptop]
        }));
      },
      
      updateLaptop: (id, updatedData) => {
        set((state) => ({
          laptops: state.laptops.map(laptop =>
            laptop.id === id ? { ...laptop, ...updatedData } : laptop
          )
        }));
      },
      
      removeLaptop: (id) => {
        set((state) => ({
          laptops: state.laptops.filter(laptop => laptop.id !== id)
        }));
      },
      
      clearLaptops: () => set({ laptops: [] }),
      
      loadSampleData: () => set({ laptops: SAMPLE_LAPTOPS }),
      
      // ACTIONS - CRITERIA WEIGHTS
      updateWeight: (criteria, value) => {
        set((state) => ({
          criteriaWeights: {
            ...state.criteriaWeights,
            [criteria]: parseInt(value) || 1
          }
        }));
      },
      
      setAllWeights: (weights) => set({ criteriaWeights: weights }),
      
      resetWeights: () => set({ criteriaWeights: DEFAULT_WEIGHTS }),
      
      // ACTIONS - CALCULATION
      calculateResults: () => {
        const { laptops, criteriaWeights } = get();
        const results = calculateMPE(laptops, criteriaWeights);
        set({ calculationResults: results });
        return results;
      },
      
      clearResults: () => set({ calculationResults: null }),
      
      // GETTERS
      getLaptopCount: () => get().laptops.length,
      
      getCriteriaInfo: () => {
        const weights = get().criteriaWeights;
        return Object.entries(weights).map(([key, value]) => ({
          name: key,
          weight: value,
          attribute: key === 'harga' ? 'Cost' : 'Benefit',
          importance: getImportanceLabel(value)
        }));
      }
    }),
    {
      name: 'laptop-spk-storage', // localStorage key
      partialize: (state) => ({
        laptops: state.laptops,
        criteriaWeights: state.criteriaWeights
        // calculationResults tidak disimpan
      })
    }
  )
);

// Helper function
function getImportanceLabel(weight) {
  const labels = {
    1: 'Sangat Tidak Penting',
    2: 'Tidak Penting',
    3: 'Cukup Penting',
    4: 'Penting',
    5: 'Sangat Penting'
  };
  return labels[weight] || 'Tidak Diketahui';
}