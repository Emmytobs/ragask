import { Logo } from "@/components/logo";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

const ROLE = ["user", "ai"] as const;
export type Role = (typeof ROLE)[number];

function ChatMessage({
  role,
  message,
  relatedPages,
  setCurrentPage,
}: {
  role: Role;
  message: string;
  relatedPages?: number[];
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div className="flex flex-start mb-[12px] px-6">
      {role === "user" ? (
        <div className="max-w-[900px] p-3 bg-gray-50 text-sm rounded-[20px] ml-auto">
          {message}
        </div>
      ) : (
        <div className="flex gap-x-3">
          <span role="img" aria-label="ai" style={{ fontSize: "24px" }}>
            <Logo />
          </span>
          <span>
            <Markdown className="text-sm" remarkPlugins={[remarkGfm]}>
              {message}
            </Markdown>
            {relatedPages &&  relatedPages.length > 0 && (
              <div className="flex justify-start">
                <div className="inline-flex items-center justify-end bg-gray-100 rounded-lg mt-2 p-1 pl-2">
                  <div className="text-xs">Related pages:</div>
                  {relatedPages.length > 0 &&
                    relatedPages.slice(0, 5).map((page, index) => (
                      <Button
                        variant="link"
                        className="text-sky-400 h-2 w-2"
                        color="#335D84"
                        onClick={() => setCurrentPage(page)}
                        key={index}
                      >
                        <div className="text-xs">{page}</div>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
