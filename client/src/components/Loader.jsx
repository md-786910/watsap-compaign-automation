import { Circles } from "react-loader-spinner"

function Loader({ height = 30, width = 30 }) {
  return (
    <div className={`flex1 justify-center items-center ${"visible"}`}>
      <div className="">
        <Circles color="blue" height={height} width={width} />
      </div>
    </div>
  );
}

export default Loader;
