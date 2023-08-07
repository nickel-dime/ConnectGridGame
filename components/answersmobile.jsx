import { Dialog, Transition } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { Fragment, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Skeleton from "react-loading-skeleton";

export function AnswersMobile({ open, setOpen }) {
  const [selectedBox, setSelectedBox] = useState(0);

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
            {/* <div className="relative flex flex-1 flex-row  basis-0 justify-evenly text-center rounded-md bg-white shadow-md divide-x-2">
              <div className="flex-1  ">
                {false ? (
                  <Skeleton width={50}></Skeleton>
                ) : (
                  <div
                    className={`font-semibold text-md ${
                      2 < 100
                        ? " text-green-500"
                        : 2 < 500
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    2
                  </div>
                )}
                <div className=" text-gray-500 text-[10px] font-semibold">
                  PLACE
                </div>
              </div>
              <div className=" flex-1  ">
                {false ? (
                  <Skeleton width={50}></Skeleton>
                ) : (
                  <div
                    className={`font-semibold text-md ${
                      10 > 80
                        ? " text-green-500"
                        : 10 > 50
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {10}
                  </div>
                )}
                <div className=" text-gray-500 text-[10px] font-semibold">
                  RARITY
                </div>
              </div>
              <div className=" flex-1 ">
                {false ? (
                  <Skeleton width={50}></Skeleton>
                ) : (
                  <div
                    className={`font-semibold text-md ${
                      6 > 7
                        ? " text-green-500"
                        : 6 > 5
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    6
                  </div>
                )}
                <div className=" text-gray-500 text-[10px] font-semibold">
                  AVG SCORE
                </div>
              </div>
            </div> */}
          </div>
          <div>
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true, dynamicBullets: true }}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={(swiper) => setSelectedBox(swiper.activeIndex)}
              className=" h-72"
            >
              {[...Array(9)].map((e, i) => (
                <SwiperSlide key={i}>Slide {i}</SwiperSlide>
              ))}
            </Swiper>
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
