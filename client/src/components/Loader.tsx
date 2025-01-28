function Loader() {
  return (
    <div className={`flex1 justify-center items-center ${"visible"}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-8 border-b-4 border-gray-900"></div>
    </div>
  );
}

export default Loader;
