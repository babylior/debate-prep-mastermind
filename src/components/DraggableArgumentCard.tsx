
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  onChange: (
    id: string,
    field: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing",
    value: string
  ) => void;
  onAdd?: () => void; // Show "+ Add Another Argument" when provided
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
}

// Mapping for form fields/labels/placeholders
const FIELD_CONFIG = [
  {
    key: "claim",
    label: "Claim",
    placeholder: "🚩 מה הטענה המרכזית שלך כאן?",
  },
  {
    key: "whyTrue",
    label: "Why True",
    placeholder: "למה זה נכון? מה הופך את זה לאמיתי או מבוסס?",
  },
  {
    key: "mechanism",
    label: "Mechanism",
    placeholder: "איך זה קורה בפועל? מי עושה מה, מתי ואיך?",
  },
  {
    key: "impact",
    label: "Impact",
    placeholder: "למה זה חשוב? איך זה משפיע על העולם או על אנשים?",
  },
  {
    key: "weighing",
    label: "Weighing",
    placeholder: "למה זה גובר על הטיעון של הצד השני?",
  },
] as const;

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
  onDragEnd,
}) => {
  const { toast } = useToast();

  // Render a single section with correct field/label/placeholder
  const renderField = (
    fieldKey: "claim" | "whyTrue" | "mechanism" | "impact" | "weighing",
    label: string,
    placeholder: string,
    value: string
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(id, fieldKey, e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[60px] bg-white border border-gray-200 rounded-md p-2 text-base placeholder:text-gray-400 mt-1"
      />
    </div>
  );

  return (
    <div
      draggable
      onDragStart={() => onDragStart && onDragStart(index)}
      onDragEnd={() => onDragEnd && onDragEnd()}
      className="relative"
    >
      <Card className="bg-white border border-gray-200 rounded-lg shadow transition-shadow flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg p-3">
          <span className="font-semibold text-primary">Argument</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDuplicate(id);
                toast({
                  title: "Argument duplicated",
                  description: "A copy of this argument has been created.",
                });
              }}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete(id);
                toast({
                  title: "Argument deleted",
                  description: "The argument has been removed.",
                });
              }}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* All sections */}
          {FIELD_CONFIG.map((config) =>
            renderField(
              config.key as
                | "claim"
                | "whyTrue"
                | "mechanism"
                | "impact"
                | "weighing",
              config.label,
              config.placeholder,
              {
                claim,
                whyTrue,
                mechanism,
                impact,
                weighing,
              }[config.key as keyof typeof config]
            )
          )}
        </CardContent>
      </Card>
      {/* Show "Add Another Argument" below card if onAdd is given */}
      {onAdd && (
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="px-3 py-1 rounded flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Another Argument</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DraggableArgumentCard;
