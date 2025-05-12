
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface IdeaDumpTabProps {
  notes: string;
  onChange: (value: string) => void;
}

const IdeaDumpTab: React.FC<IdeaDumpTabProps> = ({ notes, onChange }) => {
  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>רעיונות ראשוניים</CardTitle>
        <CardDescription>רשום כאן את כל הרעיונות הראשוניים שלך, לפני ארגון הטיעונים</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="כתוב כאן את כל הרעיונות שלך. אל תדאג לארגון בשלב זה, פשוט כתוב את כל מה שעולה לך בראש..."
          className="min-h-[400px] rtl"
          dir="rtl"
          value={notes}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};

export default IdeaDumpTab;
