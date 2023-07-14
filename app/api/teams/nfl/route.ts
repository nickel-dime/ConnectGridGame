import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "true") {
    return NextResponse.json(getRandom(TEAMS, 6));
  } else {
    let yourDate = new Date();

    const teams = await prisma.nFLGrid.findUnique({
      where: {
        day: yourDate,
      },
    });


    if (teams == null) {
      console.log("ERRROR TEAMS NULL")
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
