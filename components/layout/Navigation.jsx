'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, Laptop, Calculator, Trophy, 
  Info, Menu, X, BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { useLaptopStore } from '@/store/laptopStore';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { laptops } = useLaptopStore();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { href: '/input', label: 'Input Data', icon: <Laptop className="h-4 w-4" /> },
    { href: '/calculate', label: 'Perhitungan', icon: <Calculator className="h-4 w-4" /> },
    { href: '/results', label: 'Hasil', icon: <Trophy className="h-4 w-4" /> },
    { href: '/about', label: 'Tentang', icon: <Info className="h-4 w-4" /> },
  ];
  
  const isActive = (href) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <Card className="sticky top-0 z-50 rounded-none md:rounded-lg mx-4 md:mx-6 mt-4 md:mt-6">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SPK Laptop MPE</h1>
              <p className="text-xs text-gray-600">Sistem Pendukung Keputusan</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                asChild
                className="gap-2"
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.label}
                  {item.href === '/input' && laptops.length > 0 && (
                    <span className="ml-1 bg-white text-primary text-xs px-1.5 py-0.5 rounded-full">
                      {laptops.length}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="p-2 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  asChild
                  className="w-full justify-start gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                    {item.href === '/input' && laptops.length > 0 && (
                      <span className="ml-auto bg-white text-primary text-xs px-1.5 py-0.5 rounded-full">
                        {laptops.length}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
              
              {/* Stats in Mobile */}
              <div className="p-3 bg-gray-50 rounded-lg mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Laptop</span>
                  <span className="font-bold">{laptops.length}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${laptops.length >= 2 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {laptops.length >= 2 ? 'Siap' : 'Butuh data'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Progress Bar */}
      {pathname !== '/' && (
        <div className="px-4 md:px-6 mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress Sistem</span>
            <span>
              {(() => {
                if (pathname.startsWith('/input')) return 'Step 1: Input Data';
                if (pathname.startsWith('/calculate')) return 'Step 2: Perhitungan';
                if (pathname.startsWith('/results')) return 'Step 3: Hasil';
                return '';
              })()}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: pathname === '/' ? '0%' :
                       pathname.startsWith('/input') ? '33%' :
                       pathname.startsWith('/calculate') ? '66%' :
                       pathname.startsWith('/results') ? '100%' : '0%'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}