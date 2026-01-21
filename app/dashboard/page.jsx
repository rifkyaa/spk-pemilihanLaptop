import StatsCards from '@/components/dashboard/StatsCard';
import RecentLaptops from '@/components/dashboard/RecentLaptop';
import QuickActions from '@/components/dashboard/QuickAction';
import CriteriaOverview from '@/components/dashboard/CriteriaOverview';
import MPECalculationDemo from '@/components/dashboard/MPECalculationDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calculator, Trophy, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Sistem Pendukung Keputusan
          <span className="block text-primary">Pemilihan Laptop Terbaik</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Menggunakan Metode Perbandingan Eksponensial (MPE) untuk membantu mahasiswa 
          memilih laptop berdasarkan 5 kriteria: Harga, GPU, SSD, RAM, dan Processor.
        </p>
      </div>
      
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentLaptops />
          <MPECalculationDemo />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <CriteriaOverview />
          
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apa itu MPE?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Metode Perbandingan Eksponensial</p>
                <p className="text-xs text-blue-700 mt-1">
                  Metode SPK yang menghitung prioritas alternatif menggunakan eksponen.
                  Semakin tinggi bobot kriteria, semakin besar pengaruhnya terhadap hasil.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Rumus Utama</p>
                <p className="text-xs text-green-700 mt-1 font-mono">
                  TN = Σ(RK^bobot)<br/>
                  TN = Total Nilai, RK = Nilai Kriteria (1-5)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Bottom Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">5 Kriteria</h3>
                <p className="text-sm text-gray-600">Harga, GPU, SSD, RAM, Processor</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Metode MPE</h3>
                <p className="text-sm text-gray-600">Perhitungan eksponensial untuk ranking</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Hasil Akurat</h3>
                <p className="text-sm text-gray-600">Rekomendasi berdasarkan data & perhitungan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}