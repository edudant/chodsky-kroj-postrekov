import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isValid: boolean;
  message: string;
}

export default function ValidationDialog({ open, onOpenChange, isValid, message }: ValidationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-validation">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {isValid ? (
              <CheckCircle2 className="w-16 h-16 text-chart-4" data-testid="icon-success" />
            ) : (
              <XCircle className="w-16 h-16 text-destructive" data-testid="icon-error" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl">
            {isValid ? 'Správně!' : 'Zkuste to znovu'}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2 font-handwritten text-lg" data-testid="text-validation-message">
            {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
