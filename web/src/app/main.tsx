"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SWRConfig } from "swr";

export default function Main({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (session !== undefined) {
      setLoaded(true);
    }
  }, [session]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 h-screen">
        <div className="flex-1 h-screen">
          <SWRConfig
            value={{
              refreshInterval: 3000,
              fetcher: (resource, init) =>
                fetch(`http://localhost:8000/api/v1/${resource}`, {
                  ...init,
                  headers: {
                    ...init?.headers,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.jwt}`,
                  },
                }).then((res) => res.json()),
            }}
          >
            {children}
          </SWRConfig>
        </div>
      </div>
    </div>
  );
}
