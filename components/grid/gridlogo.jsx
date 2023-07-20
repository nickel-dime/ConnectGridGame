import { loaded } from "@/app/store/normalSlice";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";

export default function GridLogo({ width, logo, hidden }) {
  const isLoaded = useAppSelector(loaded);

  return (
    <div
      className={`flex items-center justify-center ${width} sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
    >
      {!logo || !isLoaded ? (
        <Skeleton
          containerClassName="flex-1 h-full p-4 rounded-lg"
          height="100%"
        ></Skeleton>
      ) : (
        <div>
          {(logo.category == "teams" || logo.category == "college") && (
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
          {!(logo.category == "teams" || logo.category == "college") && (
            <div className="font-freshman sm:text-lg text-sm text-center p-2 break-all ">
              <div className="">{logo.value}</div>
              <div className="text-xs text-gray-600">{logo.description}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
