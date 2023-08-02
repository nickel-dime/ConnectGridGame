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
            <Image
              src={logo.teamLogo}
              alt={`Hint logo ${logo}`}
              width={imageSize}
              height={imageSize}
              className={` ${hidden} ? 'hidden': ""`}
              loading="eager"
              priority="high"
            ></Image>
          )}
          {!(logo.category == "teams" || logo.category == "college") && (
            <div
              className={`font-freshman ${
                logo.value.length < 3
                  ? "sm:text-3xl text-xl"
                  : imageSize > 70
                  ? "sm:text-xl text-sm"
                  : "text-sm sm:text-md"
              } text-center p-2 break-words`}
            >
              <div className="">{logo.value}</div>
              {imageSize > 70 && (
                <div className="text-xs text-gray-600">{logo.description}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
