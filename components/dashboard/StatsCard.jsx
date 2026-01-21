'use client';

import { useLaptopStore } from '@/store/laptopStore';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Laptop, Calculator, Trophy, Settings,
  CheckCircle, AlertCircle, TrendingUp, Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StatsCards() {
  const { laptops, criteriaWeights } = useLaptopStore();
  const laptopCount = laptops.length;
  
  const stats = [
    {
      title: 'Total Laptop',
      value: laptopCount,
      icon: <Laptop className="h-5 w-5" />,
      description: 'Laptop yang dibandingkan',
      color: 'bg-blue-100 text-blue-600',
      badge: laptopCount >= 2 ? (
        <Badge variant="success">Siap</Badge>
      ) : (
        <Badge variant="warning">Butuh {2 - laptopCount} lagi</Badge>
      )
    },
    {
      title: 'Kriteria',
      value: '5',
      icon: <Settings className="h-5 w-5" />,
      description: 'Harga, GPU, SSD, RAM, Processor',
      color: 'bg-purple-100 text-purple-600',
      badge: <Badge variant="info">MPE</Badge>
    },
    {
      title: 'Bobot Terpasang',
      value: Object.values(criteriaWeights).reduce((a, b) => a + b, 0),
      icon: <Calculator className="h-5 w-5" />,
      description: 'Total bobot kriteria',
      color: 'bg-green-100 text-green-600',
      badge: <Badge variant="outline">Σ = {Object.values(criteriaWeights).reduce((a, b) => a + b, 0)}</Badge>
    },
    {
      title: 'Status Sistem',
      value: laptopCount >= 2 ? 'Aktif' : 'Menunggu',
      icon: laptopCount >= 2 ? 
        <CheckCircle className="h-5 w-5" /> : 
        <AlertCircle className="h-5 w-5" />,
      description: laptopCount >= 2 ? 
        'Siap untuk perhitungan' : 
        'Tambahkan minimal 2 laptop',
      color: laptopCount >= 2 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600',
      badge: laptopCount >= 2 ? (
        <Badge variant="success">Ready</Badge>
      ) : (
        <Badge variant="warning">Waiting</Badge>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              {stat.badge}
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <span className="text-sm text-gray-500">{stat.title}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}