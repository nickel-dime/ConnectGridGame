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
  useMemo,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import SearchPlayer, { HomeContext } from "../components/combobox";
import {
  BsGearFill,
  BsTwitter,
  BsLightbulbFill,
  BsQuestionCircleFill,
} from "react-icons/bs";

import Setting from "../components/settings";
import MyModal from "../components/modal";
import Help from "../components/help";

function GridLogo({ width, logo, hidden, league }) {
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
        <div className="font-freshman text-lg text-center">
          <div className="">{logo.value}</div>
          <div className="text-xs text-gray-600">{logo.description}</div>
        </div>
      )}
    </div>
  );
}

function SportLogo({ width, logo, hidden, league }) {
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

function GridBox({ boxId, clear }) {
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
  }, [boxId, clear]);

  useEffect(() => {
    if (playerSelected) {
      localStorage.setItem(
        `${settings.league}playerSelected${boxId}`,
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

export default function Home() {
  const [guessesLeft, setGuessesLeft] = useState(9);
  const [hints, setHints] = useState([]);
  const [settings, setSettings] = useState(null);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    const isEndless = localStorage.getItem("isEndless") || 0;
    const league = localStorage.getItem("league") || "NBA";
    const mode = localStorage.getItem("mode") || "normal";

    setSettings({
      isEndless: isEndless,
      league: league,
      initial: true,
      mode: mode,
    });
  }, []);

  useEffect(() => {
    if (settings == null) {
      return;
    }
    // if is endless changed -> we have new is endless value cuz set so get new hints
    // if league changed we have new league value so get league
    // if reset changed we change anwyay
    const guessesLeft = localStorage.getItem(`${settings.league}guessesLeft`);

    if (guessesLeft) {
      setGuessesLeft(guessesLeft);
    } else {
      setGuessesLeft(9);
      localStorage.setItem(`${settings.league}guessesLeft`, 9);
    }

    if (!settings.initial) {
      setClear(!clear);
      for (let i = 0; i <= 8; i++) {
        localStorage.setItem(`${settings.league}playerSelected${i}`, null);
        localStorage.setItem(`${settings.league}previousGuesses${i}`, "[]");
      }
    }

    const hints = localStorage.getItem(`${settings.league}hints`);
    if (hints == null || !settings.initial || !settings.isEndless) {
      fetch(
        `/api/hints/${settings.league.toLowerCase()}?isEndless=${
          settings.isEndless
        }`
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem(`${settings.league}hints`, JSON.stringify(data));
          setHints(data);
        });
    } else {
      setHints(JSON.parse(hints));
    }
  }, [settings]);

  return (
    <main className="  bg-background min-h-screen min-w-max flex justify-center items-center">
      <div className="mb-10 sm:mb-0">
        <div className="absolute top-0 left-0 right-0 max-w-[750px] mr-auto ml-auto">
          <div className="p-4 mt-1 sm:mt-5 font-freshman flex justify-between font-bold text-xl md:text-3xl font-display uppercase tracking-wide text-black">
            <div className="pl-4">CONNECT</div>
            <div className="flex gap-5 ">
              <a
                href="mailto:connectgridgame@proton.me?subject=Ideas%20for%20Grid"
                className="p-1"
              >
                <BsLightbulbFill className="fill-green-500 sm:hover:fill-purple hidden sm:block"></BsLightbulbFill>
              </a>
              <Help></Help>
              <a
                href="https://twitter.com/ConnectGridGame"
                className="hidden sm:block p-1"
              >
                <BsTwitter className="fill-green-500 sm:hover:fill-purple"></BsTwitter>
              </a>
              {hints != undefined && hints.length > 0 && (
                <Setting
                  setSettings={setSettings}
                  settings={settings}
                ></Setting>
              )}
            </div>
          </div>
        </div>
        {hints != undefined && hints.length > 0 && (
          <HomeContext.Provider
            value={{
              guessesLeft: guessesLeft,
              setGuessesLeft: setGuessesLeft,
              hints: hints,
              settings: settings,
              setSettings: setSettings,
            }}
          >
            <div>
              <div className="flex">
                {/* <div className="flex items-center justify-center w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"></div> */}
                <SportLogo
                  width={"w-20"}
                  logo={settings.league}
                  hidden={true}
                  league={settings.league}
                ></SportLogo>
                <GridLogo
                  width={"w-24"}
                  logo={hints[0]}
                  league={settings.league}
                ></GridLogo>
                <GridLogo
                  width={"w-24"}
                  logo={hints[1]}
                  league={settings.league}
                ></GridLogo>
                <GridLogo
                  width={"w-24"}
                  logo={hints[2]}
                  league={settings.league}
                ></GridLogo>
              </div>
              <div className="flex items-center">
                <div className="items-center">
                  <GridLogo
                    width={"w-20"}
                    logo={hints[3]}
                    league={settings.league}
                  ></GridLogo>
                  <GridLogo
                    width={"w-20"}
                    logo={hints[4]}
                    league={settings.league}
                  ></GridLogo>
                  <GridLogo
                    width={"w-20"}
                    logo={hints[5]}
                    league={settings.league}
                  ></GridLogo>
                </div>
                <div className="grid grid-rows-3 grid-flow-col justify-items-center overflow-hidden ">
                  {[...Array(9)].map((e, i) => (
                    <GridBox key={i} boxId={i} clear={clear}></GridBox>
                  ))}
                </div>
                <ManageNormalGameDesktop
                  guessesLeft={guessesLeft}
                ></ManageNormalGameDesktop>
              </div>
              <ManageNormalGameMobile
                guessesLeft={guessesLeft}
              ></ManageNormalGameMobile>
            </div>
          </HomeContext.Provider>
        )}
      </div>
    </main>
  );
}

function ManageNormalGameDesktop({ guessesLeft }) {
  const { settings, setSettings } = useContext(HomeContext);

  return (
    <div className=" text-black sm:w-36 md:w-40 h-full flex justify-center">
      <div className="hidden sm:block font-freshman">
        <div className="text-center text-4xl">{guessesLeft}</div>
        <div className="text-center text-lg">GUESSES</div>
        {settings.isEndless === "0" && (
          <div className="text-center text-lg">DAILY</div>
        )}

        {settings.isEndless === "1" && (
          <button
            onClick={() => {
              const mode = localStorage.getItem("mode");
              const league = localStorage.getItem("league");
              const isEndless = localStorage.getItem("isEndless");
              localStorage.clear();
              localStorage.setItem("initial", "false");
              localStorage.setItem("league", league);
              localStorage.setItem("mode", mode);
              localStorage.setItem("isEndless", isEndless);

              setSettings({
                isEndless: settings.isEndless,
                league: settings.league,
                initial: false,
              });
            }}
            className=" text-yellow-400  sm:hover:bg-purple text-center flex m-auto bg-green-500 p-2 pl-4 pr-4 mt-2 rounded-lg"
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}

function ManageNormalGameMobile({ guessesLeft }) {
  const { settings, setSettings } = useContext(HomeContext);

  return (
    <div className="h-24 sm:h-36 md:h-48 flex justify-center mt-8 sm:hidden text-black">
      <div className="font-freshman">
        <div className="text-center text-4xl">{guessesLeft}</div>
        <div className="text-center text-lg">GUESSES</div>
        {settings.isEndless === "0" && (
          <div className="text-center text-lg">DAILY</div>
        )}

        {settings.isEndless === "1" && (
          <button
            className="flex m-auto bg-green-500 text-yellow-400 sm:hover:bg-purple p-2 pl-4 pr-4 mt-2 rounded-lg"
            onClick={() => {
              const mode = localStorage.getItem("mode");
              const league = localStorage.getItem("league");
              const isEndless = localStorage.getItem("isEndless");
              localStorage.clear();
              localStorage.setItem("initial", "false");
              localStorage.setItem("league", league);
              localStorage.setItem("mode", mode);
              localStorage.setItem("isEndless", isEndless);
              setSettings({
                isEndless: settings.isEndless,
                league: settings.league,
                initial: false,
              });
            }}
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}
