
import * as React from "react"
import { useAutoResize } from "@/hooks/useAutoResize"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onBold?: () => void;
  onItalic?: () => void;
  onHighlight?: () => void;
  onRedColor?: () => void;
  onBlueColor?: () => void;
  onBlackColor?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onBold, onItalic, onHighlight, onRedColor, onBlueColor, onBlackColor, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    // Initialize auto-resize
    useAutoResize(textareaRef);

    return (
      <div className="flex flex-col w-full">
        {(onBold || onItalic || onHighlight || onRedColor || onBlueColor || onBlackColor) && (
          <div className="flex items-center mb-1 gap-1 flex-wrap">
            {/* Text style buttons */}
            <div className="flex gap-1 mr-2">
              {onBold && (
                <button 
                  type="button" 
                  onClick={onBold} 
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <span className="font-bold">B</span>
                </button>
              )}
              {onItalic && (
                <button 
                  type="button" 
                  onClick={onItalic} 
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <span className="italic">I</span>
                </button>
              )}
              {onHighlight && (
                <button 
                  type="button" 
                  onClick={onHighlight} 
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Highlight"
                >
                  <span className="bg-yellow-200 px-1">H</span>
                </button>
              )}
            </div>

            {/* Color buttons */}
            <div className="flex gap-1">
              {onRedColor && (
                <button 
                  type="button" 
                  onClick={onRedColor} 
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Red Text"
                >
                  <span className="text-red-600 font-bold">A</span>
                </button>
              )}
              {onBlueColor && (
                <button 
                  type="button" 
                  onClick={onBlueColor} 
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Blue Text"
                >
                  <span className="text-blue-600 font-bold">A</span>
                </button>
              )}
              {onBlackColor && (
                <button 
                  type="button" 
                  onClick={onBlackColor} 
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Black Text"
                >
                  <span className="text-black font-bold">A</span>
                </button>
              )}
            </div>
          </div>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-[height] duration-200",
            className
          )}
          ref={(node) => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (textareaRef) {
              textareaRef.current = node;
            }
          }}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
