"use client";
import MyModal from "../modal";
import Image from "next/image";
import React, { useEffect, useState, useContext } from "react";
import {
  getPlayer,
  boardStateSelector,
  loading,
  getBoardState,
} from "@/app/store/normalSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";

export default function GridBox({ boxId, playerSelected, disabled }) {
  let [isOpen, setIsOpen] = useState(false);
  let [imageLoaded, setImageLoaded] = useState(false);

  const league = useAppSelector((state) => state.league);

  function isRounded() {
    if (boxId == 0) {
      return "rounded-tl-[30px]";
    } else if (boxId == 2) {
      return "rounded-bl-[30px]";
    } else if (boxId == 6) {
      return "rounded-tr-[30px]";
    } else if (boxId == 8) {
      return "rounded-br-[30px]";
    }
  }

  return (
    <div>
      <MyModal isOpen={isOpen} setIsOpen={setIsOpen} boxId={boxId}></MyModal>
      <button
        className={` transition-colors duration-75 focus-visible:z-50 col-1 flex items-center border-x border-y border-[#fff0e6] justify-center ${isRounded()} ${
          playerSelected ? "bg-purple" : "bg-green-500"
        } sm:hover:bg-purple disabled: w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={disabled || playerSelected}
      >
        <div className="relative h-full w-full overflow flex flex-col justify-center items-center ">
          <div className="grow mt-4">
            {playerSelected ? (
              <Image
                src={playerSelected["profilePic"]}
                width={96}
                height={96}
                priority={true}
                className={`rounded-lg ${
                  league == "NBA"
                    ? "sm:w-[135px] w-[70px]"
                    : "sm:w-[92px] w-[60px]"
                }`}
                loading="eager"
                onLoad={() => {
                  setImageLoaded(true);
                }}
                alt="Image of player"
              ></Image>
            ) : (
              <></>
            )}
          </div>
          <div className="mb-2  text-[8px] font-bold sm:text-base text-white ">
            {playerSelected && imageLoaded
              ? `${playerSelected["firstName"]} ${playerSelected["lastName"]}`
              : ""}
          </div>
        </div>
      </button>
    </div>
  );
}
