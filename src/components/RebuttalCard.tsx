
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface RebuttalCardProps {
  id: string;
  opponentPoint: string;
  yourRebuttal: string;
  goldenLine: string;
  connectToFrame: boolean;
  onChange: (
    id: string,
    field: "opponentPoint" | "yourRebuttal" | "goldenLine" | "connectToFrame",
    value: string | boolean
  ) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void; // Show "+ Add Rebuttal" button if provided
}

const FIELD_CONFIG = [
  {
    key: "opponentPoint",
    label: "Opposition Point",
    placeholder: "מה בדיוק טען הצד השני?",
  },
  {
    key: "yourRebuttal",
    label: "Your Rebuttal",
    placeholder: "מה התשובה שלך? איך את מפרקת את הטענה הזו?",
  },
  {
    key: "goldenLine",
    label: "Golden Line",
    placeholder: "שורת סיכום חדת מסר",
  },
] as const;

const RebuttalCard: React.FC<RebuttalCardProps> = ({
  id,
  opponentPoint,
  yourRebuttal,
  goldenLine,
  connectToFrame,
  onChange,
  onDelete,
  onAdd,
}) => {
  const { toast } = useToast();

  // Render a text area for each main field
  const renderField = (
    fieldKey: "opponentPoint" | "yourRebuttal" | "goldenLine",
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
        className="w-full min-h-[54px] bg-white border border-gray-200 rounded-md p-2 text-base placeholder:text-gray-400 mt-1"
      />
    </div>
  );

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow flex flex-col mb-4">
      <CardHeader className="bg-gray-50 rounded-t-lg p-3 pb-2">
        <span className="font-semibold text-red-600">Rebuttal</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onDelete(id);
          }}
          className="h-8 w-20 p-0 mt-1 text-red-500 hover:text-red-700 self-end"
        >
          Delete
        </Button>
      </CardHeader>
      <CardContent className="pt-3 pb-4">
        {FIELD_CONFIG.map((config) =>
          renderField(
            config.key as
              | "opponentPoint"
              | "yourRebuttal"
              | "goldenLine",
            config.label,
            config.placeholder,
            {
              opponentPoint,
              yourRebuttal,
              goldenLine,
            }[config.key as keyof typeof config]
          )
        )}
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={connectToFrame}
            id={`connect-${id}`}
            onChange={(e) =>
              onChange(id, "connectToFrame", e.target.checked)
            }
            className="accent-purple-500 h-4 w-4 mr-2"
          />
          <label htmlFor={`connect-${id}`} className="text-sm">
            Connect to main framing (optional)
          </label>
        </div>
        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onAdd) {
                onAdd();
                toast({
                  title: "✅ Rebuttal added",
                  description: "",
                });
              }
            }}
            className="px-3 py-1 mt-2 flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Rebuttal</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RebuttalCard;
