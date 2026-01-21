'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLaptopStore } from '@/store/laptopStore';
import LaptopForm from '@/components/forms/LaptopForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, Trash2, Edit, Download, Upload,
  CheckCircle, AlertCircle, Smartphone, Tablet, Monitor
} from 'lucide-react';

export default function InputPage() {
  const { laptops, addLaptop, removeLaptop, loadSampleData, clearLaptops } = useLaptopStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const handleSave = (data) => {
    if (editingId) {
      // Update existing
      // (tambahkan fungsi updateLaptop di store)
      setEditingId(null);
    } else {
      addLaptop(data);
    }
    setShowForm(false);
  };
  
  const handleLoadSample = () => {
    loadSampleData();
    setShowForm(false);
  };
  
  const editingLaptop = editingId ? laptops.find(l => l.id === editingId) : null;

  return (
    <div className="container mx-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Input Data Laptop</h1>
          <p className="text-sm md:text-base text-gray-600">
            Tambahkan laptop yang ingin dibandingkan. Minimal 2 laptop.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="flex-1 md:flex-none">
            <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Data Contoh</span>
            <span className="sm:hidden">Contoh</span>
          </Button>
          {laptops.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearLaptops} className="flex-1 md:flex-none">
              <Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Hapus Semua</span>
              <span className="sm:hidden">Hapus</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Laptop</p>
                <p className="text-xl md:text-2xl font-bold">{laptops.length}</p>
              </div>
              <div className="p-1.5 md:p-2 bg-blue-100 rounded">
                <Monitor className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Kriteria</p>
                <p className="text-xl md:text-2xl font-bold">5</p>
              </div>
              <div className="p-1.5 md:p-2 bg-purple-100 rounded">
                <Smartphone className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Metode</p>
                <p className="text-xl md:text-2xl font-bold">MPE</p>
              </div>
              <div className="p-1.5 md:p-2 bg-green-100 rounded">
                <Tablet className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center">
              {laptops.length >= 2 ? (
                <>
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold">Siap Hitung</p>
                    <p className="text-xs text-gray-500">Klik Lanjut</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold">
                      Butuh {2 - laptops.length} lagi
                    </p>
                    <p className="text-xs text-gray-500">Minimal 2 laptop</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Form Input */}
      {showForm || editingId ? (
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">
              {editingId ? 'Edit Laptop' : 'Tambah Laptop Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LaptopForm
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              initialData={editingLaptop}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 md:py-12 border-2 border-dashed rounded-lg bg-gray-50">
          <PlusCircle className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">
            {laptops.length === 0 ? 'Belum ada laptop' : 'Tambah laptop lagi'}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 max-w-md mx-auto px-4">
            {laptops.length === 0 
              ? 'Tambahkan laptop pertama Anda untuk memulai perhitungan'
              : 'Tambahkan laptop lain untuk dibandingkan'
            }
          </p>
          <Button 
            onClick={() => setShowForm(true)} 
            size={laptops.length === 0 ? "default" : "sm"}
            className="px-4 md:px-6"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {laptops.length === 0 ? 'Tambah Laptop Pertama' : 'Tambah Laptop'}
          </Button>
        </div>
      )}
      
      {/* Laptop List - RESPONSIVE TABLE */}
      {laptops.length > 0 && (
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg md:text-xl">
                Daftar Laptop ({laptops.length})
              </CardTitle>
              <div className="md:hidden flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowForm(true)}
                  className="flex-1 sm:flex-none"
                >
                  <PlusCircle className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden xs:inline">Tambah Lagi</span>
                  <span className="xs:hidden">+</span>
                </Button>
                
                {laptops.length >= 2 && (
                  <Button asChild size="sm" className="flex-1 sm:flex-none">
                    <Link href="/calculate">
                      <span className="hidden sm:inline">Lanjut ke Perhitungan</span>
                      <span className="sm:hidden">Lanjut →</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            {/* Mobile View (Cards) */}
            <div className="block md:hidden">
              <div className="space-y-3 p-3">
                {laptops.map((laptop) => (
                  <div
                    key={laptop.id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-base">{laptop.name}</h4>
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-16">Harga:</span>
                            <span className="font-medium">
                              Rp {laptop.harga.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-16">GPU:</span>
                            <span>{laptop.gpu}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-16">SSD:</span>
                            <span>
                              {laptop.ssd >= 1000 ? `${laptop.ssd/1000} TB` : `${laptop.ssd} GB`}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-16">RAM:</span>
                            <span>{laptop.ram} GB</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-16">Processor:</span>
                            <span>{laptop.processor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingId(laptop.id)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeLaptop(laptop.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tablet & Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Nama Laptop</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Harga</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">GPU</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">SSD</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">RAM</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Processor</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laptops.map((laptop) => (
                    <tr key={laptop.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded">
                            <Monitor className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="font-medium">{laptop.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">
                          Rp {laptop.harga.toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {laptop.gpu}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-50 rounded text-sm">
                          {laptop.ssd >= 1000 ? `${laptop.ssd/1000} TB` : `${laptop.ssd} GB`}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-50 rounded text-sm">
                          {laptop.ram} GB
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-purple-50 rounded text-sm">
                          {laptop.processor}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(laptop.id)}
                            className="h-8 px-2"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            <span className="hidden lg:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLaptop(laptop.id)}
                            className="h-8 px-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            <span className="hidden lg:inline">Hapus</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Bottom Actions */}
            <div className="hidden md:block p-3 md:p-4 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm text-gray-600">
                  Total: {laptops.length} laptop • Minimal 2 untuk perhitungan
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowForm(true)}
                    className="flex-1 sm:flex-none"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Laptop Lain
                  </Button>
                  
                  {laptops.length >= 2 && (
                    <Button asChild className="flex-1 sm:flex-none">
                      <Link href="/calculate">
                        Lanjut ke Perhitungan →
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}