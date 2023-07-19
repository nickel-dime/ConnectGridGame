"use client";
import MyModal from "../modal";
import Image from "next/image";
import React, { useEffect, useState, useContext } from "react";
import { HomeContext } from "../combobox";

export default function GridBox({ boxId, clear }) {
  let [isOpen, setIsOpen] = useState(false);
  let [playerSelected, setPlayerSelected] = useState(null);
  let [loaded, setLoaded] = useState(false);

  const { guessesLeft, settings } = useContext(HomeContext);

  useEffect(() => {
    let player;
    // Get the value from local storage if it exists
    player =
      JSON.parse(
        localStorage.getItem(`${settings.league}playerSelected${boxId}`)
      ) || null;
    setPlayerSelected(player);
  }, [boxId, clear, settings.league]);

  useEffect(() => {
    if (playerSelected) {
      localStorage.setItem(
        `${settings.league}playerSelected${boxId}`,
        JSON.stringify(playerSelected)
      );
      const image = document.createElement("img");
      image.src = playerSelected["profilePic"];
    }
  }, [playerSelected, boxId, settings.league]);

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
      <MyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setPlayerSelected={setPlayerSelected}
        boxId={boxId}
      ></MyModal>
      <button
        className={` transition-colors duration-75 focus-visible:z-50 col-1 flex items-center border-x border-y border-[#fff0e6] justify-center ${isRounded()} ${
          playerSelected ? "bg-purple" : "bg-green-500"
        } sm:hover:bg-purple disabled: w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={guessesLeft <= 0 || playerSelected}
      >
        <div className="relative h-full w-full overflow flex flex-col justify-center items-center ">
          <div className="grow mt-4">
            {playerSelected ? (
              <Image
                src={playerSelected["profilePic"]}
                width={96}
                height={96}
                priority={true}
                className={`rounded-md ${
                  settings.league == "NBA"
                    ? "sm:w-[135px] w-[70px]"
                    : "sm:w-[92px] w-[60px]"
                }`}
                loading="eager"
                onLoad={() => {
                  setLoaded(true);
                }}
                alt="Image of player"
              ></Image>
            ) : (
              <></>
            )}
          </div>
          <div className="mb-2  text-[8px] font-bold sm:text-base text-white ">
            {playerSelected && loaded
              ? `${playerSelected["firstName"]} ${playerSelected["lastName"]}`
              : ""}
          </div>
        </div>
      </button>
    </div>
  );
}
