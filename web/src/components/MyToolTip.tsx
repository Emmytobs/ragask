
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function MyToolTip({ text, content }: { text: string, content: React.ReactNode }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {content}
                </TooltipTrigger>
                <TooltipContent align="start">
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

