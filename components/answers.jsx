import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import {
  fetchNBAHintsEndless,
  fetchNFLHintsEndless,
  getBoardState,
  updateSettings,
} from "@/app/store/normalSlice";
import SportLogo from "./grid/sportlogo";
import GridLogo from "./grid/gridlogo";
import axios from "axios";
import { captureException } from "@sentry/nextjs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PLAYER = {
  firstName: "Jalen",
  lastName: "Hurts",
  yearStart: "2020",
  yearEnd: "2023",
  position: "QB",
  id: 10987,
  profilePic: "https://cdn.footballdb.com/headshots/NFL/2022/hurtsja01.jpg",
  found: 1,
};

// currentHints, isEndless, playersGuessed ->

const SAMPLE = {
  boxData: {
    0: {
      playerGuessed: {
        // player stuff + guess percenage
      },
      answers: [
        {
          // player stuff + guess percentage
        },
      ],
    },
    1: {
      playerGuessed: {
        // player stuff + guess percenage
      },
      answers: [
        {
          // player stuff + guess percentage
        },
      ],
    },
  },
  daily: {
    place: 123,
    rarity: 4.53,
    average_score: 6.2,
  },
};

export function AnswersDesktop({ open, setOpen, setDisabled }) {
  const [selectedBox, setSelectedBox] = useState(0);

  const [dailyStats, setDailyStats] = useState(null);
  const [boxAnswers, setBoxAnswers] = useState(null);

  const { guessesLeft, currentHints, playerSelected } =
    useAppSelector(getBoardState);
  const league = useAppSelector((state) => state.league);
  const isEndless = useAppSelector((state) => state.isEndless);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentHints == []) {
      return;
    }

    axios
      .post("api/answers", {
        league: league,
        isEndless: isEndless,
        currentHints: currentHints,
        playerSelected: playerSelected,
      })
      .then(function (response) {
        const data = response.data;
        setDailyStats(data["daily"]);
        setBoxAnswers(data["boxData"]);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        captureException(error);
      });
  }, []);

  return (
    <div className="">
      <Modal open={open} setOpen={setOpen}>
        <Dialog.Title as="h1" className={`font-bold text-2xl pl-1`}>
          Answers
        </Dialog.Title>

        <div className="flex flex-row gap-6 mt-4">
          <Table
            boxAnswers={boxAnswers ? boxAnswers[selectedBox] : []}
            isEndless={isEndless}
          ></Table>
          <div className="flex flex-col gap-4">
            <div
              className={`relative overflow-hidden rounded-md pl-6 shadow-md py-3 ${
                boxAnswers && boxAnswers[selectedBox]["playerGuessed"] == null
                  ? ""
                  : "pl-6 gap-4"
              } flex self-stretch bg-white`}
            >
              {loading ? (
                <Skeleton
                  circle="true"
                  containerClassName="h-[40px] w-[40px] leading-none"
                  height="100%"
                ></Skeleton>
              ) : boxAnswers[selectedBox]["playerGuessed"] == null ? (
                <div></div>
              ) : (
                <img
                  src={boxAnswers[selectedBox]["playerGuessed"]["profilePic"]}
                  alt="Image of player"
                  fetchPriority="high"
                  className="flex self-center h-[40px] w-[40px] rounded-full overflow-hidden object-cover object-top"
                ></img>
              )}
              <div
                className={`flex flex-col text-sm flex-1 ${
                  boxAnswers && boxAnswers[selectedBox]["playerGuessed"] == null
                    ? "h-[44px]"
                    : ""
                }`}
              >
                {loading ? (
                  <Skeleton containerClassName="flex-1 text-center pr-44"></Skeleton>
                ) : boxAnswers[selectedBox]["playerGuessed"] == null ? (
                  <div className="text-xl flex-1 flex justify-center items-center font-medium">
                    No Player Guessed
                  </div>
                ) : (
                  <div className="font-semibold text-xl">{`${boxAnswers[selectedBox]["playerGuessed"]["firstName"]} ${boxAnswers[selectedBox]["playerGuessed"]["lastName"]}`}</div>
                )}
                {loading ? (
                  <Skeleton containerClassName="pr-40"></Skeleton>
                ) : boxAnswers[selectedBox]["playerGuessed"] == null ? (
                  <div></div>
                ) : (
                  <div className=" text-gray-500 text-xs font-semibold">
                    {boxAnswers[selectedBox]["playerGuessed"]["percentGuessed"]}
                    % Guessed
                  </div>
                )}
              </div>
            </div>
            {!isEndless && (
              <div className="relative flex flex-row py-4 basis-0 justify-evenly text-center rounded-md bg-white shadow-md divide-x-2">
                <div className="flex-1  ">
                  {loading ? (
                    <Skeleton width={50}></Skeleton>
                  ) : (
                    <div className=" font-semibold text-xl">
                      {dailyStats["place"]}
                    </div>
                  )}
                  <div className=" text-gray-500 text-[10px] font-semibold">
                    PLACE
                  </div>
                </div>
                <div className=" flex-1  ">
                  {loading ? (
                    <Skeleton width={50}></Skeleton>
                  ) : (
                    <div className=" font-semibold text-xl">
                      {dailyStats["rarity"]}
                    </div>
                  )}
                  <div className=" text-gray-500 text-[10px] font-semibold">
                    RARITY
                  </div>
                </div>
                <div className=" flex-1 ">
                  {loading ? (
                    <Skeleton width={50}></Skeleton>
                  ) : (
                    <div className=" font-semibold text-xl">
                      {dailyStats["average_score"]}
                    </div>
                  )}
                  <div className=" text-gray-500 text-[10px] font-semibold">
                    AVG SCORE
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white shadow-md p-4 rounded-md">
              <div className="flex">
                <SportLogo
                  width={"w-[80px] h-[80px]"}
                  imageSize={"w-[60px]"}
                  logo={league ? league : null}
                  hidden={false}
                  league={league ? league : null}
                ></SportLogo>
                <GridLogo
                  width={"w-[80px] h-[80px]"}
                  logo={currentHints ? currentHints[0] : null}
                  imageSize={"w-[60px]"}
                ></GridLogo>
                <GridLogo
                  width={"w-[80px] h-[80px]"}
                  logo={currentHints ? currentHints[1] : null}
                  imageSize={"w-[60px]"}
                ></GridLogo>
                <GridLogo
                  width={"w-[80px] h-[80px]"}
                  logo={currentHints ? currentHints[2] : null}
                  imageSize={"w-[60px]"}
                ></GridLogo>
              </div>
              <div className="flex">
                <div className="">
                  <GridLogo
                    width={"h-[80px] w-[80px]"}
                    logo={currentHints ? currentHints[3] : null}
                    imageSize={"w-[60px]"}
                  ></GridLogo>
                  <GridLogo
                    width={"h-[80px] w-[80px]"}
                    logo={currentHints ? currentHints[4] : null}
                    imageSize={"w-[60px]"}
                  ></GridLogo>
                  <GridLogo
                    width={"h-[80px] w-[80px]"}
                    logo={currentHints ? currentHints[5] : null}
                    imageSize={"w-[60px]"}
                  ></GridLogo>
                </div>
                <div className="grid grid-rows-3 grid-cols-3 overflow-hidden">
                  {[...Array(9)].map((e, i) => (
                    <GridBox
                      key={i}
                      boxId={i}
                      disabled={false}
                      width="w-[80px] h-[80px]"
                      rounded="100"
                      setSelectedBox={setSelectedBox}
                      color={selectedBox == i}
                    ></GridBox>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 font-freshman">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-[#1DA1F2] hover:bg-[#1780C2] px-3 py-2 text-sm text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DA1F2]"
                onClick={() => setOpen(false)}
              >
                tweet
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm text-yellow-400 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                onClick={() => {
                  dispatch(
                    updateSettings({
                      league: null,
                      isEndless: true,
                    })
                  );

                  if (league == "NFL") {
                    dispatch(fetchNFLHintsEndless());
                  } else if (league == "NBA") {
                    dispatch(fetchNBAHintsEndless());
                  }
                  setOpen(false);
                  setDisabled(false);
                }}
              >
                {isEndless ? "play again" : "play endless"}
              </button>
            </div>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm text-yellow-400 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 font-freshman"
              onClick={() => setOpen(false)}
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function GridBox({ boxId, disabled, width, rounded, setSelectedBox, color }) {
  function isRounded() {
    if (boxId == 0) {
      return `rounded-tl-[${rounded}px]`;
    } else if (boxId == 2) {
      return `rounded-bl-[${rounded}px]`;
    } else if (boxId == 6) {
      return `rounded-tr-[${rounded}px]`;
    } else if (boxId == 8) {
      return `rounded-br-[${rounded}px]`;
    }
  }

  return (
    <div>
      <button
        className={`transition-colors duration-75 focus-visible:z-50 col-1 flex items-center border-x border-y border-[#fff0e6] justify-center ${isRounded()} rounded-md ${
          color ? "bg-purple" : "bg-green-500"
        } sm:hover:bg-purple ${width} `}
        onClick={() => {
          setSelectedBox(boxId);
        }}
        disabled={disabled}
      >
        <div className="relative h-full w-full overflow flex  justify-center items-center "></div>
      </button>
    </div>
  );
}

function Modal({ open, setOpen, children }) {
  //   const [open, setOpen] = useState(true);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-md transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#F7F7F7] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function Table({ boxAnswers, isEndless }) {
  useEffect(() => {
    console.log(boxAnswers);
  }, [boxAnswers]);
  return (
    <div className=" bg-white rounded-md shadow-md">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table
            className={`min-w-full divide-y divide-gray-300 overflow-auto ${
              isEndless ? "max-h-[536px]" : "max-h-[615px]"
            } block table-fixed`}
          >
            <thead className="">
              <tr className="">
                <th
                  scope="col"
                  className="py-3.5 pl-4 w-[281px] text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="py-3.5 text-left w-[108px] text-sm font-semibold text-gray-900"
                >
                  % Guessed
                </th>
                <th
                  scope="col"
                  className="pr-6 pl-4 py-3.5 w-[142px] text-left text-sm font-semibold text-gray-900"
                >
                  Years Played
                </th>
              </tr>
            </thead>
            {boxAnswers &&
            boxAnswers["answers"] &&
            boxAnswers["answers"].length > 0 ? (
              <tbody className="divide-y divide-gray-200">
                {boxAnswers["answers"].map((person) => (
                  <tr
                    key={person.id}
                    className={`${
                      boxAnswers["playerGuessed"] &&
                      person.id == boxAnswers["playerGuessed"]["id"]
                        ? "  bg-emerald-50"
                        : ""
                    }`}
                  >
                    <td
                      className={`whitespace-nowrap pb-5 pl-4 text-sm rounded-md w-[281px]`}
                    >
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          {person.profilePic && (
                            <img
                              className="flex self-center h-[40px] w-[40px] rounded-full object-cover object-top"
                              src={person.profilePic}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          {person.link ? (
                            <a
                              className="font-medium text-blue-500"
                              href={person.link}
                            >
                              {person.firstName} {person.lastName}
                            </a>
                          ) : (
                            <div className="font-medium text-gray-900">
                              {person.firstName} {person.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap pb-5 text-sm  w-[108px]">
                      <div className="text-gray-900">
                        {person.percentGuessed}
                      </div>
                    </td>
                    {person.yearStart && (
                      <td className="whitespace-nowrap pl-4 pb-5 text-sm w-[142px]">
                        {person.yearStart} - {person.yearEnd}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr className="p-4">
                  <td className=" pb-5 pl-4 pr-4 ">
                    {" "}
                    <Skeleton count={20} className="h-6 mt-2"></Skeleton>
                  </td>
                  <td className="text-center pb-5 font-inter">
                    <Skeleton count={20} className="h-6 mt-2"></Skeleton>
                  </td>
                  <td className="pr-6 pl-4 pb-5">
                    {" "}
                    <Skeleton count={20} className="h-6 mt-2"></Skeleton>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
