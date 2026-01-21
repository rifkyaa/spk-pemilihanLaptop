'use client';

import { useLaptopStore } from '@/store/laptopStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, Cpu, HardDrive, MemoryStick, 
  TrendingUp, TrendingDown, Settings
} from 'lucide-react';

export default function CriteriaOverview() {
  const { criteriaWeights } = useLaptopStore();
  
  const criteriaData = [
    {
      name: 'Harga',
      key: 'harga',
      icon: <DollarSign className="h-4 w-4" />,
      attribute: 'Cost',
      description: 'Lebih rendah lebih baik',
      weight: criteriaWeights.harga,
      maxWeight: 5,
      color: 'bg-red-100 text-red-700',
      barColor: 'bg-red-500'
    },
    {
      name: 'GPU',
      key: 'gpu',
      icon: <Cpu className="h-4 w-4" />,
      attribute: 'Benefit',
      description: 'Lebih tinggi lebih baik',
      weight: criteriaWeights.gpu,
      maxWeight: 5,
      color: 'bg-blue-100 text-blue-700',
      barColor: 'bg-blue-500'
    },
    {
      name: 'SSD',
      key: 'ssd',
      icon: <HardDrive className="h-4 w-4" />,
      attribute: 'Benefit',
      description: 'Kapasitas lebih besar lebih baik',
      weight: criteriaWeights.ssd,
      maxWeight: 5,
      color: 'bg-green-100 text-green-700',
      barColor: 'bg-green-500'
    },
    {
      name: 'RAM',
      key: 'ram',
      icon: <MemoryStick className="h-4 w-4" />,
      attribute: 'Benefit',
      description: 'Kapasitas lebih besar lebih baik',
      weight: criteriaWeights.ram,
      maxWeight: 5,
      color: 'bg-purple-100 text-purple-700',
      barColor: 'bg-purple-500'
    },
    {
      name: 'Processor',
      key: 'processor',
      icon: <Cpu className="h-4 w-4" />,
      attribute: 'Benefit',
      description: 'Lebih tinggi lebih baik',
      weight: criteriaWeights.processor,
      maxWeight: 5,
      color: 'bg-amber-100 text-amber-700',
      barColor: 'bg-amber-500'
    }
  ];

  const getImportanceLabel = (weight) => {
    const labels = {
      1: { label: 'Sangat Tidak Penting', color: 'bg-gray-100 text-gray-800' },
      2: { label: 'Tidak Penting', color: 'bg-gray-200 text-gray-800' },
      3: { label: 'Cukup Penting', color: 'bg-blue-100 text-blue-800' },
      4: { label: 'Penting', color: 'bg-green-100 text-green-800' },
      5: { label: 'Sangat Penting', color: 'bg-red-100 text-red-800' }
    };
    return labels[weight] || { label: 'Tidak Diketahui', color: 'bg-gray-100' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Kriteria & Bobot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criteriaData.map((criteria) => {
            const importance = getImportanceLabel(criteria.weight);
            const percentage = (criteria.weight / criteria.maxWeight) * 100;
            
            return (
              <div key={criteria.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${criteria.color}`}>
                      {criteria.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{criteria.name}</span>
                        <Badge variant={criteria.attribute === 'Cost' ? 'destructive' : 'default'}>
                          {criteria.attribute}
                        </Badge>
                        {criteria.attribute === 'Cost' ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{criteria.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{criteria.weight}</div>
                    <Badge className={`${importance.color} text-xs`}>
                      {importance.label}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className={`h-2 rounded-full ${criteria.barColor} transition-all`} 
                         style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">Bobot: {criteria.weight}/5</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Total Weight */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Bobot</p>
              <p className="text-xs text-gray-600">Σ semua kriteria</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Object.values(criteriaWeights).reduce((a, b) => a + b, 0)}
              </div>
              <p className="text-xs text-gray-600">dari 25 maksimal</p>
            </div>
          </div>
        </div>
        
        {/* Info MPE */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Rumus MPE</p>
          <p className="text-xs text-blue-700">
            TN = Σ(RK^bobot) | RK = Nilai konversi (1-5)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Semakin tinggi bobot, semakin besar pengaruh kriteria terhadap hasil
          </p>
        </div>
      </CardContent>
    </Card>
  );
}