
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
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="idea-dump">רעיונות ראשוניים</TabsTrigger>
          <TabsTrigger value="argument-builder">בניית הנאום</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PrepTabs;
