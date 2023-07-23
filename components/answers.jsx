import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAppSelector } from "../app/store/hooks";

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

export function AnswersDesktop() {
  const [open, setOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(0);

  return (
    <div>
      <Modal open={open} setOpen={setOpen}>
        <div className="w-[168px]">
          <div className="grid grid-rows-3 grid-flow-col-dense justify-items-center overflow-hidden">
            {[...Array(9)].map((e, i) => (
              <GridBox
                key={i}
                boxId={i}
                playerSelected={PLAYER}
                disabled={false}
                width="w-14 h-14"
                rounded="10"
                setSelectedBox={setSelectedBox}
                color={selectedBox == i}
              ></GridBox>
            ))}
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
      <button
        onClick={() => {
          // end -> fetch answers (array of players with % played, place, rarity score,)
          setOpen(true);
        }}
        className=" text-yellow-400  sm:hover:bg-purple text-center flex m-auto bg-green-500 p-2 pl-4 pr-4 mt-2 rounded-lg"
      >
        end
      </button>
    </div>
  );
}

function GridBox({
  boxId,
  playerSelected,
  disabled,
  width,
  rounded,
  setSelectedBox,
  color,
}) {
  // const playerSelected = useAppSelector((state) => getPlayer(state, boxId));
  const league = useAppSelector((state) => state.league);

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
        className={` transition-colors duration-75 focus-visible:z-50 col-1 flex items-center border-x border-y border-[#fff0e6] justify-center ${isRounded()} ${
          color ? "bg-purple" : "bg-green-500"
        } sm:hover:bg-purple disabled: ${width} `}
        onClick={() => {
          setSelectedBox(boxId);
        }}
        disabled={disabled}
      >
        <div className="relative h-full w-full overflow flex flex-col justify-center items-center ">
          <div className="">
            {playerSelected ? (
              <img
                src={playerSelected["profilePic"]}
                width={12}
                height={12}
                className={`rounded-md ${
                  league == "NBA" ? "w-[42px]" : "w-[38px]"
                }`}
                alt="Image of player"
              ></img>
            ) : (
              <></>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

function Modal({ open, setOpen, children }) {
  //   const [open, setOpen] = useState(true);
  return (
    <Dialog as="div" className="relative z-10" onClose={setOpen} open={open}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

{
  /* <div class="grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-span-3 ...">01</div>
  <div class="col-span-2 ...">02</div>
  <div class="row-span-2 col-span-2 ...">03</div>
</div>; */
}
