
import React from 'react';
import DraggableContentCard from './DraggableContentCard';

interface Content {
  id: string;
  title: string;
  content: string;
  type: 'argument' | 'rebuttal' | 'framing';
}

interface ContentPanelProps {
  argumentsList: Content[];
  rebuttals: Content[];
  framing: Content[];
}

const ContentPanel: React.FC<ContentPanelProps> = ({
  argumentsList,
  rebuttals,
  framing
}) => {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold mb-3">Arguments</h3>
        <div className="space-y-2">
          {argumentsList.map((arg) => (
            <DraggableContentCard key={arg.id} {...arg} />
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="font-semibold mb-3">Rebuttals</h3>
        <div className="space-y-2">
          {rebuttals.map((rebuttal) => (
            <DraggableContentCard key={rebuttal.id} {...rebuttal} />
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="font-semibold mb-3">Framing</h3>
        <div className="space-y-2">
          {framing.map((frame) => (
            <DraggableContentCard key={frame.id} {...frame} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContentPanel;
