import ScaleLoader from "react-spinners/ScaleLoader";
function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center h-screen">
      <ScaleLoader color="#000" />
    </div>
  );
}

export default Loading;
