import { useState } from 'react';
import ValidationDialog from '../ValidationDialog';
import { Button } from '@/components/ui/button';

export default function ValidationDialogExample() {
  const [open, setOpen] = useState(false);
  const [isValid, setIsValid] = useState(true);

  return (
    <div className="space-y-4 p-8">
      <div className="flex gap-4">
        <Button 
          onClick={() => {
            setIsValid(true);
            setOpen(true);
          }}
          data-testid="button-show-success"
        >
          Zobrazit úspěch
        </Button>
        <Button 
          variant="destructive"
          onClick={() => {
            setIsValid(false);
            setOpen(true);
          }}
          data-testid="button-show-error"
        >
          Zobrazit chybu
        </Button>
      </div>

      <ValidationDialog 
        open={open}
        onOpenChange={setOpen}
        isValid={isValid}
        message={isValid 
          ? "Výborně! Tato kombinace je tradičně správná! 🎉" 
          : "Och! Tato kombinace není úplně tradičně správná. Zkuste to znovu! 🤔"
        }
      />
    </div>
  );
}
