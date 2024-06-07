"use client";
import { SWRConfig } from "swr";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 h-screen">
        <div className="flex-1 h-screen">
          <SWRConfig
            value={{
              refreshInterval: 3000,
              fetcher: (resource, init) =>
                fetch(`http://localhost:8000/api/v1/${resource}`, init).then((res) => res.json()),
            }}
          >
            {children}
          </SWRConfig>
        </div>
      </div>
    </div>
  );
}
