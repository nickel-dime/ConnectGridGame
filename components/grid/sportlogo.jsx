import Image from "next/image";

export default function SportLogo({ width, logo, hidden, league, imageSize }) {
  return (
    <div className={`flex items-center justify-center ${width}`}>
      {/* <button className="hover:shadow-lg rounded-lg hover:bg-emerald-300 p-2" onClick={() => { console.log("CLICK")}}> */}
      {logo && (
        <img
          src={`/logos/${league}/${logo}.png`}
          alt={`Hint logo ${logo}`}
          className={` ${hidden ? "hidden" : imageSize}`}
          loading="eager"
          priority="high"
        ></img>
      )}
      {/* </button> */}
    </div>
  );
}
