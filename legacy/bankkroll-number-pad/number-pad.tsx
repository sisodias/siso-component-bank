"use client";

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Button } from "./button";
import { Badge } from "./badge";
import { Delete } from 'lucide-react';
import { cn } from "../_utils/cn";

export type NumberPadType = 'currency' | 'phone' | 'decimal' | 'integer' | 'percentage' | 'pin' | 'time' | 'custom';

export interface NumberPadProps {
  title: string;
  onValueChange: (value: string) => void;
  type?: NumberPadType;
  maxLength?: number;
  currency?: string;
  locale?: string;
  countryCode?: string;
  maskInput?: boolean;
  customPattern?: RegExp;
  customFormatter?: (value: string) => string;
  placeholder?: string;
  children?: React.ReactNode;
}

interface NumberPadContentProps extends Omit<NumberPadProps, 'children'> {
  onClose: () => void;
}

export const formatters = {
  currency: (value: string, currency = 'USD', locale = 'en-US') => {
    if (!value || value === '0') return '';
    const numValue = parseFloat(value) / 100;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(numValue);
  },
  
  phone: (value: string, countryCode = 'US') => {
    const digits = value.replace(/\D/g, '');
    if (countryCode === 'US') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return digits;
  },
  
  percentage: (value: string) => {
    if (!value || value === '0') return '';
    const numValue = parseFloat(value);
    return `${numValue}%`;
  },
  
  pin: (value: string, maskInput = false) => {
    return maskInput ? '•'.repeat(value.length) : value;
  },
  
  time: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);
    return `${hours}:${minutes}`;
  },
  
  decimal: (value: string, locale = 'en-US') => {
    if (!value || value === '0') return '';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  }
};

function NumberPadContent({ 
  title, 
  onValueChange, 
  onClose, 
  type = 'decimal',
  maxLength = 10,
  currency = 'USD',
  locale = 'en-US',
  countryCode = 'US',
  maskInput = false,
  customPattern,
  customFormatter,
  placeholder = 'Enter value'
}: NumberPadContentProps) {
  const [rawValue, setRawValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const formatValue = (value: string) => {
    if (customFormatter) {
      return customFormatter(value);
    }

    switch (type) {
      case 'currency':
        return formatters.currency(value, currency, locale);
      case 'phone':
        return formatters.phone(value, countryCode);
      case 'percentage':
        return formatters.percentage(value);
      case 'pin':
        return formatters.pin(value, maskInput);
      case 'time':
        return formatters.time(value);
      case 'decimal':
        return formatters.decimal(value, locale);
      case 'integer':
        return value;
      default:
        return value;
    }
  };

  const handleNumberPress = (num: string) => {
    if (rawValue.length >= maxLength) return;
    
    let newValue = rawValue + num;
    
    if (type === 'time' && newValue.replace(/\D/g, '').length > 4) return;
    if (type === 'phone' && newValue.replace(/\D/g, '').length > 10) return;
    if (customPattern && !customPattern.test(newValue)) return;
    
    setRawValue(newValue);
  };

  const handleDecimalPress = () => {
    if (type === 'integer' || type === 'pin' || type === 'phone' || type === 'time') return;
    if (rawValue.includes('.')) return;
    if (rawValue.length >= maxLength) return;
    
    const newValue = rawValue + (rawValue === '' ? '0.' : '.');
    setRawValue(newValue);
  };

  const handleBackspace = () => {
    const newValue = rawValue.slice(0, -1);
    setRawValue(newValue);
  };

  const handleClear = () => {
    setRawValue('');
  };

  const handleConfirm = () => {
    onValueChange(rawValue);
    onClose();
  };

  const showDecimal = !['integer', 'pin', 'phone', 'time'].includes(type);

  useEffect(() => {
    const formatted = formatValue(rawValue);
    setDisplayValue(formatted);
  }, [rawValue, type, currency, locale, countryCode, maskInput]);

  useEffect(() => {
    // Delay focus to avoid conflicts with dialog/drawer opening
    const focusTimeout = setTimeout(() => {
      contentRef.current?.focus();
    }, 100);

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // Only process keyboard events if the content is focused
      if (document.activeElement === contentRef.current) {
        if (/^[0-9]$/.test(key)) {
          event.preventDefault();
          handleNumberPress(key);
        } else if ((key === '.' || key === ',') && showDecimal) {
          event.preventDefault();
          handleDecimalPress();
        } else if (key === 'Backspace' || key === 'Delete') {
          event.preventDefault();
          handleBackspace();
        } else if (key === 'Enter') {
          event.preventDefault();
          if (rawValue.length > 0) {
            handleConfirm();
          }
        } else if (key === 'Escape') {
          event.preventDefault();
          if (rawValue.length > 0) {
            handleClear();
          } else {
            onClose();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [rawValue, showDecimal, handleNumberPress, handleDecimalPress, handleBackspace, handleClear, handleConfirm, onClose]);

  return (
    <div className="w-full max-w-sm mx-auto" ref={contentRef} tabIndex={-1}>
      <div className="mb-6">
        <div className="bg-muted/50 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-mono font-semibold mb-1">
              {displayValue || placeholder}
            </div>
            {type === 'currency' && (
              <Badge variant="outline" className="text-xs">
                {currency} • {locale}
              </Badge>
            )}
            {type === 'phone' && (
              <Badge variant="outline" className="text-xs">
                {countryCode}
              </Badge>
            )}
            {type === 'percentage' && rawValue && (
              <Badge variant="outline" className="text-xs">
                {(parseFloat(rawValue) / 100).toFixed(2)}% decimal
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="h-14 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95"
            onClick={() => handleNumberPress(num.toString())}
          >
            {num}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="lg"
          className="h-14 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95"
          onClick={showDecimal ? handleDecimalPress : () => handleNumberPress('0')}
          disabled={!showDecimal && type !== 'integer' && type !== 'pin'}
        >
          {showDecimal ? '.' : (type === 'time' ? ':' : '.')}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="h-14 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95"
          onClick={() => handleNumberPress('0')}
        >
          0
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="h-14 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 active:scale-95"
          onClick={handleBackspace}
          disabled={rawValue.length === 0}
        >
          <Delete className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={rawValue.length === 0}
          className="h-12"
        >
          Clear
        </Button>
        <Button
          onClick={handleConfirm}
          className="h-12"
          disabled={rawValue.length === 0}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export function NumberPad(props: NumberPadProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const trigger = props.children || (
    <Button variant="outline" className="w-full">
      {props.title}
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader className="text-center">
            <DrawerTitle>{props.title}</DrawerTitle>
          </DrawerHeader>
          <NumberPadContent {...props} onClose={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{props.title}</DialogTitle>
        </DialogHeader>
        <NumberPadContent {...props} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}