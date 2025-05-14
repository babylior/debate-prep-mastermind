
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InstructionPanelProps {
  title: string;
  items: string[];
}

const InstructionPanel: React.FC<InstructionPanelProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="p-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle {title}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <CardContent className="pt-2">
              <ul className="list-disc pl-5 space-y-1">
                {items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default InstructionPanel;
