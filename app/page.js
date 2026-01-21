import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Laptop, Calculator, Trophy, Download, 
  PlusCircle, Settings, BookOpen 
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Input Data Laptop',
      description: 'Tambahkan laptop yang ingin dibandingkan dengan spesifikasi lengkap',
      icon: <Laptop className="h-8 w-8" />,
      href: '/input',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Perhitungan MPE',
      description: 'Lihat proses perhitungan Metode Perbandingan Eksponensial',
      icon: <Calculator className="h-8 w-8" />,
      href: '/calculate',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Hasil Ranking',
      description: 'Lihat hasil perankingan laptop terbaik',
      icon: <Trophy className="h-8 w-8" />,
      href: '/results',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];
  
  const quickActions = [
    { label: 'Tambah Laptop Baru', icon: <PlusCircle />, href: '/input' },
    { label: 'Lihat Data Contoh', icon: <BookOpen />, href: '/input?sample=true' },
    { label: 'Atur Bobot Kriteria', icon: <Settings />, href: '/input?weights=true' },
    { label: 'Download Hasil', icon: <Download />, href: '/results' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Sistem Pendukung Keputusan
          <span className="block text-primary">Pemilihan Laptop Terbaik</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Menggunakan Metode Perbandingan Eksponensial (MPE) untuk membantu mahasiswa 
          memilih laptop berdasarkan 5 kriteria: Harga, GPU, SSD, RAM, dan Processor.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg" asChild>
            <Link href="/input">
              <PlusCircle className="mr-2 h-5 w-5" />
              Mulai Sekarang
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">
              Pelajari MPE
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`p-3 rounded-lg w-fit ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Button variant="outline" asChild className="w-full">
                <Link href={feature.href}>
                  Buka
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button key={index} variant="outline" asChild className="h-24 flex-col gap-2">
                <Link href={action.href}>
                  {action.icon}
                  <span className="text-sm">{action.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Kerja Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {[
              'Input data laptop dengan 5 kriteria (Harga, GPU, SSD, RAM, Processor)',
              'Sistem mengkonversi nilai ke skala 1-5 berdasarkan rentang yang ditentukan',
              'Hitung Total Nilai (TN) dengan rumus MPE: TN = Σ(Nilai^Bobot)',
              'Urutkan laptop berdasarkan TN tertinggi',
              'Laptop dengan TN tertinggi adalah rekomendasi terbaik'
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {index + 1}
                </div>
                <p className="pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}