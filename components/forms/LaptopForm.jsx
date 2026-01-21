'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

// Schema validasi YANG DIPERBAIKI
const laptopSchema = z.object({
  name: z.string().min(2, 'Nama laptop minimal 2 karakter'),
  harga: z.string().min(1, 'Harga harus diisi')
    .refine(val => {
      const num = parseInt(val.replace(/\./g, ''));
      return !isNaN(num) && num >= 1000000;
    }, 'Harga minimal Rp 1.000.000'),
  gpu: z.string().min(1, 'Pilih GPU'),
  ssd: z.number().min(128, 'SSD minimal 128GB'),
  ram: z.number().min(4, 'RAM minimal 4GB'),
  processor: z.string().min(1, 'Pilih processor')
});

export default function LaptopForm({ onSave, onCancel, initialData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(laptopSchema),
    defaultValues: initialData ? {
      ...initialData,
      harga: initialData.harga ? new Intl.NumberFormat('id-ID').format(initialData.harga) : ''
    } : {
      name: '',
      harga: '',
      gpu: '',
      ssd: '',
      ram: '',
      processor: ''
    }
  });
  
  // Pilihan dropdown
  const gpuOptions = [
    'RTX 3050', 'RTX 4050', 'RTX 4060', 'RTX 4070', 
    'RTX 4080', 'RTX 4090', 'RTX 5050'
  ];
  
  const ssdOptions = [
    { value: 256, label: '256 GB' },
    { value: 512, label: '512 GB' },
    { value: 1024, label: '1 TB' },
    { value: 2048, label: '2 TB' }
  ];
  
  const ramOptions = [
    { value: 8, label: '8 GB' },
    { value: 12, label: '12 GB' },
    { value: 16, label: '16 GB' },
    { value: 20, label: '20 GB' },
    { value: 32, label: '32 GB' },
    { value: 64, label: '64 GB' }
  ];
  
  const processorOptions = [
    'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
    'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'
  ];
  
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Konversi string ke number DENGAN BENAR
    const formattedData = {
      name: data.name,
      harga: parseInt(data.harga.toString().replace(/\./g, '')),
      gpu: data.gpu,
      ssd: parseInt(data.ssd),
      ram: parseInt(data.ram),
      processor: data.processor
    };
    
    console.log('Data formatted:', formattedData); // Debug
    
    onSave(formattedData);
    setIsSubmitting(false);
  };
  
  // Format input harga
  const formatHarga = (value) => {
    if (!value) return '';
    const num = value.toString().replace(/\D/g, '');
    return num ? new Intl.NumberFormat('id-ID').format(parseInt(num)) : '';
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Laptop */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Laptop *</Label>
            <Input
              id="name"
              placeholder="Contoh: Legion 5, Acer Nitro 5, dll."
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          {/* Harga - DIPERBAIKI */}
          <div className="space-y-2">
            <Label htmlFor="harga">Harga (Rp) *</Label>
            <Input
              id="harga"
              placeholder="19.500.000"
              onChange={(e) => {
                const formatted = formatHarga(e.target.value);
                setValue('harga', formatted, { shouldValidate: true });
              }}
              value={watch('harga') || ''}
            />
            <p className="text-xs text-gray-500">
              Contoh: 19500000 atau 19.500.000
            </p>
            {errors.harga && (
              <p className="text-sm text-red-500">{errors.harga.message}</p>
            )}
          </div>
          
          {/* GPU */}
          <div className="space-y-2">
            <Label htmlFor="gpu">GPU *</Label>
            <Select 
              onValueChange={(val) => setValue('gpu', val)} 
              defaultValue={watch('gpu')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih GPU" />
              </SelectTrigger>
              <SelectContent>
                {gpuOptions.map((gpu) => (
                  <SelectItem key={gpu} value={gpu}>
                    {gpu}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gpu && (
              <p className="text-sm text-red-500">{errors.gpu.message}</p>
            )}
          </div>
          
          {/* SSD */}
          <div className="space-y-2">
            <Label htmlFor="ssd">Kapasitas SSD *</Label>
            <Select 
              onValueChange={(val) => setValue('ssd', parseInt(val))} 
              defaultValue={watch('ssd')?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih SSD" />
              </SelectTrigger>
              <SelectContent>
                {ssdOptions.map((ssd) => (
                  <SelectItem key={ssd.value} value={ssd.value.toString()}>
                    {ssd.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ssd && (
              <p className="text-sm text-red-500">{errors.ssd.message}</p>
            )}
          </div>
          
          {/* RAM */}
          <div className="space-y-2">
            <Label htmlFor="ram">Kapasitas RAM *</Label>
            <Select 
              onValueChange={(val) => setValue('ram', parseInt(val))} 
              defaultValue={watch('ram')?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih RAM" />
              </SelectTrigger>
              <SelectContent>
                {ramOptions.map((ram) => (
                  <SelectItem key={ram.value} value={ram.value.toString()}>
                    {ram.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ram && (
              <p className="text-sm text-red-500">{errors.ram.message}</p>
            )}
          </div>
          
          {/* Processor */}
          <div className="space-y-2">
            <Label htmlFor="processor">Processor *</Label>
            <Select 
              onValueChange={(val) => setValue('processor', val)} 
              defaultValue={watch('processor')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Processor" />
              </SelectTrigger>
              <SelectContent>
                {processorOptions.map((proc) => (
                  <SelectItem key={proc} value={proc}>
                    {proc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.processor && (
              <p className="text-sm text-red-500">{errors.processor.message}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Laptop'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}