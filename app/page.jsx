"use client";
import React, { useEffect, useState } from "react";
import { BsTwitter, BsLightbulbFill } from "react-icons/bs";
import Setting from "../components/settings";
import Help from "../components/help";
import Normal from "./pages/normal";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("normal");

  useEffect(() => {
    const localMode = localStorage.getItem("mode") || "normal";
    setMode(localMode);
  }, []);

  return (
    <main className="  bg-background min-h-screen min-w-max flex justify-center">
      <div className="flex flex-col">
        <div className="">
          <div className="p-4 mt-1 sm:mt-5 font-freshman justify-between flex font-bold text-xl md:text-3xl font-display uppercase tracking-wide text-black">
            <div>CONNECT</div>
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
              <Setting mode={mode} setMode={setMode}></Setting>
              {/* )} */}
            </div>
          </div>
        </div>
        <Normal loading={loading}></Normal>
        {/* {loading && <Loading></Loading>} */}
      </div>
    </main>
  );
}
