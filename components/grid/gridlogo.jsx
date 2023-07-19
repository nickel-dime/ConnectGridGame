import Image from "next/image";

export default function GridLogo({ width, logo, hidden, league }) {
  const isTeam = logo.category == "teams" || logo.category == "college";

  return (
    <div
      className={`flex items-center justify-center ${width} sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
    >
      {isTeam && (
        <Image
          src={logo.teamLogo}
          alt={`Hint logo ${logo}`}
          width={96}
          height={96}
          className={` w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 ${hidden} ? 'hidden': ""`}
          loading="eager"
          priority="high"
        ></Image>
      )}
      {!isTeam && (
        <div className="font-freshman text-lg text-center p-2">
          <div className="">{logo.value}</div>
          <div className="text-xs text-gray-600">{logo.description}</div>
        </div>
      )}
    </div>
  );
}
