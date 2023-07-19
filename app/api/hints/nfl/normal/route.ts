import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NFLHints } from "@prisma/client";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "1") {
    var numTeams = Math.floor(Math.random() * (6 - 4 + 1)) + 4;

    const teams: NFLHints[] =
      await prisma.$queryRaw`SELECT * FROM "NFLHints" WHERE "category" = 'teams' ORDER BY random() LIMIT ${numTeams};`;
    const criteria: NFLHints[] =
      await prisma.$queryRaw`SELECT * FROM "NFLHints" WHERE "category" != 'teams' ORDER BY random() LIMIT ${
        6 - numTeams
      }`;

    const final = teams.concat(criteria).sort(function (a, b) {
      return Math.random() * 2 - 1;
    });
    return NextResponse.json(final);
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
    teamLogo: "/logos/NFL/MIA.png",
  },
  {
    category: "teams",
    value: "HOU",
    description: "",
    teamLogo: "/logos/NFL/HOU.png",
  },
  {
    category: "teams",
    value: "BAL",
    description: "",
    teamLogo: "/logos/NFL/BAL.png",
  },
  {
    category: "teams",
    value: "JAX",
    description: "",
    teamLogo: "/logos/NFL/JAX.png",
  },
  {
    category: "teams",
    value: "CAR",
    description: "",
    teamLogo: "/logos/NFL/CAR.png",
  },
  {
    category: "teams",
    value: "TB",
    description: "",
    teamLogo: "/logos/NFL/TB.png",
  },
  {
    category: "teams",
    value: "SEA",
    description: "",
    teamLogo: "/logos/NFL/SEA.png",
  },
  {
    category: "teams",
    value: "CIN",
    description: "",
    teamLogo: "/logos/NFL/CAR.png",
  },
  {
    category: "teams",
    value: "NO",
    description: "",
    teamLogo: "/logos/NFL/NO.png",
  },
  {
    category: "teams",
    value: "ATL",
    description: "",
    teamLogo: "/logos/NFL/ATL.png",
  },
  {
    category: "teams",
    value: "MIN",
    description: "",
    teamLogo: "/logos/NFL/MIN.png",
  },
  {
    category: "teams",
    value: "BUF",
    description: "",
    teamLogo: "/logos/NFL/BUF.png",
  },
  {
    category: "teams",
    value: "TEN",
    description: "",
    teamLogo: "/logos/NFL/TEN.png",
  },
  {
    category: "teams",
    value: "LV",
    description: "",
    teamLogo: "/logos/NFL/LV.png",
  },
  {
    category: "teams",
    value: "NE",
    description: "",
    teamLogo: "/logos/NFL/NE.png",
  },
  {
    category: "teams",
    value: "NYJ",
    description: "",
    teamLogo: "/logos/NFL/NYJ.png",
  },
  {
    category: "teams",
    value: "DEN",
    description: "",
    teamLogo: "/logos/NFL/DEN.png",
  },
  {
    category: "teams",
    value: "LAC",
    description: "",
    teamLogo: "/logos/NFL/LAC.png",
  },
  {
    category: "teams",
    value: "KC",
    description: "",
    teamLogo: "/logos/NFL/KC.png",
  },
  {
    category: "teams",
    value: "DAL",
    description: "",
    teamLogo: "/logos/NFL/DAL.png",
  },
  {
    category: "teams",
    value: "IND",
    description: "",
    teamLogo: "/logos/NFL/IND.png",
  },
  {
    category: "teams",
    value: "CLE",
    description: "",
    teamLogo: "/logos/NFL/CLE.png",
  },
  {
    category: "teams",
    value: "SF",
    description: "",
    teamLogo: "/logos/NFL/SF.png",
  },
  {
    category: "teams",
    value: "LA",
    description: "",
    teamLogo: "/logos/NFL/LA.png",
  },
  {
    category: "teams",
    value: "PIT",
    description: "",
    teamLogo: "/logos/NFL/PIT.png",
  },
  {
    category: "teams",
    value: "PHI",
    description: "",
    teamLogo: "/logos/NFL/PHI.png",
  },
  {
    category: "teams",
    value: "WAS",
    description: "",
    teamLogo: "/logos/NFL/WAS.png",
  },
  {
    category: "teams",
    value: "DET",
    description: "",
    teamLogo: "/logos/NFL/DET.png",
  },
  {
    category: "teams",
    value: "NYG",
    description: "",
    teamLogo: "/logos/NFL/NYG.png",
  },
  {
    category: "teams",
    value: "GB",
    description: "",
    teamLogo: "/logos/NFL/GB.png",
  },
  {
    category: "teams",
    value: "CHI",
    description: "",
    teamLogo: "/logos/NFL/CHI.png",
  },
  {
    category: "teams",
    value: "ARI",
    description: "",
    teamLogo: "/logos/NFL/ARI.png",
  },
];
