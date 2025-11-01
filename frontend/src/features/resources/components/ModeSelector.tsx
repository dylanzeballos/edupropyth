import { Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface ModeSelectorProps {
  mode: 'file' | 'url';
  onChange: (mode: 'file' | 'url') => void;
  disabled?: boolean;
}

export const ModeSelector = ({ mode, onChange, disabled }: ModeSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={mode === 'file' ? 'default' : 'outline'}
        onClick={() => onChange('file')}
        disabled={disabled}
        className="flex-1"
      >
        <Upload className="w-4 h-4 mr-2" />
        Subir Archivo
      </Button>
      <Button
        type="button"
        variant={mode === 'url' ? 'default' : 'outline'}
        onClick={() => onChange('url')}
        disabled={disabled}
        className="flex-1"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Enlace URL
      </Button>
    </div>
  );
};
