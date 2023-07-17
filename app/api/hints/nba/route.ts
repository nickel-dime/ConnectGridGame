import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "1") {
    var numTeams = Math.floor(Math.random() * (6 - 4 + 1)) + 4;

    const final_grid = getRandom(TEAMS, numTeams).concat(
      getRandom(CRITERIA, 6 - numTeams)
    );

    return NextResponse.json(final_grid);
  } else {
    let yourDate = new Date();

    const hints = await prisma.nBAGrid.findUnique({
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
    value: "ATL",
    description: "",
  },
  {
    category: "teams",
    value: "BOS",
    description: "",
  },
  {
    category: "teams",
    value: "BKN",
    description: "",
  },
  {
    category: "teams",
    value: "CHA",
    description: "",
  },
  {
    category: "teams",
    value: "CHI",
    description: "",
  },
  {
    category: "teams",
    value: "CLE",
    description: "",
  },
  {
    category: "teams",
    value: "DAL",
    description: "",
  },
  {
    category: "teams",
    value: "DEN",
    description: "",
  },
  {
    category: "teams",
    value: "DET",
    description: "",
  },
  {
    category: "teams",
    value: "GSW",
    description: "",
  },
  {
    category: "teams",
    value: "HOU",
    description: "",
  },
  {
    category: "teams",
    value: "IND",
    description: "",
  },
  {
    category: "teams",
    value: "LAC",
    description: "",
  },
  {
    category: "teams",
    value: "LAL",
    description: "",
  },
  {
    category: "teams",
    value: "MEM",
    description: "",
  },
  {
    category: "teams",
    value: "MIA",
    description: "",
  },
  {
    category: "teams",
    value: "MIL",
    description: "",
  },
  {
    category: "teams",
    value: "MIN",
    description: "",
  },
  {
    category: "teams",
    value: "NOP",
    description: "",
  },
  {
    category: "teams",
    value: "NYK",
    description: "",
  },
  {
    category: "teams",
    value: "OKC",
    description: "",
  },
  {
    category: "teams",
    value: "ORL",
    description: "",
  },
  {
    category: "teams",
    value: "PHL",
    description: "",
  },
  {
    category: "teams",
    value: "PHX",
    description: "",
  },
  {
    category: "teams",
    value: "POR",
    description: "",
  },
  {
    category: "teams",
    value: "SAC",
    description: "",
  },
  {
    category: "teams",
    value: "SAS",
    description: "",
  },
  {
    category: "teams",
    value: "TOR",
    description: "",
  },
  {
    category: "teams",
    value: "UTA",
    description: "",
  },
  {
    category: "teams",
    value: "WAS",
    description: "",
  },
];

const CRITERIA = [
  {
    category: "position",
    value: "Guard",
    description: "",
  },
  {
    category: "position",
    value: "Forward",
    description: "",
  },
  {
    category: "position",
    value: "Center",
    description: "",
  },
  {
    category: "loyalty",
    value: "Loyal",
    description: "Played with only one team",
  },
  {
    category: "award",
    value: "All-NBA",
    description: "",
  },
  {
    category: "trait",
    value: "Active",
    description: "Currently Playing",
  },
];
