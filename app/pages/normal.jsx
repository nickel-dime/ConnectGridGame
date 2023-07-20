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
  boardStateSelector,
  fetchNBAHintsDaily,
  fetchNFLHintsDaily,
} from "../store/normalSlice";

export default function Normal() {
  const dispatch = useAppDispatch();
  const { currentHints } = useAppSelector((state) => state.currentHints);
  const league = useAppSelector((state) => state.league);

  useEffect(() => { 
    dispatch(fetchNBAHintsDaily());
    dispatch(fetchNFLHintsDaily());
  }, []);

  return (
    <div>
      <div className="flex mt-6">
        {/* <div className="flex items-center justify-center w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40"></div> */}
        <SportLogo
          width={"w-20"}
          logo={league ? league : null}
          hidden={true}
          league={league ? league : null}
        ></SportLogo>
        <GridLogo
          width={"w-24"}
          logo={currentHints ? currentHints[0] : null}
        ></GridLogo>
        <GridLogo
          width={"w-24"}
          logo={currentHints ? currentHints[1] : null}
        ></GridLogo>
        <GridLogo
          width={"w-24"}
          logo={currentHints ? currentHints[2] : null}
        ></GridLogo>
      </div>
      <div className="flex items-center">
        <div className="items-center">
          <GridLogo
            width={"w-20"}
            logo={currentHints ? currentHints[3] : null}
          ></GridLogo>
          <GridLogo
            width={"w-20"}
            logo={currentHints ? currentHints[4] : null}
          ></GridLogo>
          <GridLogo
            width={"w-20"}
            logo={currentHints ? currentHints[5] : null}
          ></GridLogo>
        </div>
        <div className="grid grid-rows-3 grid-flow-col justify-items-center overflow-hidden mr-5">
          {[...Array(9)].map((e, i) => (
            <GridBox key={i} boxId={i}></GridBox>
          ))}
        </div>
        <ManageNormalGameDesktop></ManageNormalGameDesktop>
      </div>
      <ManageNormalGameMobile></ManageNormalGameMobile>
    </div>
  );
}
