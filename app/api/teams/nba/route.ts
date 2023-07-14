import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "true") {
    var numTeams = Math.floor(Math.random() * (6 - 4 + 1)) + 4;

    const final_grid = getRandom(TEAMS, numTeams).concat(
      getRandom(CRITERIA, 6 - numTeams)
    );

    return NextResponse.json(final_grid);
  } else {
    let yourDate = new Date();

    const teams = await prisma.nBAGrid.findUnique({
      where: {
        day: yourDate,
      },
    });

    if (teams == null) {
      console.log("ERRROR TEAMS NULL");
      return NextResponse.json(getRandom(TEAMS, 6));
    }

    return NextResponse.json([
      teams.a_hint,
      teams.b_hint,
      teams.c_hint,
      teams.one_hint,
      teams.two_hint,
      teams.three_hint,
    ]);
  }
}

function getRandom(arr: String[], n: number) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const TEAMS = [
  "ATL",
  "BOS",
  "BKN",
  "CHA",
  "CHI",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GSW",
  "HOU",
  "IND",
  "LAC",
  "LAL",
  "MEM",
  "MIA",
  "MIL",
  "MIN",
  "NOP",
  "NYK",
  "OKC",
  "ORL",
  "PHL",
  "PHX",
  "POR",
  "SAC",
  "SAS",
  "TOR",
  "UTA",
  "WAS",
];

const CRITERIA = [
  "Guard",
  "Forward",
  "Center",
  "Loyal", // played with only one team
  "All Star",
  "Active",
];
