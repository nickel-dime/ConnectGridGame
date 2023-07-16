import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "1") {
    return NextResponse.json(getRandom(TEAMS, 6));
  } else {
    let yourDate = new Date();

    const hints = await prisma.nFLGrid.findUnique({
      where: {
        day: yourDate,
      },
      include: {
        a_hint: true,
        b_hint: true,
        c_hint: true,
        one_hint: true,
        two_hint: true,
        three_hint: true,
      },
    });

    if (hints == null) {
      console.log("ERRROR TEAMS NULL");
      return NextResponse.json(getRandom(TEAMS, 6));
    }

    return NextResponse.json([
      hints.a_hint,
      hints.b_hint,
      hints.c_hint,
      hints.one_hint,
      hints.two_hint,
      hints.three_hint,
    ]);
  }
}

function getRandom(arr: Object[], n: number) {
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
  {
    category: "teams",
    value: "MIA",
    description: "",
  },
  {
    category: "teams",
    value: "HOU",
    description: "",
  },
  {
    category: "teams",
    value: "BAL",
    description: "",
  },
  {
    category: "teams",
    value: "JAX",
    description: "",
  },
  {
    category: "teams",
    value: "CAR",
    description: "",
  },
  {
    category: "teams",
    value: "TB",
    description: "",
  },
  {
    category: "teams",
    value: "SEA",
    description: "",
  },
  {
    category: "teams",
    value: "CIN",
    description: "",
  },
  {
    category: "teams",
    value: "NO",
    description: "",
  },
  {
    category: "teams",
    value: "ATL",
    description: "",
  },
  {
    category: "teams",
    value: "MIN",
    description: "",
  },
  {
    category: "teams",
    value: "BUF",
    description: "",
  },
  {
    category: "teams",
    value: "TEN",
    description: "",
  },
  {
    category: "teams",
    value: "LV",
    description: "",
  },
  {
    category: "teams",
    value: "NE",
    description: "",
  },
  {
    category: "teams",
    value: "NYJ",
    description: "",
  },
  {
    category: "teams",
    value: "DEN",
    description: "",
  },
  {
    category: "teams",
    value: "LAC",
    description: "",
  },
  {
    category: "teams",
    value: "KC",
    description: "",
  },
  {
    category: "teams",
    value: "DAL",
    description: "",
  },
  {
    category: "teams",
    value: "IND",
    description: "",
  },
  {
    category: "teams",
    value: "CLE",
    description: "",
  },
  {
    category: "teams",
    value: "SF",
    description: "",
  },
  {
    category: "teams",
    value: "LA",
    description: "",
  },
  {
    category: "teams",
    value: "PIT",
    description: "",
  },
  {
    category: "teams",
    value: "PHI",
    description: "",
  },
  {
    category: "teams",
    value: "WAS",
    description: "",
  },
  {
    category: "teams",
    value: "DET",
    description: "",
  },
  {
    category: "teams",
    value: "NYG",
    description: "",
  },
  {
    category: "teams",
    value: "GB",
    description: "",
  },
  {
    category: "teams",
    value: "CHI",
    description: "",
  },
  {
    category: "teams",
    value: "ARI",
    description: "",
  },
];
