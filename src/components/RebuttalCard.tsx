
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
  onAdd?: () => void;
}

const FIELDS = [
  {
    key: "opponentPoint",
    label: "Opposition Point",
    placeholder: "What did the opponent claim?",
  },
  {
    key: "yourRebuttal",
    label: "Your Rebuttal",
    placeholder: "What is your direct response or counterargument?",
  },
  {
    key: "goldenLine",
    label: "Golden Line",
    placeholder: "A concise, memorable summary sentence of your rebuttal",
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

  const values = { opponentPoint, yourRebuttal, goldenLine };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow flex flex-col mb-4">
      <CardHeader className="bg-gray-50 rounded-t-lg p-3 pb-2">
        <span className="font-semibold text-primary flex items-center">
          <span className="mr-1">🚩</span>
          Rebuttal
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="h-8 w-20 p-0 mt-1 text-red-500 hover:text-red-700 self-end"
          type="button"
        >
          Delete
        </Button>
      </CardHeader>
      <CardContent className="pt-3 pb-4">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div className="mb-4" key={key}>
            <label className="block text-sm font-medium mb-1" htmlFor={`${id}-${key}`}>
              {label}
            </label>
            <Textarea
              id={`${id}-${key}`}
              value={values[key]}
              onChange={e => onChange(id, key, e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[54px] bg-white border border-gray-200 rounded-md p-2 text-base placeholder:text-gray-400 mt-1"
            />
          </div>
        ))}
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={connectToFrame}
            id={`connect-${id}`}
            onChange={e => onChange(id, "connectToFrame", e.target.checked)}
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
              onAdd();
              toast({
                title: "✅ Rebuttal added",
                description: "",
              });
            }}
            className="px-3 py-1 mt-2 flex items-center gap-2"
            type="button"
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
