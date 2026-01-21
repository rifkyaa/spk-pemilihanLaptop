'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, Hash, Sigma, TrendingUp,
  ChevronRight, ChevronDown, Eye, EyeOff
} from 'lucide-react';

export default function MPECalculationDemo() {
  const [showDetails, setShowDetails] = useState(false);
  
  // Contoh perhitungan dari Excel
  const exampleCalculation = {
    laptop: "Legion 5",
    criteria: [
      { name: "Harga", nilai: 5, bobot: 5, hasil: Math.pow(5, 5) },
      { name: "GPU", nilai: 5, bobot: 4, hasil: Math.pow(5, 4) },
      { name: "SSD", nilai: 4, bobot: 3, hasil: Math.pow(4, 3) },
      { name: "RAM", nilai: 4, bobot: 3, hasil: Math.pow(4, 3) },
      { name: "Processor", nilai: 3, bobot: 4, hasil: Math.pow(3, 4) }
    ],
    total: 3125 + 625 + 64 + 64 + 81 // Sesuai Excel Anda
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Demo Perhitungan MPE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">Contoh: {exampleCalculation.laptop}</h4>
                <p className="text-sm text-gray-600">Total Nilai (TN) = Σ(Nilai^Bobot)</p>
              </div>
              <Badge variant="success" className="text-lg">
                TN = {exampleCalculation.total}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Sembunyikan Detail
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail Perhitungan
                </>
              )}
            </Button>
          </div>
          
          {showDetails && (
            <div className="space-y-3">
              {exampleCalculation.criteria.map((criteria, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Hash className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{criteria.name}</p>
                      <p className="text-xs text-gray-600">Nilai: {criteria.nilai} | Bobot: {criteria.bobot}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold">
                      {criteria.nilai}<sup>{criteria.bobot}</sup> = {criteria.hasil}
                    </div>
                    <div className="text-xs text-gray-500">
                      {criteria.nilai}^ {criteria.bobot}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sigma className="h-5 w-5 text-primary" />
                    <span className="font-bold">TOTAL NILAI (TN)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {exampleCalculation.total}
                    </div>
                    <p className="text-sm text-gray-600">
                      = {exampleCalculation.criteria.map(c => c.hasil).join(' + ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* How it Works */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Cara Kerja MPE
            </h4>
            <ol className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center">1</span>
                Konversi spesifikasi ke skala 1-5 berdasarkan rentang
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center">2</span>
                Pangkatkan nilai konversi dengan bobot kriteria
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center">3</span>
                Jumlahkan semua hasil perhitungan kriteria
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center">4</span>
                Urutkan laptop berdasarkan Total Nilai (TN) tertinggi
              </li>
            </ol>
          </div>
          
          {/* CTA */}
          <Button className="w-full" asChild>
            <a href="/calculate">
              Coba Hitung Sekarang
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}