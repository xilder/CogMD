'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, LucideIcon } from 'lucide-react';
import React from 'react';

export type ActionButton = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
};

interface StatusScreenProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
  variant?: 'success' | 'error' | 'info'; 
  actions?: ActionButton[];
}

export default function StatusScreen({
  title,
  message,
  icon: Icon,
  variant = 'info',
  actions = [],
}: StatusScreenProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          DefaultIcon: CheckCircle,
          iconColor: 'text-green-500',
        };
      case 'error':
        return {
          DefaultIcon: AlertCircle,
          iconColor: 'text-red-500',
        };
      default:
        return {
          DefaultIcon: Info,
          iconColor: 'text-blue-500',
        };
    }
  };

  const { DefaultIcon, iconColor } = getVariantStyles();
  const DisplayIcon = Icon || DefaultIcon;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4'>
      <Card className='max-w-md w-full shadow-md border-slate-200 dark:border-slate-800'>
        <CardHeader className='flex flex-col items-center text-center pb-2'>
          <div className={`mb-4 p-3 rounded-full bg-slate-100 dark:bg-slate-900 ${iconColor}`}>
            <DisplayIcon size={48} />
          </div>
          {title && (
            <CardTitle className='text-2xl font-bold text-foreground'>
              {title}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className='text-center space-y-6'>
          <p className='text-muted-foreground text-lg leading-relaxed'>
            {message}
          </p>

          {actions.length > 0 && (
            <div className='flex flex-col sm:flex-row gap-3 justify-center pt-2'>
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  onClick={action.onClick}
                  variant={action.variant || 'default'}
                  disabled={action.disabled}
                  className='w-full sm:w-auto min-w-[120px]'
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}