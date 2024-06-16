import { signIn } from "next-auth/react";
import { Icons } from "@/components/icons";

interface SignInButtonProps {
  provider: string;
  setIsProviderLoading: (isProviderLoading: boolean) => void;
  isProviderLoading: boolean;
  isAnyProviderLoading: boolean;
  displayName: string;
  className: string;
}

export function SignInButton({
  provider,
  setIsProviderLoading,
  isProviderLoading,
  isAnyProviderLoading,
  displayName,
  className,
}: SignInButtonProps) {
  const IconComponent = Icons[provider as keyof typeof Icons];
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        setIsProviderLoading(true);
        signIn(provider);
      }}
      disabled={isAnyProviderLoading}
    >
      {isProviderLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <IconComponent className="mr-2 h-4 w-4" />
      )}{" "}
      {displayName}
    </button>
  );
}
