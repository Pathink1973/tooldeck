import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  previewUrl?: string;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, error, value, onChange, previewUrl, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange?.(file);
      }
    };

    const handleRemove = () => {
      setPreview(null);
      onChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#111827] mb-1">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-[12px] border-[#E5E7EB] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer',
            error && 'border-red-500',
            className
          )}
          onClick={handleClick}
        >
          <input
            type="file"
            className="hidden"
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            onChange={handleFileChange}
            accept="image/*"
            {...props}
          />

          {preview ? (
            <div className="relative w-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="absolute top-2 right-2 rounded-full p-1 w-8 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <Image className="w-12 h-12 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para carregar</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">PNG, JPG ou GIF (max. 5MB)</p>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';