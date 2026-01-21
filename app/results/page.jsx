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
  BarChart3, TrendingUp, Award, CheckCircle, Crown,
  DollarSign, Cpu, HardDrive, MemoryStick, ChevronDown, ChevronUp,
  Smartphone, Tablet, Monitor, SmartphoneIcon, BarChart4
} from 'lucide-react';
import Link from 'next/link';
import { formatRupiah, formatStorage } from '@/lib/utils';

// Komponen Chart sederhana RESPONSIVE
const ResponsiveBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-20 md:w-28 lg:w-32 text-xs md:text-sm truncate">
            {item.label}
          </div>
          <div className="flex-1 ml-2 md:ml-4">
            <div className="relative h-4 md:h-6 bg-gray-100 rounded overflow-hidden">
              <div 
                className={`absolute h-full ${
                  index === 0 ? 'bg-green-500' :
                  index === 1 ? 'bg-blue-500' :
                  index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-1 md:pr-2">
                <span className="text-xs font-bold text-white mix-blend-difference px-1">
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

// Mobile Accordion Component
const MobileAccordion = ({ title, icon, children, sectionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card className="md:hidden mb-3 border">
      <CardHeader 
        className="p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {isOpen ? 
            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500" />
          }
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0 px-3 pb-3">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const { laptops, criteriaWeights, calculationResults } = useLaptopStore();
  const [results, setResults] = useState([]);
  const [activeSection, setActiveSection] = useState('winner'); // Untuk mobile accordion
  
  useEffect(() => {
    if (calculationResults && calculationResults.length > 0) {
      setResults(calculationResults);
    } else if (laptops.length >= 2) {
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
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <Trophy className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Belum Ada Hasil</h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              Lakukan perhitungan terlebih dahulu untuk melihat hasil ranking
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/calculate">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ke Halaman Perhitungan
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
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
    harga: <DollarSign className="h-3 w-3 md:h-4 md:w-4" />,
    gpu: <Cpu className="h-3 w-3 md:h-4 md:w-4" />,
    ssd: <HardDrive className="h-3 w-3 md:h-4 md:w-4" />,
    ram: <MemoryStick className="h-3 w-3 md:h-4 md:w-4" />,
    processor: <Cpu className="h-3 w-3 md:h-4 md:w-4" />
  };
  
  return (
    <div className="container mx-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Hasil Ranking</h1>
            <p className="text-sm md:text-base text-gray-600">
              Rekomendasi laptop terbaik berdasarkan perhitungan MPE
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="flex-1 md:flex-none">
              <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Export</span>
              <span className="xs:hidden">Exp</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 md:flex-none">
              <Share2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Share</span>
              <span className="xs:hidden">Shr</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="flex-1 md:flex-none">
              <Printer className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Print</span>
              <span className="xs:hidden">Prt</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Accordion - Pemenang */}
      <MobileAccordion 
        title="Pemenang" 
        icon={<Crown className="h-4 w-4 text-yellow-600" />}
        sectionId="winner"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow">
                <Award className="h-6 w-6 text-white" />
              </div>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-[10px]">
                #1
              </Badge>
            </div>
            <div>
              <Badge variant="success" className="mb-1 text-xs">
                TERBAIK
              </Badge>
              <h3 className="font-bold text-lg">{bestLaptop.raw.name}</h3>
              <p className="text-sm text-gray-600">
                TN: <span className="font-bold text-green-600">
                  {bestLaptop.totalScore.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-white rounded border">
              <p className="text-xs text-gray-600">Harga</p>
              <p className="font-bold text-sm">{formatRupiah(bestLaptop.raw.harga)}</p>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <p className="text-xs text-gray-600">GPU</p>
              <p className="font-bold text-sm">{bestLaptop.raw.gpu}</p>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <p className="text-xs text-gray-600">SSD</p>
              <p className="font-bold text-sm">{formatStorage(bestLaptop.raw.ssd)}</p>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <p className="text-xs text-gray-600">RAM</p>
              <p className="font-bold text-sm">{bestLaptop.raw.ram} GB</p>
            </div>
          </div>
        </div>
      </MobileAccordion>
      
      {/* Desktop Pemenang */}
      <Card className="hidden md:block border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-xs md:text-sm">
                  #1
                </Badge>
              </div>
              <div>
                <Badge variant="success" className="mb-2 text-sm md:text-base">
                  REKOMENDASI TERBAIK
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold">{bestLaptop.raw.name}</h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Total Nilai (TN): <span className="font-bold text-xl md:text-2xl text-green-600">
                    {bestLaptop.totalScore.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
              {Object.entries(bestLaptop.scores).map(([criteria, score]) => (
                <div key={criteria} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {criteriaIcons[criteria]}
                    <span className="text-xs capitalize">{criteria}</span>
                  </div>
                  <div className="text-base md:text-lg font-bold">{score}</div>
                  <div className="text-xs text-gray-500">
                    bobot: {criteriaWeights[criteria]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="text-center p-2 md:p-3 bg-white rounded-lg border">
                <p className="text-xs md:text-sm text-gray-600">Harga</p>
                <p className="font-bold text-sm md:text-base">{formatRupiah(bestLaptop.raw.harga)}</p>
              </div>
              <div className="text-center p-2 md:p-3 bg-white rounded-lg border">
                <p className="text-xs md:text-sm text-gray-600">GPU</p>
                <p className="font-bold text-sm md:text-base">{bestLaptop.raw.gpu}</p>
              </div>
              <div className="text-center p-2 md:p-3 bg-white rounded-lg border">
                <p className="text-xs md:text-sm text-gray-600">SSD</p>
                <p className="font-bold text-sm md:text-base">
                  {bestLaptop.raw.ssd >= 1000 
                    ? `${bestLaptop.raw.ssd/1000} TB` 
                    : `${bestLaptop.raw.ssd} GB`
                  }
                </p>
              </div>
              <div className="text-center p-2 md:p-3 bg-white rounded-lg border">
                <p className="text-xs md:text-sm text-gray-600">RAM</p>
                <p className="font-bold text-sm md:text-base">{bestLaptop.raw.ram} GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Ranking Table */}
        <div className="lg:col-span-2">
          {/* Mobile Accordion - Ranking */}
          <MobileAccordion 
            title="Ranking Lengkap" 
            icon={<BarChart4 className="h-4 w-4" />}
            sectionId="ranking"
          >
            <div className="space-y-3">
              {results.slice(0, 5).map((result) => (
                <div
                  key={result.raw.id}
                  className={`border rounded-lg p-3 ${
                    result.rank === 1 ? 'bg-green-50 border-green-200' : 
                    result.rank === 2 ? 'bg-blue-50 border-blue-200' : 
                    result.rank === 3 ? 'bg-yellow-50 border-yellow-200' :
                    'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result.rank === 1 ? 'bg-green-100 text-green-800' :
                        result.rank === 2 ? 'bg-blue-100 text-blue-800' :
                        result.rank === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <span className="font-bold text-sm">{result.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{result.raw.name}</h4>
                        <p className="text-xs text-gray-600">
                          TN: <span className="font-bold">{result.totalScore.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    {result.rank <= 3 && (
                      <Badge variant={result.rank === 1 ? "success" : "outline"} className="text-xs">
                        #{result.rank}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga:</span>
                      <span className="font-medium">{formatRupiah(result.raw.harga)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GPU:</span>
                      <span>{result.raw.gpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SSD:</span>
                      <span>{formatStorage(result.raw.ssd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RAM:</span>
                      <span>{result.raw.ram} GB</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {results.length > 5 && (
                <div className="text-center text-sm text-gray-500">
                  + {results.length - 5} laptop lainnya
                </div>
              )}
            </div>
          </MobileAccordion>
          
          {/* Desktop Ranking Table */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Ranking Lengkap</CardTitle>
              <CardDescription>
                Urutan semua laptop berdasarkan Total Nilai (TN)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 md:w-16">Rank</TableHead>
                      <TableHead>Nama Laptop</TableHead>
                      <TableHead>Total Nilai (TN)</TableHead>
                      <TableHead className="hidden lg:table-cell">Detail Nilai</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
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
                            <span className="font-bold text-sm">{result.rank}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {result.raw.name}
                            {result.rank <= 3 && (
                              <Badge variant={result.rank === 1 ? "success" : "outline"} className="text-xs">
                                {result.rank === 1 ? 'Terbaik' : result.rank === 2 ? 'Kedua' : 'Ketiga'}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-lg md:text-xl font-bold">{result.totalScore.toLocaleString()}</div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex gap-1 flex-wrap">
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
                              <span className="hidden sm:inline">Lihat</span>
                              <span className="sm:hidden">📝</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Charts & Info */}
        <div className="space-y-4 md:space-y-6">
          {/* Mobile Accordion - Chart */}
          <MobileAccordion 
            title="Perbandingan TN" 
            icon={<TrendingUp className="h-4 w-4" />}
            sectionId="chart"
          >
            <ResponsiveBarChart
              data={results.slice(0, 4).map(result => ({
                label: result.raw.name.length > 12 ? result.raw.name.substring(0, 10) + '...' : result.raw.name,
                value: result.totalScore
              }))}
            />
          </MobileAccordion>
          
          {/* Mobile Accordion - Bobot */}
          <MobileAccordion 
            title="Bobot Kriteria" 
            icon={<BarChart3 className="h-4 w-4" />}
            sectionId="weights"
          >
            <div className="space-y-2">
              {Object.entries(criteriaWeights).map(([criteria, weight]) => (
                <div key={criteria} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {criteriaIcons[criteria]}
                    <span className="text-sm capitalize">{criteria}</span>
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
          </MobileAccordion>
          
          {/* Desktop View - Sidebar */}
          <div className="hidden md:block space-y-4 md:space-y-6">
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Perbandingan Total Nilai</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveBarChart
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
                <CardTitle className="text-base md:text-lg">Bobot Kriteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(criteriaWeights).map(([criteria, weight]) => (
                    <div key={criteria} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {criteriaIcons[criteria]}
                        <span className="capitalize text-sm md:text-base">{criteria}</span>
                        <Badge variant={criteria === 'harga' ? "destructive" : "default"} className="text-xs">
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
                <CardTitle className="text-base md:text-lg">Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Rata-rata TN</span>
                    <span className="font-bold">
                      {(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Selisih #1 & #2</span>
                    <span className="font-bold">
                      {(results[0].totalScore - results[1].totalScore).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Jumlah Laptop</span>
                    <span className="font-bold">{results.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 md:pt-6 border-t">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/calculate">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Perhitungan</span>
            <span className="sm:hidden">Kembali</span>
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportPDF} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Download Hasil</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button asChild className="w-full sm:w-auto">
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