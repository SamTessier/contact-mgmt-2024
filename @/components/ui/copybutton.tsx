import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ClipboardJS from "clipboard";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/20/solid";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const clipboard = new ClipboardJS(buttonRef.current, {
      text: () => text,
    });

    clipboard.on("success", () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    clipboard.on("error", (err) => {
      console.error("Failed to copy text: ", err);
    });

    return () => {
      clipboard.destroy();
    };
  }, [text]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            className="mr-2 p-1 text-xs border rounded bg-gray-200 hover:bg-gray-300"
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Click to copy"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
