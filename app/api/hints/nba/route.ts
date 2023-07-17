import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { NBAHints } from "@prisma/client";

export async function GET(request: Request) {
  // try {
  var url = new URL(request.url);
  var isEndless = url.searchParams.get("isEndless");

  if (isEndless == "1") {
    var numTeams = Math.floor(Math.random() * (6 - 4 + 1)) + 4;

    const final_grid = getRandom(TEAMS, numTeams).concat(
      getRandom(CRITERIA, 6 - numTeams)
    );

    // const teams: NBAHints[] =
    //   await prisma.$queryRaw`SELECT * FROM "NBAHints" WHERE "category" = 'teams' ORDER BY random() LIMIT ${numTeams};`;
    // const criteria: NBAHints[] =
    //   await prisma.$queryRaw`SELECT * FROM "NBAHints" WHERE "category" != 'teams' ORDER BY random() LIMIT ${
    //     6 - numTeams
    //   }`;

    // const final = teams.concat(criteria).sort(function (a, b) {
    //   return Math.random() * 2 - 1;
    // });

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
  // } catch (e) {
  //   console.log(e);
  //   Sentry.captureException(e);
  //   return NextResponse.json(getRandom(TEAMS, 6));
  // }
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
    teamLogo: "/logos/NBA/ATL.png",
  },
  {
    category: "teams",
    value: "BOS",
    description: "",
    teamLogo: "/logos/NBA/BOS.png",
  },
  {
    category: "teams",
    value: "BKN",
    description: "",
    teamLogo: "/logos/NBA/BKN.png",
  },
  {
    category: "teams",
    value: "CHA",
    description: "",
    teamLogo: "/logos/NBA/CHA.png",
  },
  {
    category: "teams",
    value: "CHI",
    description: "",
    teamLogo: "/logos/NBA/CHI.png",
  },
  {
    category: "teams",
    value: "CLE",
    description: "",
    teamLogo: "/logos/NBA/CLE.png",
  },
  {
    category: "teams",
    value: "DAL",
    description: "",
    teamLogo: "/logos/NBA/DAL.png",
  },
  {
    category: "teams",
    value: "DEN",
    description: "",
    teamLogo: "/logos/NBA/DEN.png",
  },
  {
    category: "teams",
    value: "DET",
    description: "",
    teamLogo: "/logos/NBA/DET.png",
  },
  {
    category: "teams",
    value: "GSW",
    description: "",
    teamLogo: "/logos/NBA/GSW.png",
  },
  {
    category: "teams",
    value: "HOU",
    description: "",
    teamLogo: "/logos/NBA/HOU.png",
  },
  {
    category: "teams",
    value: "IND",
    description: "",
    teamLogo: "/logos/NBA/IND.png",
  },
  {
    category: "teams",
    value: "LAC",
    description: "",
    teamLogo: "/logos/NBA/LAC.png",
  },
  {
    category: "teams",
    value: "LAL",
    description: "",
    teamLogo: "/logos/NBA/LAL.png",
  },
  {
    category: "teams",
    value: "MEM",
    description: "",
    teamLogo: "/logos/NBA/MEM.png",
  },
  {
    category: "teams",
    value: "MIA",
    description: "",
    teamLogo: "/logos/NBA/MIA.png",
  },
  {
    category: "teams",
    value: "MIL",
    description: "",
    teamLogo: "/logos/NBA/MIL.png",
  },
  {
    category: "teams",
    value: "MIN",
    description: "",
    teamLogo: "/logos/NBA/MIN.png",
  },
  {
    category: "teams",
    value: "NOP",
    description: "",
    teamLogo: "/logos/NBA/NOP.png",
  },
  {
    category: "teams",
    value: "NYK",
    description: "",
    teamLogo: "/logos/NBA/NYK.png",
  },
  {
    category: "teams",
    value: "OKC",
    description: "",
    teamLogo: "/logos/NBA/OKC.png",
  },
  {
    category: "teams",
    value: "ORL",
    description: "",
    teamLogo: "/logos/NBA/ORL.png",
  },
  {
    category: "teams",
    value: "PHL",
    description: "",
    teamLogo: "/logos/NBA/PHL.png",
  },
  {
    category: "teams",
    value: "PHX",
    description: "",
    teamLogo: "/logos/NBA/PHX.png",
  },
  {
    category: "teams",
    value: "POR",
    description: "",
    teamLogo: "/logos/NBA/POR.png",
  },
  {
    category: "teams",
    value: "SAC",
    description: "",
    teamLogo: "/logos/NBA/SAC.png",
  },
  {
    category: "teams",
    value: "SAS",
    description: "",
    teamLogo: "/logos/NBA/SAS.png",
  },
  {
    category: "teams",
    value: "TOR",
    description: "",
    teamLogo: "/logos/NBA/TOR.png",
  },
  {
    category: "teams",
    value: "UTA",
    description: "",
    teamLogo: "/logos/NBA/UTA.png",
  },
  {
    category: "teams",
    value: "WAS",
    description: "",
    teamLogo: "/logos/NBA/WAS.png",
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
  {
    category: "trait",
    value: "Retired",
    description: "",
  },
  {
    category: "trait",
    value: "Over 7 Feet",
    description: "",
  },
  {
    category: "stats",
    value: "10k+ Points",
    description: "",
  },
  {
    category: "stats",
    value: "3k+ Assists",
    description: "",
  },
  {
    category: "stats",
    value: "5k+ Rebounds",
    description: "",
  },
  {
    category: "stats",
    value: "500+ Blocks",
    description: "",
  },
  {
    category: "stats",
    value: "1500+ Turnovers",
    description: "",
  },
  {
    category: "trait",
    value: "Over 250 Pounds",
    description: "",
  },
  {
    category: "college",
    value: "UCLA",
    description: "",
    teamLogo: "/logos/NCAA/UCLA.png",
  },
  {
    category: "college",
    value: "Kentucky",
    description: "",
    teamLogo: "/logos/NCAA/UK .png",
  },
  {
    category: "college",
    value: "Duke",
    description: "Duke",
    teamLogo: "/logos/NCAA/Duke.png",
  },
  {
    category: "stats",
    value: "Played 13+ Seasons",
    description: "",
  },
  {
    category: "award",
    value: "Greatest 75",
    description: "Part of 75th anniversary team",
  },
  {
    category: "trait",
    value: "USA",
    description: "Born in the USA",
  },
  {
    category: "trait",
    value: "Undrafted",
    description: "",
  },
  {
    category: "trait",
    value: "Top 5 Pick",
    description: "",
  },
  {
    category: "trait",
    value: "International",
    description: "Born outside the US",
  },
];
