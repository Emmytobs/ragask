export function Button({
  disabled = true,
  focus = false,
}: {
  disabled: boolean;
  focus: boolean;
}) {
  return (
    <button
      type="submit"
      className="absolute right-2 flex items-center justify-center w-10 h-10 text-gray-700 bg-transparent border-none rounded-full cursor-not-allowed"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {disabled ? (
          <>
            <path
              d="M24 38V10"
              stroke="#D1D1D1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 24L24 10L38 24"
              stroke="#D1D1D1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="24" r="23.5" stroke="#D1D1D1" />
          </>
        ) : focus ? (
          <>
            <path
              d="M24 38V10"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 24L24 10L38 24"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="24" r="23" stroke="black" strokeWidth="2" />
          </>
        ) : (
          <>
            <path
              d="M24 38V10"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 24L24 10L38 24"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="24" r="23.5" stroke="black" />
          </>
        )}
      </svg>
    </button>
  );
}
