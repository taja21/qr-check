// 📄 components/ui/card.tsx
import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="border rounded-md shadow p-4 bg-white">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>;
}
