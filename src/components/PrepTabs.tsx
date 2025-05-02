
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrepTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PrepTabs: React.FC<PrepTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="framing">Framing</TabsTrigger>
          <TabsTrigger value="idea-dump">Idea Dump</TabsTrigger>
          <TabsTrigger value="argument-builder">Argument Builder</TabsTrigger>
          <TabsTrigger value="rebuttal-builder">Rebuttal Builder</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PrepTabs;
