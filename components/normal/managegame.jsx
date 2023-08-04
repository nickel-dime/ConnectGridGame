"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchNFLHintsEndless,
  fetchNBAHintsEndless,
  loaded,
  reset,
  getBoardState,
} from "@/app/store/normalSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { AnswersDesktop } from "../answers";
import { useState } from "react";

export function ManageNormalGameDesktop({ disabled, setDisabled }) {
  const isLoaded = useAppSelector(loaded);
  const isEndless = useAppSelector((state) => state.isEndless);
  const league = useAppSelector((state) => state.league);

  const { guessesLeft } = useAppSelector(getBoardState);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  return (
    <div className=" text-black h-full flex justify-center">
      {!isLoaded ? (
        <Skeleton
          containerClassName="w-[88px] h-[96px]"
          height="100%"
        ></Skeleton>
      ) : (
        <div className="hidden sm:block font-freshman">
          <div className="text-center text-4xl">{guessesLeft}</div>
          <div className="text-center text-lg">GUESSES</div>
          <div>
            {!isEndless && (
              <button
                onClick={() => {
                  setOpen(true);
                  setTimeout(() => {
                    setDisabled(true);
                  }, 500);
                }}
                className=" text-yellow-400  sm:hover:bg-purple text-center flex m-auto bg-green-500 p-2 pl-4 pr-4 mt-2 rounded-lg"
              >
                {disabled ? "answers" : "end"}
              </button>
            )}

            {isEndless && (
              <button
                onClick={() => {
                  setOpen(true);
                  setTimeout(() => {
                    dispatch(reset());

                    // if (league == "NFL") {
                    //   dispatch(fetchNFLHintsEndless());
                    // } else if (league == "NBA") {
                    //   dispatch(fetchNBAHintsEndless());
                    // }
                    setDisabled(true);
                  }, 500);
                }}
                className=" text-yellow-400  sm:hover:bg-purple text-center flex m-auto bg-green-500 p-2 pl-4 pr-4 mt-2 rounded-lg"
              >
                {disabled ? "answers" : "end"}
              </button>
            )}
          </div>
          <AnswersDesktop
            open={open}
            setOpen={setOpen}
            setDisabled={setDisabled}
          ></AnswersDesktop>
        </div>
      )}
    </div>
  );
}

export function ManageNormalGameMobile() {
  const isLoaded = useAppSelector(loaded);
  const isEndless = useAppSelector((state) => state.isEndless);
  const league = useAppSelector((state) => state.league);

  const { guessesLeft } = useAppSelector(getBoardState);
  const dispatch = useAppDispatch();

  return (
    <div className="h-24 sm:h-36 md:h-48 flex justify-center mt-8 sm:hidden text-black">
      {!guessesLeft || !isLoaded ? (
        <Skeleton></Skeleton>
      ) : (
        <div className="font-freshman">
          <div className="text-center text-4xl">{guessesLeft}</div>
          <div className="text-center text-lg">GUESSES</div>
          {!isEndless && <div className="text-center text-lg">DAILY</div>}

          {isEndless && (
            <button
              className="flex m-auto bg-green-500 text-yellow-400 sm:hover:bg-purple p-2 pl-4 pr-4 mt-2 rounded-lg"
              onClick={() => {
                dispatch(reset());

                if (league == "NFL") {
                  dispatch(fetchNFLHintsEndless());
                } else if (league == "NBA") {
                  dispatch(fetchNBAHintsEndless());
                }
              }}
            >
              reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
