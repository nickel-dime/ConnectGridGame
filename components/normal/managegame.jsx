"use client";
import { HomeContext } from "../combobox";
import { useContext } from "react";

export function ManageNormalGameDesktop({ guessesLeft }) {
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
              if (league) {
                localStorage.setItem("league", league);
              }
              if (mode) {
                localStorage.setItem("mode", mode);
              }
              if (isEndless) {
                localStorage.setItem("isEndless", isEndless);
              }

              setSettings({
                isEndless: settings.isEndless,
                league: settings.league,
                initial: false,
                mode: mode,
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

export function ManageNormalGameMobile({ guessesLeft }) {
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
              if (league) {
                localStorage.setItem("league", league);
              }
              if (mode) {
                localStorage.setItem("mode", mode);
              }
              if (isEndless) {
                localStorage.setItem("isEndless", isEndless);
              }
              setSettings({
                isEndless: settings.isEndless,
                league: settings.league,
                initial: false,
                mode: mode,
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
