'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLaptopStore } from '@/store/laptopStore';
import LaptopForm from '@/components/forms/LaptopForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, Trash2, Edit, Download, Upload,
  CheckCircle, AlertCircle
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Input Data Laptop</h1>
          <p className="text-gray-600">
            Tambahkan laptop yang ingin dibandingkan. Minimal 2 laptop.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLoadSample}>
            <Download className="mr-2 h-4 w-4" />
            Data Contoh
          </Button>
          {laptops.length > 0 && (
            <Button variant="outline" onClick={clearLaptops}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Semua
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{laptops.length}</div>
            <p className="text-gray-600">Total Laptop</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5</div>
            <p className="text-gray-600">Kriteria</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">MPE</div>
            <p className="text-gray-600">Metode</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              {laptops.length >= 2 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-semibold">Siap Hitung</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-semibold">Butuh {2 - laptops.length} lagi</span>
                </>
              )}
            </div>
            <p className="text-gray-600">Status</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Form Input */}
      {showForm || editingId ? (
        <Card>
          <CardHeader>
            <CardTitle>
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
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada laptop</h3>
          <p className="text-gray-600 mb-4">
            Tambahkan laptop pertama Anda untuk memulai perhitungan
          </p>
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Laptop Pertama
          </Button>
        </div>
      )}
      
      {/* Laptop List */}
      {laptops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Laptop ({laptops.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {laptops.map((laptop) => (
                <div
                  key={laptop.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-semibold">{laptop.name}</h4>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Rp {laptop.harga.toLocaleString('id-ID')}</span>
                      <span>•</span>
                      <span>{laptop.gpu}</span>
                      <span>•</span>
                      <span>{laptop.ssd >= 1000 ? `${laptop.ssd/1000} TB` : `${laptop.ssd} GB`}</span>
                      <span>•</span>
                      <span>{laptop.ram} GB RAM</span>
                      <span>•</span>
                      <span>{laptop.processor}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(laptop.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeLaptop(laptop.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add More Button */}
            <div className="mt-6 flex justify-between items-center">
              <Button variant="outline" onClick={() => setShowForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Laptop Lain
              </Button>
              
              {laptops.length >= 2 && (
                <Button asChild>
                  <Link href="/calculate">
                    Lanjut ke Perhitungan →
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}