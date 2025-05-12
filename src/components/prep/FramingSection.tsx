
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTextFormat } from '@/hooks/useTextFormat';

interface FramingSectionProps {
  problem: string;
  mechanism: string;
  framing: string;
  onChange: (key: string, value: string) => void;
}

const FramingSection: React.FC<FramingSectionProps> = ({ problem, mechanism, framing, onChange }) => {
  const problemFormatting = useTextFormat({
    value: problem,
    onChange: (value) => onChange('problem', value)
  });

  const mechanismFormatting = useTextFormat({
    value: mechanism,
    onChange: (value) => onChange('mechanism', value)
  });

  const framingFormatting = useTextFormat({
    value: framing,
    onChange: (value) => onChange('framing', value)
  });

  return (
    <Accordion type="single" collapsible className="w-full bg-white shadow-md rounded-lg">
      <AccordionItem value="framing">
        <AccordionTrigger className="px-4 py-2 font-bold text-lg">פריימינג והקשר</AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>בעיה/מצב נוכחי</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="הגדר את הבעיה או המצב הנוכחי..."
                    className="min-h-[150px] rtl"
                    dir="rtl"
                    value={problem}
                    onChange={(e) => onChange('problem', e.target.value)}
                    onKeyUp={problemFormatting.handleSelection}
                    onMouseUp={problemFormatting.handleSelection}
                    onBold={problemFormatting.handleBold}
                    onItalic={problemFormatting.handleItalic}
                    onHighlight={problemFormatting.handleHighlight}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>מנגנון/פתרון</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="תאר את המנגנון או הגישה שלך..."
                    className="min-h-[150px] rtl"
                    dir="rtl"
                    value={mechanism}
                    onChange={(e) => onChange('mechanism', e.target.value)}
                    onKeyUp={mechanismFormatting.handleSelection}
                    onMouseUp={mechanismFormatting.handleSelection}
                    onBold={mechanismFormatting.handleBold}
                    onItalic={mechanismFormatting.handleItalic}
                    onHighlight={mechanismFormatting.handleHighlight}
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>פריימינג כללי</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="הגדר את מסגרת הדיון וההקשרים המרכזיים..."
                  className="min-h-[150px] rtl"
                  dir="rtl"
                  value={framing}
                  onChange={(e) => onChange('framing', e.target.value)}
                  onKeyUp={framingFormatting.handleSelection}
                  onMouseUp={framingFormatting.handleSelection}
                  onBold={framingFormatting.handleBold}
                  onItalic={framingFormatting.handleItalic}
                  onHighlight={framingFormatting.handleHighlight}
                />
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FramingSection;
