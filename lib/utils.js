import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format Rupiah
export function formatRupiah(amount) {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Format storage
export function formatStorage(gb) {
  if (gb >= 1000) {
    return `${(gb / 1000).toFixed(1)} TB`;
  }
  return `${gb} GB`;
}

// Get rating color
export function getRatingColor(score) {
  if (score >= 4) return 'text-green-600 bg-green-100';
  if (score >= 3) return 'text-blue-600 bg-blue-100';
  if (score >= 2) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}