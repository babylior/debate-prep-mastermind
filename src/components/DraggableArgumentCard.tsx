import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTextFormat } from '@/hooks/useTextFormat';
interface DraggableArgumentCardProps {
  id: string;
  claim: string;
  whyTrue: string;
  mechanism: string;
  impact: string;
  weighing: string;
  index: number;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onChange: (id: string, field: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing", value: string) => void;
  onAdd?: () => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
}
const SECTION_FIELDS = [{
  key: "claim",
  label: "הטענה",
  placeholder: "🚩 מהו הטיעון המרכזי?"
}, {
  key: "whyTrue",
  label: "למה זה נכון",
  placeholder: "למה זה נכון מבחינה לוגית או עובדתית?"
}, {
  key: "mechanism",
  label: "מנגנון",
  placeholder: "איך זה עובד במציאות?"
}, {
  key: "impact",
  label: "השפעה",
  placeholder: "למה זה משנה? מהן ההשלכות?"
}, {
  key: "weighing",
  label: "שקלול",
  placeholder: "למה זה חזק יותר מהצד השני?"
}] as const;
const DraggableArgumentCard: React.FC<DraggableArgumentCardProps> = ({
  id,
  claim,
  whyTrue,
  mechanism,
  impact,
  weighing,
  index,
  onDelete,
  onDuplicate,
  onChange,
  onAdd,
  onDragStart,
  onDragEnd
}) => {
  const {
    toast
  } = useToast();
  const values = {
    claim,
    whyTrue,
    mechanism,
    impact,
    weighing
  };
  return <div draggable onDragStart={() => onDragStart && onDragStart(index)} onDragEnd={() => onDragEnd && onDragEnd()} className="relative" dir="rtl">
      <Card className="bg-white border border-gray-200 rounded-lg shadow transition-shadow flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg p-3">
          <span className="font-semibold text-primary flex items-center">
            <span className="ml-1">
          </span>
            טיעון {index + 1}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => {
            onDuplicate(id);
            toast({
              title: "הטיעון שוכפל",
              description: "עותק של טיעון זה נוצר."
            });
          }} className="h-8 w-8 p-0" type="button">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
            onDelete(id);
            toast({
              title: "הטיעון נמחק",
              description: "הטיעון הוסר."
            });
          }} className="h-8 w-8 p-0 text-red-500 hover:text-red-700" type="button">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {SECTION_FIELDS.map(({
          key,
          label,
          placeholder
        }) => {
          // Setup text formatting for each field
          const {
            handleSelection,
            handleBold,
            handleItalic,
            handleHighlight,
            handleRedColor,
            handleBlueColor,
            handleBlackColor
          } = useTextFormat({
            value: values[key],
            onChange: newValue => onChange(id, key, newValue)
          });
          return <div className="mb-4" key={key}>
                <label className="block text-sm font-medium mb-1" htmlFor={`${id}-${key}`}>
                  {label}
                </label>
                <Textarea id={`${id}-${key}`} value={values[key]} onChange={e => onChange(id, key, e.target.value)} placeholder={placeholder} className="w-full min-h-[60px] bg-white border border-gray-200 rounded-md p-2 text-base placeholder:text-gray-400 mt-1 rtl" dir="rtl" onKeyUp={handleSelection} onMouseUp={handleSelection} onBold={handleBold} onItalic={handleItalic} onHighlight={handleHighlight} onRedColor={handleRedColor} onBlueColor={handleBlueColor} onBlackColor={handleBlackColor} />
              </div>;
        })}
        </CardContent>
      </Card>
      {onAdd && <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" onClick={onAdd} className="px-3 py-1 rounded flex items-center gap-2" type="button">
            <span className="text-lg leading-none">+</span>
            <span>הוסף טיעון נוסף</span>
          </Button>
        </div>}
    </div>;
};
export default DraggableArgumentCard;