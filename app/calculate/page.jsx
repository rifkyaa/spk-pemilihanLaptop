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
  DollarSign, Cpu, HardDrive, MemoryStick, Hash, Info,
  ChevronDown, ChevronUp, Smartphone, Tablet, Monitor
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
  const [activeSection, setActiveSection] = useState(null); // Untuk mobile accordion
  
  // Validasi data
  const hasEnoughData = laptops.length >= 2;
  
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
      case 'harga': return <DollarSign className="h-3 w-3 md:h-4 md:w-4" />;
      case 'gpu': return <Cpu className="h-3 w-3 md:h-4 md:w-4" />;
      case 'ssd': return <HardDrive className="h-3 w-3 md:h-4 md:w-4" />;
      case 'ram': return <MemoryStick className="h-3 w-3 md:h-4 md:w-4" />;
      case 'processor': return <Cpu className="h-3 w-3 md:h-4 md:w-4" />;
      default: return <Hash className="h-3 w-3 md:h-4 md:w-4" />;
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
    if (harga < 16000000) return '< 16jt';
    if (harga >= 16000000 && harga < 17000000) return '16-17jt (gap)';
    if (score === 2) return '17-18jt';
    if (score === 3) return '18-19jt';
    if (score === 4) return '19-20jt';
    if (score === 5) return '≥ 20jt';
    return '';
  };
  
  // Mobile Accordion Component
  const MobileAccordion = ({ title, icon, children, sectionId, defaultOpen = false }) => (
    <Card className="md:hidden mb-3 border">
      <CardHeader 
        className="p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setActiveSection(activeSection === sectionId ? null : sectionId)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {activeSection === sectionId ? 
            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500" />
          }
        </div>
      </CardHeader>
      {activeSection === sectionId && (
        <CardContent className="pt-0 px-3 pb-3">
          {children}
        </CardContent>
      )}
    </Card>
  );

  // Responsive Table Cell Component
  const ResponsiveTableCell = ({ label, value, score, criteria, showDescription = false }) => (
    <div className="space-y-1">
      <div className="text-sm md:text-base">{value}</div>
      <div className="flex items-center gap-1 flex-wrap">
        <Badge variant="outline" className="text-xs md:text-sm">
          Nilai: {score}
        </Badge>
        {showDescription && criteria === 'harga' && (
          <span className="text-xs text-gray-500">
            {getPriceDescription(score, typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value)}
          </span>
        )}
      </div>
    </div>
  );
  
  if (!hasEnoughData) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Perhitungan MPE</h1>
          <p className="text-sm md:text-base text-gray-600">
            Proses perhitungan Metode Perbandingan Eksponensial
          </p>
        </div>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg md:text-xl text-yellow-800">Data Tidak Cukup</h3>
                <p className="text-yellow-700 text-sm md:text-base">
                  Membutuhkan minimal 2 laptop untuk melakukan perhitungan.
                  Saat ini Anda hanya memiliki {laptops.length} laptop.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/input">
                      ← Kembali ke Input Data
                    </Link>
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
    <div className="container mx-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Perhitungan MPE</h1>
            <p className="text-sm md:text-base text-gray-600">
              Proses perhitungan Metode Perbandingan Eksponensial
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-xs md:text-sm">
              {laptops.length} Laptop
            </Badge>
            <Badge variant="outline" className="text-xs md:text-sm">
              5 Kriteria
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Mobile Accordion - Summary */}
      <MobileAccordion 
        title="Ringkasan" 
        icon={<BarChart3 className="h-4 w-4" />}
        sectionId="summary"
        defaultOpen={true}
      >
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 border rounded">
            <p className="text-xs text-gray-600">Alternatif</p>
            <p className="text-lg font-bold">{laptops.length}</p>
          </div>
          <div className="text-center p-2 border rounded">
            <p className="text-xs text-gray-600">Status</p>
            <p className="text-lg font-bold text-green-600">Siap</p>
          </div>
          <div className="text-center p-2 border rounded">
            <p className="text-xs text-gray-600">Metode</p>
            <p className="text-lg font-bold">MPE</p>
          </div>
        </div>
      </MobileAccordion>
      
      {/* Desktop Summary Cards */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
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
          <CardContent className="p-4 md:p-6">
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
          <CardContent className="p-4 md:p-6">
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
      
      {/* Info Konversi - Mobile */}
      <MobileAccordion 
        title="Skala Konversi" 
        icon={<Info className="h-4 w-4" />}
        sectionId="conversionInfo"
      >
        <div className="space-y-3">
          <div className="border rounded p-3">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Harga (Rp)
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>&lt; 16jt</span><Badge variant="outline">1</Badge></div>
              <div className="flex justify-between bg-yellow-50 p-1 rounded"><span>16-17jt (gap)</span><Badge variant="outline">1</Badge></div>
              <div className="flex justify-between"><span>17-18jt</span><Badge variant="outline">2</Badge></div>
              <div className="flex justify-between"><span>18-19jt</span><Badge variant="outline">3</Badge></div>
              <div className="flex justify-between"><span>19-20jt</span><Badge variant="outline">4</Badge></div>
              <div className="flex justify-between"><span>≥ 20jt</span><Badge variant="outline">5</Badge></div>
            </div>
          </div>
        </div>
      </MobileAccordion>
      
      {/* Info Konversi - Desktop */}
      <Card className="hidden md:block">
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
      
      {/* Mobile Accordion - Bobot Kriteria */}
      <MobileAccordion 
        title="Bobot Kriteria" 
        icon={<Hash className="h-4 w-4" />}
        sectionId="weights"
      >
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(criteriaWeights).map(([key, value]) => (
            <div key={key} className="text-center p-2 border rounded">
              <p className="text-xs font-medium capitalize">{key}</p>
              <p className="text-xl font-bold text-primary">{value}</p>
              <p className="text-xs text-gray-500">
                {key === 'harga' ? 'Cost' : 'Benefit'}
              </p>
            </div>
          ))}
        </div>
      </MobileAccordion>
      
      {/* Desktop Bobot Kriteria */}
      <Card className="hidden md:block">
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
      
      {/* Mobile Accordion - Konversi Nilai */}
      <MobileAccordion 
        title="Konversi Nilai" 
        icon={<Calculator className="h-4 w-4" />}
        sectionId="conversion"
      >
        <div className="space-y-3">
          {laptops.slice(0, 3).map((laptop) => {
            const scores = getConvertedScores(laptop);
            
            return (
              <div key={laptop.id} className="border rounded p-3">
                <div className="font-medium mb-2">{laptop.name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Harga:</span>
                    <div className="text-right">
                      <div className="text-sm">{formatRupiah(laptop.harga)}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        Nilai: {scores.harga}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">GPU:</span>
                    <Badge variant="outline" className="text-xs">
                      {laptop.gpu} (Nilai: {scores.gpu})
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SSD:</span>
                    <Badge variant="outline" className="text-xs">
                      {formatStorage(laptop.ssd)} (Nilai: {scores.ssd})
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
          
          {laptops.length > 3 && (
            <div className="text-center text-sm text-gray-500">
              + {laptops.length - 3} laptop lainnya
            </div>
          )}
        </div>
      </MobileAccordion>
      
      {/* Desktop Konversi Nilai */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-lg md:text-xl">Konversi Nilai Spesifikasi</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Konversi data mentah ke skala 1-5 berdasarkan tabel Excel
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedCalculation(!showDetailedCalculation)}
                className="text-xs md:text-sm"
              >
                {showDetailedCalculation ? (
                  <>
                    <EyeOff className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Sembunyikan Perhitungan TN</span>
                    <span className="sm:hidden">Sembunyikan TN</span>
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Lihat Perhitungan TN</span>
                    <span className="sm:hidden">Lihat TN</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="space-y-3">
              {laptops.map((laptop) => {
                const scores = getConvertedScores(laptop);
                
                return (
                  <Card key={laptop.id} className="border">
                    <CardContent className="p-4">
                      <div className="font-medium text-base mb-3">{laptop.name}</div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Harga</div>
                          <ResponsiveTableCell 
                            value={formatRupiah(laptop.harga)}
                            score={scores.harga}
                            criteria="harga"
                            showDescription={true}
                          />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">GPU</div>
                          <ResponsiveTableCell 
                            value={laptop.gpu}
                            score={scores.gpu}
                            criteria="gpu"
                          />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">SSD</div>
                          <ResponsiveTableCell 
                            value={formatStorage(laptop.ssd)}
                            score={scores.ssd}
                            criteria="ssd"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
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
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{formatRupiah(laptop.harga)}</div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="w-full justify-center">
                                Nilai: {scores.harga}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                {getPriceDescription(scores.harga, laptop.harga)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
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
            </div>
          </div>
          
          {/* DETAIL PERHITUNGAN TN - TETAP ADA! */}
          {showDetailedCalculation && results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-bold text-lg">Detail Perhitungan Total Nilai (TN)</h4>
              <div className="text-sm text-gray-600 mb-4">
                Rumus: <code className="bg-gray-100 px-2 py-1 rounded">TN = Σ(Nilai^Bobot)</code>
              </div>
              
              {/* Mobile View untuk Detail TN */}
              <div className="block md:hidden">
                {results.slice(0, 2).map((result) => (
                  <Card key={result.raw.id} className="border mb-3">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>
                          {result.rank}. {result.raw.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">TN:</span>
                          <Badge variant="success">
                            {result.totalScore.toLocaleString()}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(result.scores).map(([criteria, score]) => {
                          const weight = criteriaWeights[criteria];
                          const poweredValue = Math.pow(score, weight);
                          
                          return (
                            <div key={criteria} className="text-center p-2 border rounded bg-gray-50">
                              <div className="text-xs text-gray-600 capitalize">{criteria}</div>
                              <div className="text-xs font-mono">
                                {score}<sup>{weight}</sup>
                              </div>
                              <div className="text-sm font-bold text-primary">
                                {poweredValue.toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Desktop View untuk Detail TN */}
              <div className="hidden md:block">
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
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Hasil Sementara */}
      {results.length > 0 && (
        <>
          <MobileAccordion 
            title="Hasil Sementara" 
            icon={<BarChart3 className="h-4 w-4" />}
            sectionId="results"
          >
            <div className="space-y-3">
              {results.slice(0, 3).map((result, index) => (
                <div
                  key={result.raw.id}
                  className={`p-3 border rounded-lg ${
                    index === 0 ? 'bg-green-50 border-green-200' : 
                    index === 1 ? 'bg-blue-50 border-blue-200' : 
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{result.raw.name}</div>
                      <div className="text-sm text-gray-600">
                        TN: <span className="font-bold">{result.totalScore.toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge variant={index === 0 ? "success" : "outline"}>
                      Rank {result.rank}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </MobileAccordion>
          
          <Card className="hidden md:block">
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
        </>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 md:pt-6 border-t">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/input">
            ← Kembali ke Input
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleCalculate}
            disabled={isCalculating || !hasEnoughData}
            className="w-full sm:w-auto"
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
          
          <Button asChild disabled={!results.length} className="w-full sm:w-auto">
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