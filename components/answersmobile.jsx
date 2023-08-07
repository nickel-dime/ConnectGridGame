import { Dialog, Transition } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { Fragment, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Skeleton from "react-loading-skeleton";

import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import {
  fetchNBAHintsEndless,
  fetchNFLHintsEndless,
  getAnswers,
  getBoardState,
  reset,
  updateSettings,
  addAnswers,
} from "@/app/store/normalSlice";
import SportLogo from "./grid/sportlogo";
import GridLogo from "./grid/gridlogo";
import axios from "axios";
import { captureException } from "@sentry/nextjs";
import "react-loading-skeleton/dist/skeleton.css";
import { store } from "@/app/store/store";

export function AnswersMobile({ open, setOpen }) {
  const [selectedBox, setSelectedBox] = useState(0);

  const [dailyStats, setDailyStats] = useState(null);
  const [boxAnswers, setBoxAnswers] = useState(null);
  const { guessesLeft, currentHints, playerSelected } =
    useAppSelector(getBoardState);

  const league = useAppSelector((state) => state.league);
  const isEndless = useAppSelector((state) => state.isEndless);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const answers = useAppSelector(getAnswers);

  useEffect(() => {
    if (currentHints == []) {
      return;
    }
    if (!isEndless && answers != null) {
      setBoxAnswers(answers["boxData"]);
      setDailyStats(answers["daily"]);
      setLoading(false);
      return;
    }

    axios
      .post(`api/answers/${league.toLowerCase()}`, {
        isEndless: isEndless,
        currentHints: currentHints,
        playerSelected: playerSelected,
      })
      .then(function (response) {
        const data = response.data;
        setDailyStats(data["daily"]);
        setBoxAnswers(data["boxData"]);
        if (!isEndless) {
          dispatch(
            addAnswers({
              answers: data,
            })
          );
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        captureException(error);
        alert("Unknown Error - Please have patience :)");
        setOpen(false);
      });
  }, []);

  return (
    <div>
      <Modal open={open} setOpen={setOpen}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between gap-3">
            <div className="grid grid-rows-3 grid-cols-3 aspect-square">
              {[...Array(9)].map((e, i) => (
                <GridBox
                  key={i}
                  boxId={i}
                  rounded={20}
                  color={selectedBox == i}
                ></GridBox>
              ))}
            </div>
          </div>
          <div>
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              wrapperClass="mb-8"
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={(swiper) => setSelectedBox(swiper.activeIndex)}
              className=" h-72"
            >
              {[...Array(9)].map((e, i) => (
                <SwiperSlide key={i}>
                  <div className="">
                    <Table
                      boxAnswers={boxAnswers ? boxAnswers[selectedBox] : []}
                      isEndless={isEndless}
                    ></Table>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="relative flex flex-row py-4 basis-0 justify-evenly text-center rounded-md bg-white shadow-md divide-x-2">
            <div className="flex-1  ">
              {loading ? (
                <Skeleton width={50}></Skeleton>
              ) : (
                <div
                  className={`font-semibold text-xl ${
                    dailyStats["place"] < 100
                      ? " text-green-500"
                      : dailyStats["place"] < 500
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
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
                <div
                  className={`font-semibold text-xl ${
                    dailyStats["rarity"] > 80
                      ? " text-green-500"
                      : dailyStats["rarity"] > 50
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
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
                <div
                  className={`font-semibold text-xl ${
                    dailyStats["average_score"] > 7
                      ? " text-green-500"
                      : dailyStats["place"] > 5
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {dailyStats["average_score"]}
                </div>
              )}
              <div className=" text-gray-500 text-[10px] font-semibold">
                AVG SCORE
              </div>
            </div>
          </div>
          <div className="gap-2 flex text-center">
            <a
              type="button"
              className="font-freshman w-full justify-center py-2 rounded-md bg-[#1DA1F2] hover:bg-[#1780C2] px-3 text-sm text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DA1F2]"
              href="https://www.x.com"
            >
              tweet
            </a>
            <button
              type="button"
              className="font-freshman inline-flex w-full py-2 justify-center rounded-md bg-green-500 px-3  text-sm text-yellow-400 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              onClick={() => {
                // if (isEndless) {
                //   dispatch(reset());
                //   if (league == "NFL") {
                //     dispatch(fetchNFLHintsEndless());
                //   } else if (league == "NBA") {
                //     dispatch(fetchNBAHintsEndless());
                //   }
                // } else {
                //   dispatch(
                //     updateSettings({
                //       league: null,
                //       isEndless: true,
                //     })
                //   );
                // }

                setOpen(false);
              }}
            >
              {true ? "play" : "play endless"}
            </button>
            <button
              type="button"
              className="inline-flex w-full justify-center py-2 rounded-md bg-green-500 px-3 text-sm text-yellow-400 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 font-freshman"
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

function GridBox({ rounded, color, boxId }) {
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
    <button
      className={`h-[10px] w-[10px] rounded-sm m-[0.5px] ${
        color ? "bg-purple" : "bg-green-500"
      } `}
    >
      <div className=""></div>
    </button>
  );
}

function Table({ boxAnswers, isEndless }) {
  return (
    <div className=" bg-white rounded-md shadow-md">
      <div className="inline-block py-2 align-middle w-full">
        <table
          className={`divide-y divide-gray-300 block overflow-auto table-auto box-content`}
        >
          <thead className="">
            <tr className="">
              <th
                scope="col"
                className="text-left text-sm font-semibold py-4 pl-4 pr-8 text-gray-900"
              >
                Name
              </th>
              <th
                scope="col"
                className="text-left text-sm py-4 pl-8 font-semibold w-44  text-gray-900"
              >
                % Guessed
              </th>
            </tr>
          </thead>
          {boxAnswers && boxAnswers["answers"] ? (
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
                  <td className={` whitespace-nowrap pl-4 text-sm rounded-md`}>
                    <div className="flex items-center py-4">
                      <div className=" h-8 w-8 flex-shrink-0">
                        {person.profilePic && (
                          <img
                            className="flex self-center h-[32px] w-[32px] rounded-full object-cover object-top"
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
                        <div className="text-sm text-gray-500">
                          {person.yearStart} - {person.yearEnd}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 text-sm pl-8 ">
                    <div className="text-gray-900">{person.percentGuessed}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr className="p-4">
                <td className=" pb-5 pl-4 pr-4 ">
                  {" "}
                  <Skeleton count={20} className="h-10 mt-2"></Skeleton>
                </td>
                <td className="text-center pb-5 font-inter">
                  <Skeleton count={20} className="h-10 mt-2"></Skeleton>
                </td>
                <td className="pr-6 pl-4 pb-5">
                  {" "}
                  <Skeleton count={20} className="h-10 mt-2"></Skeleton>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
