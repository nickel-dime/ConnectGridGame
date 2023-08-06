import React, { useEffect, useState } from "react";

import { NormalContext } from "@/components/combobox";
import { BsTwitter, BsLightbulbFill } from "react-icons/bs";

import GridBox from "@/components/grid/gridbox";
import SportLogo from "@/components/grid/sportlogo";
import GridLogo from "@/components/grid/gridlogo";
import {
  ManageNormalGameMobile,
  ManageNormalGameDesktop,
} from "@/components/normal/managegame";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchNBAHintsDaily,
  fetchNBAHintsEndless,
  fetchNFLHintsDaily,
  fetchNFLHintsEndless,
  getAnswers,
  getBoardState,
} from "../store/normalSlice";
import { captureException } from "@sentry/nextjs";

export default function Normal() {
  const dispatch = useAppDispatch();
  const league = useAppSelector((state) => state.league);
  const isEndless = useAppSelector((state) => state.isEndless);

  const { currentHints, playerSelected, guessesLeft } =
    useAppSelector(getBoardState);

  const answers = useAppSelector(getAnswers);

  useEffect(() => {
    var date = localStorage.getItem("date");

    if (date != null) {
      var split_date = date.split(",");
      const today = new Date();

      if (
        !(
          today.getUTCFullYear() == parseInt(split_date[0]) &&
          today.getUTCMonth() == parseInt(split_date[1]) &&
          today.getUTCDate() == parseInt(split_date[2])
        )
      ) {
        dispatch(fetchNFLHintsDaily());
        dispatch(fetchNBAHintsDaily());
        localStorage.setItem(
          "date",
          `${today.getUTCFullYear()}, ${today.getUTCMonth()}, ${today.getUTCDate()}`
        );
      }
      return;
    }

    dispatch(fetchNFLHintsDaily());
    dispatch(fetchNBAHintsDaily());
    dispatch(fetchNBAHintsEndless());
    dispatch(fetchNFLHintsEndless());
    const today = new Date();
    localStorage.setItem(
      "date",
      `${today.getUTCFullYear()}, ${today.getUTCMonth()}, ${today.getUTCDate()}`
    );
  }, []);

  return (
    <div className="grow">
      <div className="">
        <div className="flex mt-6">
          {/* <div className="flex items-center justify-center w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"></div> */}
          <SportLogo
            width={"w-20 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
            imageSize={"sm:w-[96px] w-[64px]"}
            logo={league ? league : null}
            hidden={false}
            league={league ? league : null}
          ></SportLogo>
          <GridLogo
            width={"w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
            logo={currentHints ? currentHints[0] : null}
            imageSize={"sm:w-[96px] w-[64px]"}
          ></GridLogo>
          <GridLogo
            width={"w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
            logo={currentHints ? currentHints[1] : null}
            imageSize={"sm:w-[96px] w-[64px]"}
          ></GridLogo>
          <GridLogo
            width={"w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
            logo={currentHints ? currentHints[2] : null}
            imageSize={"sm:w-[96px] w-[64px]"}
          ></GridLogo>
        </div>
        <div className="flex items-center">
          <div className="items-center">
            <GridLogo
              width={"w-20 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
              logo={currentHints ? currentHints[3] : null}
              imageSize={"sm:w-[96px] w-[64px]"}
            ></GridLogo>
            <GridLogo
              width={"w-20 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
              logo={currentHints ? currentHints[4] : null}
              imageSize={"sm:w-[96px] w-[64px]"}
            ></GridLogo>
            <GridLogo
              width={"w-20 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"}
              logo={currentHints ? currentHints[5] : null}
              imageSize={"sm:w-[96px] w-[64px]"}
            ></GridLogo>
          </div>
          <div className="grid grid-rows-3 grid-flow-col justify-items-center overflow-hidden mr-5">
            {[...Array(9)].map((e, i) => (
              <GridBox
                key={i}
                boxId={i}
                playerSelected={playerSelected ? playerSelected[i] : null}
                disabled={guessesLeft <= 0 || (answers != null && !isEndless)}
              ></GridBox>
            ))}
          </div>
          <ManageNormalGameDesktop></ManageNormalGameDesktop>
        </div>
        <ManageNormalGameMobile></ManageNormalGameMobile>
      </div>
    </div>
  );
}
