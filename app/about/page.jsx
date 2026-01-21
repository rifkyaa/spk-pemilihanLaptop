import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Calculator, Trophy, Settings, 
  CheckCircle, Hash, Sigma, TrendingUp,
  Users, Code, GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const mpeSteps = [
    {
      step: 1,
      title: "Input Data",
      description: "Masukkan data laptop dengan 5 kriteria (Harga, GPU, SSD, RAM, Processor)",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      step: 2,
      title: "Konversi Nilai",
      description: "Sistem mengkonversi spesifikasi ke skala 1-5 berdasarkan rentang",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      step: 3,
      title: "Hitung MPE",
      description: "Menghitung Total Nilai dengan rumus TN = Σ(Nilai^Bobot)",
      icon: <Hash className="h-5 w-5" />
    },
    {
      step: 4,
      title: "Ranking",
      description: "Mengurutkan laptop berdasarkan Total Nilai tertinggi",
      icon: <Trophy className="h-5 w-5" />
    }
  ];
  
  const criteriaDetails = [
    {
      name: "Harga",
      attribute: "Cost",
      description: "Semakin murah semakin baik",
      importance: "Sangat penting (biasa tinggi)",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: "GPU",
      attribute: "Benefit",
      description: "Semakin tinggi performa semakin baik",
      importance: "Penting untuk gaming/design",
      icon: <Settings className="h-4 w-4" />
    },
    {
      name: "SSD",
      attribute: "Benefit",
      description: "Kapasitas besar untuk penyimpanan",
      importance: "Cukup penting",
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      name: "RAM",
      attribute: "Benefit",
      description: "Kapasitas besar untuk multitasking",
      importance: "Penting untuk produktivitas",
      icon: <Sigma className="h-4 w-4" />
    },
    {
      name: "Processor",
      attribute: "Benefit",
      description: "CPU performa tinggi untuk komputasi",
      importance: "Sangat penting untuk performa",
      icon: <Calculator className="h-4 w-4" />
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Metode Perbandingan Eksponensial (MPE)</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sistem Pendukung Keputusan untuk pemilihan laptop terbaik 
          berdasarkan 5 kriteria dengan metode perhitungan eksponensial
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/input">
              Coba Sekarang
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/calculate">
              Lihat Demo
            </Link>
          </Button>
        </div>
      </div>
      
      {/* What is MPE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Apa itu Metode Perbandingan Eksponensial (MPE)?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            <strong>Metode Perbandingan Eksponensial (MPE)</strong> merupakan salah satu metode 
            dalam Sistem Pendukung Keputusan (SPK) yang digunakan untuk menentukan urutan prioritas 
            alternatif keputusan menggunakan kriteria yang majemuk.
          </p>
          <p className="text-gray-700">
            Melalui perhitungan perbedaan nilai di antara kriteria dengan eksponensial, 
            kriteria akan terlihat perbedaannya tergantung pada pengambil keputusan. 
            Tidak hanya itu, metode MPE adalah satu diantara beberapa pendekatan dalam 
            mengambil keputusan yang mengkalkulasi pendapat seseorang maupun lebih pada skala tertentu.
          </p>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">Rumus Inti MPE</h4>
            <div className="font-mono text-lg bg-white p-3 rounded border">
              TN<sub>i</sub> = Σ(RK<sub>ij</sub>)<sup>TKK<sub>j</sub></sup>
            </div>
            <div className="text-sm text-blue-700 mt-2 grid grid-cols-2 gap-2">
              <div><strong>TN<sub>i</sub></strong>: Total Nilai alternatif ke-i</div>
              <div><strong>RK<sub>ij</sub></strong>: Nilai kriteria j untuk alternatif i</div>
              <div><strong>TKK<sub>j</sub></strong>: Bobot kriteria j (TKK &gt; 0)</div>
              <div><strong>Σ</strong>: Penjumlahan semua kriteria</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* How it Works */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Bagaimana Sistem Bekerja</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mpeSteps.map((step) => (
            <Card key={step.step}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                    {step.step}
                  </div>
                  <div className="p-2 bg-blue-100 rounded">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Kriteria yang Digunakan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criteriaDetails.map((criteria) => (
              <div key={criteria.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg">{criteria.name}</h4>
                  <Badge variant={criteria.attribute === 'Cost' ? 'destructive' : 'default'}>
                    {criteria.attribute}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {criteria.icon}
                    <span>{criteria.description}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Tingkat Kepentingan:</strong> {criteria.importance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Application Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Teknologi yang Digunakan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span><strong>Next.js 15</strong> - React framework dengan App Router</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span><strong>Tailwind CSS</strong> - Utility-first CSS framework</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span><strong>Zustand</strong> - State management sederhana</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span><strong>shadcn/ui</strong> - Komponen UI yang bisa dikustomisasi</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Untuk Tugas UAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Sistem ini dikembangkan untuk memenuhi tugas UAS mata kuliah 
              <strong> Sistem Pendukung Keputusan</strong> dengan studi kasus 
              pemilihan laptop terbaik untuk mahasiswa.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mata Kuliah</span>
                <span className="font-medium">Sistem Pendukung Keputusan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode</span>
                <span className="font-medium">MPE (Metode Perbandingan Eksponensial)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kasus</span>
                <span className="font-medium">Pemilihan Laptop untuk Mahasiswa</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* CTA */}
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold mb-4">Siap Memilih Laptop Terbaik?</h3>
        <p className="text-gray-600 mb-6">
          Mulai dengan memasukkan data laptop yang ingin dibandingkan
        </p>
        <Button size="lg" asChild>
          <Link href="/input">
            Mulai Sekarang →
          </Link>
        </Button>
      </div>
    </div>
  );
}