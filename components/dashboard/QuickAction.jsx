'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, Calculator, Trophy, Settings,
  Download, Upload, BookOpen, BarChart3,
  FileText, Share2
} from 'lucide-react';
import { useLaptopStore } from '@/store/laptopStore';

export default function QuickActions() {
  const { laptops, loadSampleData, clearLaptops, calculateResults } = useLaptopStore();
  const hasLaptops = laptops.length > 0;

  const actions = [
    {
      label: 'Tambah Laptop',
      description: 'Input data laptop baru',
      icon: <PlusCircle className="h-5 w-5" />,
      href: '/input',
      variant: 'default',
      enabled: true
    },
    {
      label: 'Lihat Data Contoh',
      description: 'Load data dari Excel Anda',
      icon: <Download className="h-5 w-5" />,
      onClick: loadSampleData,
      variant: 'outline',
      enabled: true
    },
    {
      label: 'Mulai Perhitungan',
      description: 'Proses MPE sekarang',
      icon: <Calculator className="h-5 w-5" />,
      href: '/calculate',
      variant: 'default',
      enabled: hasLaptops && laptops.length >= 2
    },
    {
      label: 'Lihat Hasil',
      description: 'Ranking laptop terbaik',
      icon: <Trophy className="h-5 w-5" />,
      href: '/results',
      variant: 'outline',
      enabled: hasLaptops
    },
    {
      label: 'Atur Bobot',
      description: 'Ubah tingkat kepentingan',
      icon: <Settings className="h-5 w-5" />,
      href: '/input?tab=weights',
      variant: 'outline',
      enabled: true
    },
    {
      label: 'Export Hasil',
      description: 'Download PDF/Excel',
      icon: <FileText className="h-5 w-5" />,
      href: '/results?export=true',
      variant: 'outline',
      enabled: hasLaptops
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const buttonContent = (
              <Button
                key={index}
                variant={action.variant}
                className={`h-24 flex-col gap-2 ${!action.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={action.onClick}
                disabled={!action.enabled}
                asChild={action.href && action.enabled}
              >
                {action.href && action.enabled ? (
                  <Link href={action.href}>
                    {action.icon}
                    <span className="text-sm font-medium">{action.label}</span>
                    <span className="text-xs text-gray-500">{action.description}</span>
                  </Link>
                ) : (
                  <>
                    {action.icon}
                    <span className="text-sm font-medium">{action.label}</span>
                    <span className="text-xs text-gray-500">{action.description}</span>
                  </>
                )}
              </Button>
            );
            
            if (!action.enabled && action.href) {
              return (
                <div key={index} className="relative">
                  {buttonContent}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Butuh {2 - laptops.length} laptop
                    </span>
                  </div>
                </div>
              );
            }
            
            return buttonContent;
          })}
        </div>
        
        {/* Status Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Status Sistem</p>
              <p className="text-sm text-gray-600">
                {hasLaptops 
                  ? `${laptops.length} laptop siap diproses`
                  : 'Belum ada data laptop'
                }
              </p>
            </div>
            {hasLaptops && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearLaptops}
              >
                Reset Semua
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}