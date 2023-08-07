import { loaded } from "@/app/store/normalSlice";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";

export default function GridLogo({ width, logo, hidden, imageSize }) {
  const isLoaded = useAppSelector(loaded);

  return (
    <div className={`flex items-center justify-center ${width} `}>
      {!logo || !isLoaded ? (
        <Skeleton
          containerClassName="flex-1 h-full p-4 rounded-lg"
          height="100%"
        ></Skeleton>
      ) : (
        <div>
          {(logo.category == "teams" || logo.category == "college") && (
            <img
              src={logo.teamLogo}
              alt={`${logo.teamLogo} logo`}
              className={` ${hidden ? "hidden" : imageSize}`}
              loading="eager"
              priority="high"
            ></img>
          )}
          {!(logo.category == "teams" || logo.category == "college") && (
            <div
              className={`font-freshman px-2 ${
                logo.value.length < 3
                  ? imageSize.includes("60")
                    ? "text-xl"
                    : "sm:text-3xl text-xl"
                  : imageSize.includes("60")
                  ? "sm:text-md text-sm"
                  : "text-sm sm:text-xl"
              } text-center  break-words overflow-hidden`}
            >
              <div className="">{logo.value}</div>
              {imageSize.includes("96") && (
                <div className="text-xs text-gray-600">{logo.description}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
