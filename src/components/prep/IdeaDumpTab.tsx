import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useTextFormat } from '@/hooks/useTextFormat';
interface IdeaDumpTabProps {
  notes: string;
  onChange: (value: string) => void;
}
const IdeaDumpTab: React.FC<IdeaDumpTabProps> = ({
  notes,
  onChange
}) => {
  const {
    handleSelection,
    handleBold,
    handleItalic,
    handleHighlight,
    handleRedColor,
    handleBlueColor,
    handleBlackColor
  } = useTextFormat({
    value: notes,
    onChange
  });
  return <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Idea dump  💡 </CardTitle>
        <CardDescription>
      </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea placeholder="כתוב כאן את כל הרעיונות שלך. אל תדאג לארגון בשלב זה, פשוט כתוב את כל מה שעולה לך בראש..." className="min-h-[400px] rtl" dir="rtl" value={notes} onChange={e => onChange(e.target.value)} onKeyUp={handleSelection} onMouseUp={handleSelection} onBold={handleBold} onItalic={handleItalic} onHighlight={handleHighlight} onRedColor={handleRedColor} onBlueColor={handleBlueColor} onBlackColor={handleBlackColor} />
        <div className="mt-2 text-sm text-gray-500 rtl" dir="rtl">
          <p>טיפ: סמן טקסט כלשהו ולחץ על הכפתורים למעלה כדי להוסיף עיצוב.</p>
          <p>**טקסט מודגש** ← מודגש | *טקסט נטוי* ← נטוי | ===טקסט מסומן=== ← מסומן</p>
          <p>@@red:טקסט אדום@@ | @@blue:טקסט כחול@@ | @@black:טקסט שחור@@</p>
        </div>
      </CardContent>
    </Card>;
};
export default IdeaDumpTab;