import Image from "next/image";

export default function SportLogo({ width, logo, hidden, league }) {
  return (
    <div
      className={`flex items-center justify-center ${width} sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
    >
      {/* <button className="hover:shadow-lg rounded-lg hover:bg-emerald-300 p-2" onClick={() => { console.log("CLICK")}}> */}
      <Image
        src={`/logos/${league}/${logo}.png`}
        alt={`Hint logo ${logo}`}
        width={96}
        height={96}
        className={`w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 ${hidden} ? 'hidden': ""`}
        loading="eager"
        priority="high"
      ></Image>
      {/* </button> */}
    </div>
  );
}
