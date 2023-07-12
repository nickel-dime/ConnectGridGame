"use client";
import Image from "next/image";
import Link from "next/link";
import React, {
  Fragment,
  use,
  useContext,
  useEffect,
  useState,
  useRef,
  forwardRef,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import Example, { HomeContext } from "../components/combobox";
import {
  BsGearFill,
  BsTwitter,
  BsLightbulbFill,
  BsQuestionCircleFill,
} from "react-icons/bs";

import Setting from "../components/settings";
import MyModal from "../components/modal";

function GridLogo({ width, logo, hidden }) {
  return (
    <div
      className={`flex items-center justify-center ${width} sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
    >
      <Image
        src={`/logos/${logo}.png`}
        alt={`Team logo ${logo}`}
        width={96}
        height={96}
        className={` w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 ${hidden} ? 'hidden': ""`}
        loading="eager"
        priority="high"
      ></Image>
    </div>
  );
}

function SportLogo({ width, logo, hidden }) {
  return (
    <div
      className={`flex items-center justify-center ${width} sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
    >
      {/* <button className="hover:shadow-lg rounded-lg hover:bg-emerald-300 p-2" onClick={() => { console.log("CLICK")}}> */}
      <Image
        src={`/logos/${logo}.png`}
        alt={`Team logo ${logo}`}
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

function GridBox({ boxId, reset }) {
  let [isOpen, setIsOpen] = useState(false);
  let [playerSelected, setPlayerSelected] = useState(null);
  let [loaded, setLoaded] = useState(false);

  const { guessesLeft, setGuessesLeft } = useContext(HomeContext);
  // const { reset, setReset } = useContext(HomeContext);

  useEffect(() => {
    let player;
    // Get the value from local storage if it exists
    player = JSON.parse(localStorage.getItem(`playerSelected${boxId}`)) || null;
    setPlayerSelected(player);
  }, [boxId, reset]);

  useEffect(() => {
    if (playerSelected) {
      localStorage.setItem(
        `playerSelected${boxId}`,
        JSON.stringify(playerSelected)
      );
      const image = document.createElement("img");
      image.src = playerSelected["profilePic"];
    }
  }, [playerSelected, boxId]);

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
          playerSelected ? "bg-indigo-900" : "bg-green"
        } sm:hover:bg-indigo-900 disabled: w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 `}
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
                className="rounded-md sm:w-[92px] w-[60px]"
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
          <div className="mb-2  text-[8px] font-bold sm:text-base text-yellow-400 ">
            {playerSelected && loaded
              ? `${playerSelected["firstName"]} ${playerSelected["lastName"]}`
              : ""}
          </div>
        </div>
      </button>
    </div>
  );
}

export default function Home() {
  const [guessesLeft, setGuessesLeft] = useState(9);

  let [teams, setTeams] = useState([]);
  let [isEndless, setIsEndless] = useState(true);

  let [reset, setReset] = useState(false);

  function resetTeams() {
    setReset(!reset);
    fetch(`/api/teams?isEndless=${isEndless}`)
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
        localStorage.setItem("teams", JSON.stringify(data));
      });
    setGuessesLeft(9);
    localStorage.setItem("guessesLeft", 9);

    for (let i = 0; i <= 8; i++) {
      localStorage.setItem(`playerSelected${i}`, null);
      localStorage.setItem(`previousGuesses${i}`, "[]");
    }
  }

  useEffect(() => {
    // load from local storage -> teams and mode guesses left
    const guessesLeft = localStorage.getItem("guessesLeft") || 9;
    setGuessesLeft(guessesLeft);

    const isEndless = localStorage.getItem("isEndless") || true;
    setIsEndless(isEndless);

    const teamsLocalStorage = JSON.parse(localStorage.getItem("teams"));
    if (teamsLocalStorage != "null" && teamsLocalStorage != null) {
      setTeams(teamsLocalStorage);
    }

    if (
      teamsLocalStorage === undefined ||
      teamsLocalStorage === null ||
      teamsLocalStorage.length == 0
    ) {
      fetch(`/api/teams?isEndless=${isEndless}`)
        .then((response) => response.json())
        .then((data) => {
          setTeams(data);
          localStorage.setItem("teams", JSON.stringify(data));
        });
    }
  }, []);

  return (
    <main className="  bg-background min-h-screen min-w-max flex justify-center items-center">
      {teams != undefined && teams.length > 0 && (
        <div className="mb-10 sm:mb-0">
          <div className="absolute top-0 left-0 right-0 max-w-[750px] mr-auto ml-auto">
            <div className="p-4 mt-1 sm:mt-5 font-freshman flex justify-between font-bold text-xl md:text-3xl font-display uppercase tracking-wide text-black">
              <div className="pl-4">CONNECT</div>
              <div className="flex gap-6 ">
                <a href="mailto:immaculategridironnfl@gmail.com?subject=Ideas%20for%20Grid">
                  <BsLightbulbFill className="fill-green sm:hover:fill-indigo-900 hidden sm:block"></BsLightbulbFill>
                </a>
                <BsQuestionCircleFill className="fill-green sm:hover:fill-indigo-900"></BsQuestionCircleFill>
                <a
                  href="https://twitter.com/ImmGridironNFL"
                  className="hidden sm:block"
                >
                  <BsTwitter className="fill-green sm:hover:fill-indigo-900"></BsTwitter>
                </a>
                <Setting></Setting>
              </div>
            </div>
          </div>
          <HomeContext.Provider
            value={{
              guessesLeft: guessesLeft,
              setGuessesLeft: setGuessesLeft,
              teams: teams,
              isEndless: isEndless,
            }}
          >
            <div>
              <div className="flex">
                {/* <div className="flex items-center justify-center w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"></div> */}
                <SportLogo width={"w-20"} logo="NFL" hidden={true}></SportLogo>
                <GridLogo width={"w-24"} logo={teams[0]}></GridLogo>
                <GridLogo width={"w-24"} logo={teams[1]}></GridLogo>
                <GridLogo width={"w-24"} logo={teams[2]}></GridLogo>
              </div>
              <div className="flex items-center">
                <div className="items-center">
                  <GridLogo width={"w-20"} logo={teams[3]}></GridLogo>
                  <GridLogo width={"w-20"} logo={teams[4]}></GridLogo>
                  <GridLogo width={"w-20"} logo={teams[5]}></GridLogo>
                </div>
                <div className="grid grid-rows-3 grid-flow-col justify-items-center overflow-hidden ">
                  {[...Array(9)].map((e, i) => (
                    <GridBox key={i} boxId={i} reset={reset}></GridBox>
                  ))}
                </div>
                <ManageNormalGameDesktop
                  guessesLeft={guessesLeft}
                  resetTeams={resetTeams}
                  isEndless={isEndless}
                ></ManageNormalGameDesktop>
              </div>
              <ManageNormalGameMobile
                guessesLeft={guessesLeft}
                resetTeams={resetTeams}
                isEndless={isEndless}
              ></ManageNormalGameMobile>
            </div>
          </HomeContext.Provider>
        </div>
      )}
    </main>
  );
}

function ManageNormalGameDesktop({ guessesLeft, resetTeams, isEndless }) {
  return (
    <div className=" text-black sm:w-36 md:w-40 h-full flex justify-center">
      <div className="hidden sm:block font-freshman">
        <div className="text-center text-4xl">{guessesLeft}</div>
        <div className="text-center text-lg">GUESSES</div>
        {isEndless && (
          <button
            onClick={() => {
              resetTeams();
            }}
            className=" text-yellow-400  sm:hover:bg-indigo-900 text-center flex m-auto bg-green p-2 pl-4 pr-4 mt-2 rounded-lg"
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}

function ManageNormalGameMobile({ guessesLeft, resetTeams, isEndless }) {
  return (
    <div className="h-24 sm:h-36 md:h-48 flex justify-center mt-8 sm:hidden text-black">
      <div className="font-freshman">
        <div className="text-center text-4xl">{guessesLeft}</div>
        <div className="text-center text-lg">GUESSES</div>
        {isEndless && (
          <button
            className="flex m-auto bg-green text-yellow-400 sm:hover:bg-indigo-900 p-2 pl-4 pr-4 mt-2 rounded-lg"
            onClick={() => {
              resetTeams();
            }}
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}
