
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTextFormat } from '@/hooks/useTextFormat';

interface RebuttalSectionProps {
  notes: string;
  onChange: (value: string) => void;
}

const RebuttalSection: React.FC<RebuttalSectionProps> = ({ notes, onChange }) => {
  const { 
    handleSelection, 
    handleBold, 
    handleItalic, 
    handleHighlight,
    handlePurpleColor,
    handleBlueColor,
    handleGreenColor
  } = useTextFormat({
    value: notes,
    onChange
  });

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>הכנת תשובות לטיעוני הצד השני</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="הכן תשובות אפשריות לטיעונים של הצד השני..."
          className="min-h-[200px] rtl"
          dir="rtl"
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={handleSelection}
          onMouseUp={handleSelection}
          onBold={handleBold}
          onItalic={handleItalic}
          onHighlight={handleHighlight}
          onPurpleColor={handlePurpleColor}
          onBlueColor={handleBlueColor}
          onGreenColor={handleGreenColor}
        />
      </CardContent>
    </Card>
  );
};

export default RebuttalSection;
