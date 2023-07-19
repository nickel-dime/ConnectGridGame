"use client";
import React, { useEffect, useState } from "react";

import { HomeContext } from "../components/combobox";
import { BsTwitter, BsLightbulbFill } from "react-icons/bs";

import Setting from "../components/settings";
import GridBox from "../components/grid/gridbox";
import SportLogo from "../components/grid/sportlogo";
import GridLogo from "../components/grid/gridlogo";
import Help from "../components/help";
import {
  ManageNormalGameMobile,
  ManageNormalGameDesktop,
} from "../components/normal/managegame";

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
    if (hints == null || !settings.initial || settings.isEndless == "0") {
      if (settings.mode == null) {
        settings.mode = "normal";
      }
      fetch(
        `/api/hints/${settings.league.toLowerCase()}/${
          settings.mode
        }?isEndless=${settings.isEndless}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (JSON.stringify(data) != hints) {
            // setClear(!clear);
            for (let i = 0; i <= 8; i++) {
              localStorage.setItem(
                `${settings.league}playerSelected${i}`,
                null
              );
              localStorage.setItem(
                `${settings.league}previousGuesses${i}`,
                "[]"
              );
            }
          }
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
