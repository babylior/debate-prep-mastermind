
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface RebuttalSectionProps {
  notes: string;
  onChange: (value: string) => void;
}

const RebuttalSection: React.FC<RebuttalSectionProps> = ({ notes, onChange }) => {
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
        />
      </CardContent>
    </Card>
  );
};

export default RebuttalSection;
