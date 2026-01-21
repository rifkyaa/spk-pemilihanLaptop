'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLaptopStore } from '@/store/laptopStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Trophy, Download, Share2, Printer, ArrowLeft, 
  BarChart3, TrendingUp, Award, CheckCircle,
  DollarSign, Cpu, HardDrive, MemoryStick
} from 'lucide-react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';

// Komponen Chart sederhana (tanpa install library)
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-32 text-sm truncate">{item.label}</div>
          <div className="flex-1 ml-4">
            <div className="relative h-6 bg-gray-100 rounded overflow-hidden">
              <div 
                className={`absolute h-full ${
                  index === 0 ? 'bg-green-500' :
                  index === 1 ? 'bg-blue-500' :
                  index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-xs font-bold text-white mix-blend-difference">
                  {item.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const { laptops, criteriaWeights, calculationResults } = useLaptopStore();
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (calculationResults && calculationResults.length > 0) {
      setResults(calculationResults);
    } else if (laptops.length >= 2) {
      // Jika belum dihitung tapi ada data, redirect ke calculate
      router.push('/calculate');
    }
  }, [calculationResults, laptops, router]);
  
  const handleExportPDF = () => {
    const data = {
      title: 'Hasil SPK Pemilihan Laptop - Metode MPE',
      date: new Date().toLocaleDateString('id-ID'),
      results: results,
      criteria: criteriaWeights
    };
    
    // Simulasi export (bisa dikembangkan dengan jsPDF)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hasil-spk-laptop-${new Date().getTime()}.json`;
    a.click();
    
    alert('Hasil berhasil diexport!');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hasil SPK Pemilihan Laptop',
        text: `Laptop terbaik: ${results[0]?.raw.name} dengan TN ${results[0]?.totalScore}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link disalin ke clipboard!');
    }
  };
  
  if (!results.length) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Belum Ada Hasil</h2>
            <p className="text-gray-600 mb-6">
              Lakukan perhitungan terlebih dahulu untuk melihat hasil ranking
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/calculate">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ke Halaman Perhitungan
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/input">
                  Tambah Data Laptop
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const bestLaptop = results[0];
  const criteriaIcons = {
    harga: <DollarSign className="h-4 w-4" />,
    gpu: <Cpu className="h-4 w-4" />,
    ssd: <HardDrive className="h-4 w-4" />,
    ram: <MemoryStick className="h-4 w-4" />,
    processor: <Cpu className="h-4 w-4" />
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hasil Ranking</h1>
            <p className="text-gray-600">
              Rekomendasi laptop terbaik berdasarkan perhitungan MPE
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      {/* Pemenang */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  #1
                </Badge>
              </div>
              <div>
                <Badge variant="success" className="mb-2">
                  REKOMENDASI TERBAIK
                </Badge>
                <h2 className="text-3xl font-bold">{bestLaptop.raw.name}</h2>
                <p className="text-gray-600 mt-1">
                  Total Nilai (TN): <span className="font-bold text-2xl text-green-600">
                    {bestLaptop.totalScore.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(bestLaptop.scores).map(([criteria, score]) => (
                <div key={criteria} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {criteriaIcons[criteria]}
                    <span className="text-xs capitalize">{criteria}</span>
                  </div>
                  <div className="text-lg font-bold">{score}</div>
                  <div className="text-xs text-gray-500">
                    bobot: {criteriaWeights[criteria]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">Harga</p>
                <p className="font-bold">{formatRupiah(bestLaptop.raw.harga)}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">GPU</p>
                <p className="font-bold">{bestLaptop.raw.gpu}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">SSD</p>
                <p className="font-bold">
                  {bestLaptop.raw.ssd >= 1000 
                    ? `${bestLaptop.raw.ssd/1000} TB` 
                    : `${bestLaptop.raw.ssd} GB`
                  }
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">RAM</p>
                <p className="font-bold">{bestLaptop.raw.ram} GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Ranking Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Lengkap</CardTitle>
              <CardDescription>
                Urutan semua laptop berdasarkan Total Nilai (TN)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Nama Laptop</TableHead>
                    <TableHead>Total Nilai (TN)</TableHead>
                    <TableHead>Detail Nilai</TableHead>
                    <TableHead className="text-right">Spesifikasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.raw.id} className={
                      result.rank === 1 ? 'bg-green-50' : 
                      result.rank === 2 ? 'bg-blue-50' : 
                      result.rank === 3 ? 'bg-yellow-50' : ''
                    }>
                      <TableCell>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          result.rank === 1 ? 'bg-green-100 text-green-800' :
                          result.rank === 2 ? 'bg-blue-100 text-blue-800' :
                          result.rank === 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="font-bold">{result.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.raw.name}
                        {result.rank <= 3 && (
                          <Badge variant={result.rank === 1 ? "success" : "outline"} className="ml-2">
                            {result.rank === 1 ? 'Terbaik' : result.rank === 2 ? 'Kedua' : 'Ketiga'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xl font-bold">{result.totalScore.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {Object.entries(result.scores).map(([criteria, score]) => (
                            <Badge key={criteria} variant="outline" className="text-xs">
                              {criteria.slice(0,1).toUpperCase()}: {score}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/input?edit=${result.raw.id}`}>
                            Lihat
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Charts & Info */}
        <div className="space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Total Nilai</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={results.slice(0, 5).map(result => ({
                  label: result.raw.name,
                  value: result.totalScore
                }))}
              />
            </CardContent>
          </Card>
          
          {/* Bobot Kriteria */}
          <Card>
            <CardHeader>
              <CardTitle>Bobot Kriteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(criteriaWeights).map(([criteria, weight]) => (
                  <div key={criteria} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {criteriaIcons[criteria]}
                      <span className="capitalize">{criteria}</span>
                      <Badge variant={criteria === 'harga' ? "destructive" : "default"}>
                        {criteria === 'harga' ? 'Cost' : 'Benefit'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{weight}</div>
                      <div className="text-xs text-gray-500">
                        {weight === 5 ? 'Sangat Penting' :
                         weight === 4 ? 'Penting' :
                         weight === 3 ? 'Cukup' :
                         weight === 2 ? 'Rendah' : 'Sangat Rendah'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rata-rata TN</span>
                  <span className="font-bold">
                    {(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selisih #1 & #2</span>
                  <span className="font-bold">
                    {(results[0].totalScore - results[1].totalScore).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jumlah Laptop</span>
                  <span className="font-bold">{results.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/calculate">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Perhitungan
          </Link>
        </Button>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download Hasil
          </Button>
          <Button asChild>
            <Link href="/">
              <CheckCircle className="mr-2 h-4 w-4" />
              Selesai
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}