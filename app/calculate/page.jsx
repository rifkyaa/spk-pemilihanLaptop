'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLaptopStore } from '@/store/laptopStore';
import { convertToScore, getConversionInfo } from '@/lib/utils/valueConverter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calculator, ArrowRight, CheckCircle, AlertCircle, 
  Download, Eye, EyeOff, ChevronRight, BarChart3,
  DollarSign, Cpu, HardDrive, MemoryStick, Hash, Info
} from 'lucide-react';
import Link from 'next/link';
import { formatRupiah, formatStorage } from '@/lib/utils';

export default function CalculatePage() {
  const router = useRouter();
  const { laptops, criteriaWeights, calculateResults, calculationResults } = useLaptopStore();
  const [showDetailedCalculation, setShowDetailedCalculation] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(calculationResults || []);
  const [showConversionInfo, setShowConversionInfo] = useState(false);
  
  // Validasi data
  const hasEnoughData = laptops.length >= 2;
  const missingLaptops = 2 - laptops.length;
  
  // Hitung MPE
  const handleCalculate = () => {
    if (!hasEnoughData) return;
    
    setIsCalculating(true);
    setTimeout(() => {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setIsCalculating(false);
    }, 1000);
  };
  
  // Auto calculate jika ada data
  useEffect(() => {
    if (hasEnoughData && laptops.length > 0 && !results.length) {
      handleCalculate();
    }
  }, []);
  
  // Format nilai kriteria
  const getCriteriaIcon = (criteria) => {
    switch(criteria) {
      case 'harga': return <DollarSign className="h-3 w-3" />;
      case 'gpu': return <Cpu className="h-3 w-3" />;
      case 'ssd': return <HardDrive className="h-3 w-3" />;
      case 'ram': return <MemoryStick className="h-3 w-3" />;
      case 'processor': return <Cpu className="h-3 w-3" />;
      default: return <Hash className="h-3 w-3" />;
    }
  };
  
  // Fungsi untuk mendapatkan konversi nilai SESUAI EXCEL
  const getConvertedScores = (laptop) => {
    return {
      harga: convertToScore(laptop.harga, 'harga'),
      gpu: convertToScore(laptop.gpu, 'gpu'),
      ssd: convertToScore(laptop.ssd, 'ssd'),
      ram: convertToScore(laptop.ram, 'ram'),
      processor: convertToScore(laptop.processor, 'processor')
    };
  };

  const getPriceDescription = (score, harga) => {
    if (harga < 16000000) return '< Rp 16jt';
    if (harga >= 16000000 && harga < 17000000) return '16-17jt (gap)';
    if (score === 2) return 'Rp 17-18jt';
    if (score === 3) return 'Rp 18-19jt';
    if (score === 4) return 'Rp 19-20jt';
    if (score === 5) return '>= Rp 20jt';
    return '';
  };
  
  if (!hasEnoughData) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Perhitungan MPE</h1>
          <p className="text-gray-600">
            Proses perhitungan Metode Perbandingan Eksponensial
          </p>
        </div>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-yellow-800">Data Tidak Cukup</h3>
                <p className="text-yellow-700">
                  Membutuhkan minimal 2 laptop untuk melakukan perhitungan.
                  Saat ini Anda hanya memiliki {laptops.length} laptop.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button asChild>
                    <Link href="/input">
                      ← Kembali ke Input Data
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    Load Data Contoh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Perhitungan MPE</h1>
            <p className="text-gray-600">
              Proses perhitungan Metode Perbandingan Eksponensial
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={hasEnoughData ? "success" : "warning"}>
              {laptops.length} Laptop
            </Badge>
            <Badge variant="outline">
              5 Kriteria
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Info Konversi */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Skala Konversi Nilai</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConversionInfo(!showConversionInfo)}
            >
              <Info className="mr-2 h-4 w-4" />
              {showConversionInfo ? 'Sembunyikan' : 'Lihat Skala'}
            </Button>
          </div>
          <CardDescription>
            Konversi data mentah ke skala 1-5 sesuai tabel Excel
          </CardDescription>
        </CardHeader>
        
        {showConversionInfo && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Harga */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Harga (Rp)
                </h4>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between items-center p-1">
                    <span className="text-gray-600">&lt; 16jt</span>
                    <Badge variant="outline">Nilai 1</Badge>
                  </li>
                  <li className="flex justify-between items-center p-1 bg-yellow-50 rounded">
                    <span className="text-gray-600">16-17jt (gap)</span>
                    <Badge variant="outline">Nilai 1</Badge>
                  </li>
                  <li className="flex justify-between items-center p-1">
                    <span className="text-gray-600">17-18jt</span>
                    <Badge variant="outline">Nilai 2</Badge>
                  </li>
                  <li className="flex justify-between items-center p-1">
                    <span className="text-gray-600">18-19jt</span>
                    <Badge variant="outline">Nilai 3</Badge>
                  </li>
                  <li className="flex justify-between items-center p-1">
                    <span className="text-gray-600">19-20jt</span>
                    <Badge variant="outline">Nilai 4</Badge>
                  </li>
                  <li className="flex justify-between items-center p-1">
                    <span className="text-gray-600">&gt;= 20jt</span>
                    <Badge variant="outline">Nilai 5</Badge>
                  </li>
                </ul>
                <p className="text-xs text-yellow-600 mt-2">
                  *Catatan: Harga 16-17jt termasuk gap (tetap nilai 1)
                </p>
              </div>
              
              {/* GPU */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  GPU (RTX)
                </h4>
                <ul className="text-sm space-y-1">
                  {getConversionInfo('gpu').map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-gray-600">{item.split(' → ')[0]}</span>
                      <Badge variant="outline">Nilai {item.split(' → ')[1]}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* SSD */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  SSD
                </h4>
                <ul className="text-sm space-y-1">
                  {getConversionInfo('ssd').map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-gray-600">{item.split(' → ')[0]} GB</span>
                      <Badge variant="outline">Nilai {item.split(' → ')[1]}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* RAM */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  RAM
                </h4>
                <ul className="text-sm space-y-1">
                  {getConversionInfo('ram').map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-gray-600">{item.split(' → ')[0]} GB</span>
                      <Badge variant="outline">Nilai {item.split(' → ')[1]}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Processor */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Processor
                </h4>
                <ul className="text-sm space-y-1">
                  {getConversionInfo('processor').map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-gray-600">Core {item.split(' → ')[0]}</span>
                      <Badge variant="outline">Nilai {item.split(' → ')[1]}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alternatif</p>
                <p className="text-2xl font-bold">{laptops.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status Perhitungan</p>
                <p className="text-2xl font-bold">
                  {isCalculating ? 'Memproses...' : 'Siap'}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Metode</p>
                <p className="text-2xl font-bold">MPE</p>
              </div>
              <div className="p-2 bg-purple-100 rounded">
                <Hash className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bobot Kriteria */}
      <Card>
        <CardHeader>
          <CardTitle>Bobot Kriteria</CardTitle>
          <CardDescription>
            Nilai bobot yang digunakan dalam perhitungan (skala 1-5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(criteriaWeights).map(([key, value]) => (
              <div key={key} className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getCriteriaIcon(key)}
                  <span className="font-medium capitalize">{key}</span>
                </div>
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {key === 'harga' ? 'Cost' : 'Benefit'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-800 mb-2">Rumus MPE</p>
            <p className="text-sm text-blue-700">
              <code className="bg-blue-100 px-2 py-1 rounded">TN = Σ(Nilai^Bobot)</code>
              {' '}dimana Nilai = konversi spesifikasi (1-5), Bobot = tingkat kepentingan kriteria
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Konversi Nilai */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Konversi Nilai Spesifikasi</CardTitle>
              <CardDescription>
                Konversi data mentah ke skala 1-5 berdasarkan tabel Excel
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailedCalculation(!showDetailedCalculation)}
            >
              {showDetailedCalculation ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Sembunyikan Perhitungan
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Perhitungan TN
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Laptop</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>GPU</TableHead>
                <TableHead>SSD</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Processor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laptops.map((laptop) => {
                const scores = getConvertedScores(laptop);
                
                return (
                  <TableRow key={laptop.id}>
                    <TableCell className="font-medium">{laptop.name}</TableCell>
                    
                    {/* Harga */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatRupiah(laptop.harga)}</div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="w-full justify-center">
                            Nilai: {scores.harga}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            <div className="text-xs text-gray-500">
                              {getPriceDescription(scores.harga, laptop.harga)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* GPU */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{laptop.gpu}</div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="w-full justify-center">
                            Nilai: {scores.gpu}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* SSD */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatStorage(laptop.ssd)}</div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="w-full justify-center">
                            Nilai: {scores.ssd}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* RAM */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{laptop.ram} GB</div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="w-full justify-center">
                            Nilai: {scores.ram}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Processor */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{laptop.processor}</div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="w-full justify-center">
                            Nilai: {scores.processor}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {/* Detail Perhitungan TN */}
          {showDetailedCalculation && results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-bold text-lg">Detail Perhitungan Total Nilai (TN)</h4>
              <div className="text-sm text-gray-600 mb-4">
                Rumus: <code className="bg-gray-100 px-2 py-1 rounded">TN = Σ(Nilai^Bobot)</code>
              </div>
              
              {results.map((result) => (
                <Card key={result.raw.id} className="border">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>
                        {result.rank}. {result.raw.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">TN =</span>
                        <Badge variant="success" className="text-lg">
                          {result.totalScore.toLocaleString()}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {Object.entries(result.scores).map(([criteria, score]) => {
                        const weight = criteriaWeights[criteria];
                        const poweredValue = Math.pow(score, weight);
                        
                        return (
                          <div key={criteria} className="text-center p-3 border rounded-lg bg-gray-50">
                            <div className="text-xs text-gray-600 mb-1 capitalize">{criteria}</div>
                            <div className="font-mono text-sm">
                              {score}<sup>{weight}</sup>
                            </div>
                            <div className="text-lg font-bold text-primary">
                              = {poweredValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Bobot: {weight}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Total */}
                      <div className="md:col-span-5 p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-primary" />
                            <span className="font-bold">TOTAL NILAI (TN)</span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {result.totalScore.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              = Σ semua nilai di atas
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Hasil Sementara */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Perhitungan Sementara</CardTitle>
            <CardDescription>
              Urutan ranking berdasarkan Total Nilai (TN) tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.slice(0, 3).map((result, index) => (
                <div
                  key={result.raw.id}
                  className={`p-4 border rounded-lg ${
                    index === 0 
                      ? 'bg-green-50 border-green-200' 
                      : index === 1 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-100 text-green-800' :
                        index === 1 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        <span className="font-bold">{result.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{result.raw.name}</h4>
                        <p className="text-sm text-gray-600">
                          Total Nilai (TN): <span className="font-bold">{result.totalScore.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant={index === 0 ? "success" : "outline"}>
                      {index === 0 ? 'TERBAIK' : `Rank ${result.rank}`}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {results.length > 3 && (
                <div className="text-center py-2">
                  <p className="text-gray-600">
                    ... dan {results.length - 3} laptop lainnya
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/input">
            ← Kembali ke Input
          </Link>
        </Button>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCalculate}
            disabled={isCalculating || !hasEnoughData}
          >
            {isCalculating ? (
              <>
                <Calculator className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Hitung Ulang
              </>
            )}
          </Button>
          
          <Button asChild disabled={!results.length}>
            <Link href="/results">
              Lihat Hasil Lengkap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}