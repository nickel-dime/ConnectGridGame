import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  //   const currentUser = await getCurrentUser();

  //   if (!currentUser) {
  //     return console.log("Hi");
  //   }

  //   const body = await request.json();
  //   const { name, description, imageSrc } = body;

  //   //   Object.keys(body).forEach((value: any) => {
  //   //     if (!body[value]) {
  //   //       NextResponse.error();
  //   //     }
  //   //   });

  //   const listing = await prisma.listing.create({
  //     data: {
  //       name,
  //       imageSrc,
  //       description,
  //       userId: currentUser.id,
  //       //   userId: currentUser.id
  //     },
  //   });
  var url = new URL(request.url);
  var mode = url.searchParams.get("mode");

  if (mode == "endless") {
    console.log("WE IN ENDLESS MODE BYATCH")
    return NextResponse.json(getRandom(TEAMS, 6));
  } else {
    // pull from db 
    return NextResponse.error()
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
