import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "true") {
    return NextResponse.json(getRandom(TEAMS, 6));
  } else {
    let yourDate = new Date();
    yourDate.toISOString().split("T")[0];
    const teams = await prisma.grid.findUniqueOrThrow({
      where: {
        day: yourDate,
      },
    });
    return NextResponse.json([
      teams.a_team,
      teams.b_team,
      teams.c_team,
      teams.one_team,
      teams.two_team,
      teams.three_team,
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
  "MIA",
  "HOU",
  "BAL",
  "JAX",
  "CAR",
  "TB",
  "SEA",
  "CIN",
  "NO",
  "ATL",
  "MIN",
  "BUF",
  "TEN",
  "LV",
  "NE",
  "NYJ",
  "DEN",
  "LAC",
  "KC",
  "DAL",
  "IND",
  "CLE",
  "SF",
  "LA",
  "PIT",
  "PHI",
  "WAS",
  "DET",
  "NYG",
  "GB",
  "CHI",
  "ARI",
];
