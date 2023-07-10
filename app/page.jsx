"use client";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, use, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import Example, { HomeContext } from "../components/combobox";

function GridLogo({ width, logo, hidden }) {
  return (
    <div
      className={`flex items-center justify-center ${width} sm:w-36 md:w-40 h-24 sm:h-36 md:h-40`}
    >
      <Image
        src={`/logos/${logo}.png`}
        alt={`Team logo ${logo}`}
        width="120"
        height="120"
        className={`${hidden} ? 'hidden': ""`}
        loading="eager"
        priority="high"
      ></Image>
    </div>
  );
}

function MyModal({ isOpen, setIsOpen, setPlayerSelected, boxId }) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center p-4 text-center mt-16">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" max-w-md rounded-lg align-middle transition-all">
                  <Example
                    setClose={() => {
                      setIsOpen(false);
                    }}
                    setPlayerSelected={setPlayerSelected}
                    boxId={boxId}
                  ></Example>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function GridBox({ boxId }) {
  let [isOpen, setIsOpen] = useState(false);
  let [playerSelected, setPlayerSelected] = useState(null);
  let [loaded, setLoaded] = useState(false);

  const { guessesLeft, setGuessesLeft } = useContext(HomeContext);
  const { reset, setReset } = useContext(HomeContext);

  useEffect(() => {
    let player;
    // Get the value from local storage if it exists
    player = JSON.parse(localStorage.getItem(`playerSelected${boxId}`)) || null;
    setPlayerSelected(player);
  }, [reset]);

  useEffect(() => {
    if (playerSelected) {
      localStorage.setItem(
        `playerSelected${boxId}`,
        JSON.stringify(playerSelected)
      );
      const image = document.createElement("img");
      image.src = playerSelected["profilePic"];
    }
  }, [playerSelected]);

  return (
    <div>
      <MyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setPlayerSelected={setPlayerSelected}
        boxId={boxId}
      ></MyModal>
      <button
        className={`col-1 flex items-center bg- justify-center ${
          playerSelected ? "bg-indigo-900" : "bg-green"
        } hover:bg-indigo-900 disabled: w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40`}
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={guessesLeft <= 0 || playerSelected}
      >
        <div className="relative h-full w-full overflow flex flex-col justify-center items-center">
          <div className="grow mt-4">
            {playerSelected ? (
              <img
                src={playerSelected["profilePic"]}
                className="rounded-md sm:w-[92px] w-[60px]"
                loading="eager"
                onLoad={() => {
                  setLoaded(true);
                }}
                alt="Image of player"
              ></img>
            ) : (
              <></>
            )}
          </div>
          <div className="mb-2  text-[8px] sm:text-base text-yellow-400 ">
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
  let [mode, setMode] = useState("endless");
  let [reset, setReset] = useState(false);

  function resetTeams() {
    setReset(true);
    fetch(`/api/teams?mode=${mode}`)
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
        localStorage.setItem("teams", JSON.stringify(data));
      });
    setGuessesLeft(9);
    localStorage.setItem("guessesLeft", 9);

    for (let i = 0; i <= 8; i++) {
      localStorage.setItem(`playerSelected${i}`, null);
    }
  }

  useEffect(() => {
    // load from local storage -> teams and mode guesses left
    const guessesLeft = localStorage.getItem("guessesLeft") || 9;
    setGuessesLeft(guessesLeft);

    const mode = localStorage.getItem("mode") || "endless";
    setMode(mode);

    const teamsLocalStorage = JSON.parse(localStorage.getItem("teams"));
    if (teamsLocalStorage != "null" && teamsLocalStorage != null) {
      setTeams(teamsLocalStorage);
    }

    if (
      teamsLocalStorage === undefined ||
      teamsLocalStorage === null ||
      teamsLocalStorage.length == 0
    ) {
      fetch(`/api/teams?mode=${mode}`)
        .then((response) => response.json())
        .then((data) => {
          setTeams(data);
          localStorage.setItem("teams", JSON.stringify(data));
        });
    }
  }, []);

  return (
    <main className=" bg-background min-h-screen min-w-max flex items-center justify-center">
      {teams != undefined && teams.length > 0 && (
        <div>
          <div className="absolute font-freshman top-4 left-4 right-4 flex justify-between items-center font-bold text-xl md:text-3xl font-display uppercase tracking-wide text-black">
            <div></div>
            <div className="m-8">IMMACULATE GRIDIRON</div>
            <div></div>
          </div>
          <HomeContext.Provider
            value={{
              guessesLeft: guessesLeft,
              setGuessesLeft: setGuessesLeft,
              teams: teams,
              mode: mode,
              reset: reset,
            }}
          >
            <div>
              <div className="flex mt-10">
                {/* <div className="flex items-center justify-center w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"></div> */}
                <GridLogo width={"w-20"} logo="NFL" hidden={true}></GridLogo>
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
                <div className="grid grid-rows-3 grid-flow-col divide-x divide-y justify-items-center rounded-[30px] overflow-hidden ">
                  {[...Array(9)].map((e, i) => (
                    <GridBox key={i} boxId={i}></GridBox>
                  ))}
                </div>
                <div className="text-black sm:w-36 md:w-40 h-full flex justify-center">
                  <div className="hidden sm:block font-freshman">
                    <div className="text-center text-4xl">{guessesLeft}</div>
                    <div className="text-center text-lg">GUESSES</div>
                    {mode == "endless" && (
                      <button
                        onClick={() => {
                          resetTeams();
                        }}
                        className=" text-yellow-400 hover:bg-indigo-900 text-center flex m-auto bg-green p-2 pl-4 pr-4 rounded-lg"
                      >
                        next
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-24 sm:h-36 md:h-48 flex justify-center mt-8 sm:hidden text-black">
                <div className="font-freshman">
                  <div className="text-center text-4xl">{guessesLeft}</div>
                  <div className="text-center text-lg">GUESSES</div>
                  {mode == "endless" && (
                    <button
                      className="flex m-auto bg-green text-yellow-400 hover:bg-indigo-900 p-2 pl-4 pr-4 rounded-lg"
                      onClick={() => {
                        resetTeams();
                      }}
                    >
                      next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </HomeContext.Provider>
        </div>
      )}
    </main>
  );
}
