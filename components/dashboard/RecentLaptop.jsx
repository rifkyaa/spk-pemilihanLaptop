'use client';

import { useLaptopStore } from '@/store/laptopStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Laptop, Cpu, MemoryStick, HardDrive, DollarSign, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';

export default function RecentLaptops() {
  const { laptops } = useLaptopStore();
  const recentLaptops = laptops.slice(0, 3); // Ambil 3 terbaru

  const getCriteriaIcon = (criteria) => {
    switch(criteria) {
      case 'harga': return <DollarSign className="h-3 w-3" />;
      case 'gpu': return <Cpu className="h-3 w-3" />;
      case 'ssd': return <HardDrive className="h-3 w-3" />;
      case 'ram': return <MemoryStick className="h-3 w-3" />;
      default: return <Cpu className="h-3 w-3" />;
    }
  };

  if (laptops.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Data Laptop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Laptop className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada laptop</h3>
            <p className="text-gray-600 mb-4">
              Tambahkan laptop pertama Anda untuk memulai perhitungan
            </p>
            <Button asChild>
              <Link href="/input">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Laptop Pertama
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Laptop className="h-5 w-5" />
          Data Laptop Terbaru ({laptops.length} total)
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/input">
            Lihat Semua
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Laptop</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>GPU</TableHead>
              <TableHead>SSD</TableHead>
              <TableHead>RAM</TableHead>
              <TableHead>Processor</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentLaptops.map((laptop) => (
              <TableRow key={laptop.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded">
                      <Laptop className="h-4 w-4 text-blue-600" />
                    </div>
                    {laptop.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    {formatRupiah(laptop.harga)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <Cpu className="h-3 w-3" />
                    {laptop.gpu}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <HardDrive className="h-3 w-3" />
                    {laptop.ssd >= 1000 ? `${laptop.ssd/1000} TB` : `${laptop.ssd} GB`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <MemoryStick className="h-3 w-3" />
                    {laptop.ram} GB
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {laptop.processor}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/input?edit=${laptop.id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {laptops.length > 3 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Menampilkan 3 dari {laptops.length} laptop. 
              <Button variant="link" asChild className="ml-1">
                <Link href="/input">Lihat semua</Link>
              </Button>
            </p>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Rata-rata Harga</p>
            <p className="font-semibold">
              {formatRupiah(
                laptops.reduce((sum, laptop) => sum + laptop.harga, 0) / laptops.length
              )}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">SSD Terbesar</p>
            <p className="font-semibold">
              {Math.max(...laptops.map(l => l.ssd)) >= 1000 
                ? `${Math.max(...laptops.map(l => l.ssd))/1000} TB`
                : `${Math.max(...laptops.map(l => l.ssd))} GB`
              }
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">RAM Terbesar</p>
            <p className="font-semibold">
              {Math.max(...laptops.map(l => l.ram))} GB
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Processor Tertinggi</p>
            <p className="font-semibold">
              {laptops.map(l => l.processor).sort().pop()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}