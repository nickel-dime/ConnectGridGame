import {
  NFLPlayer,
  NFLTeam,
  NBAHints,
  NFLHints,
  NBAPlayer,
  NBATeam,
} from "@prisma/client";
import next from "next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// {
//         league: league,
//         isEndless: isEndless,
//         currentHints: currentHints,
//         playerSelected: playerSelected,
//       }

const MAP_BOX_ID_TO_GRID_ID = [
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 3],
  [2, 4],
  [2, 5],
];

interface AnswerData {
  boxData: PlayerData[];
  daily: DailyData | false;
}

interface PlayerData {
  playerGuessed: Object | null;
  answers: any[];
}

interface DailyData {
  place: number;
  rarity: number;
  average_score: number;
}

function getQuery(hint: NBAHints | NFLHints) {
  if (hint.category == "teams") {
    return {
      NBAPlayer_Team: {
        some: {
          teamName: hint.value as NBATeam,
        },
      },
    };
  }
  return {
    NBAPlayer_Team: {
      some: {
        teamName: NBATeam.CHI,
      },
    },
  };
}

const MAP_HINT_QUERY = {
  blk: "blk: { gt: 10000 }",
  tm: "NBAPlayer_Team: {some: {teamName: NBATeam.CHI,},}",
};

export async function POST(request: Request) {
  const data = await request.json();
  const currentHints = data["currentHints"];
  const playerSelected = data["playerSelected"];
  const league = data["league"];
  const isEndless = data["isEndless"];

  const boxData: PlayerData[] = [];

  for (let i = 0; i <= 8; i++) {
    const currentBoxAnswer: PlayerData = {
      playerGuessed: {},
      answers: [],
    };

    let hints = MAP_BOX_ID_TO_GRID_ID[i];

    const hint1: NBAHints | NFLHints = currentHints[hints[0]];
    const hint2: NBAHints | NFLHints = currentHints[hints[1]];

    const boxPlayer = playerSelected[i];
    let boxPlayerGuessed = 0.0;
    const query1 = getQuery(hint1);
    const query2 = getQuery(hint2);
    // prisma call to get all possible answers sorted by year limited to 25

    const currentAnswers = await prisma.nBAAnswers.findMany({
      where: {
        hint_one: hint1,
        hint_two: hint2,
      },
      include: {
        player: true,
      },
      take: 10,
      distinct: ["playerId"],
    });

    let total = 0;

    for (const answer of currentAnswers) {
      total += answer.count;
    }

    const formatted_answers = [];

    while (formatted_answers.length < 10) {
      for (let answer of currentAnswers) {
        let player = answer.player;
        if (boxPlayer && player.id == boxPlayer.id) {
          boxPlayerGuessed = answer.count / total;
          continue;
        }

        formatted_answers.push({
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          yearStart: player.yearStart,
          yearEnd: player.yearEnd,
          profilePic: player.profilePic,
          percentGuessed: ((answer.count / total) * 100).toFixed(2),
          link: player.bbref_page,
        });
      }
      break;
    }

    if (formatted_answers.length < 10) {
      const notAnswered = await prisma.nBAPlayer.findMany({
        where: {
          AND: [query1, query2],
          NBAAnswers: {
            none: {
              playerId: {
                not: -1,
              },
            },
          },
        },
        take: 10,
        orderBy: {
          pts: "desc",
        },
      });

      while (formatted_answers.length < 10) {
        for (let player of notAnswered) {
          formatted_answers.push({
            id: player.id,
            firstName: player.firstName,
            lastName: player.lastName,
            yearStart: player.yearStart,
            yearEnd: player.yearEnd,
            profilePic: player.profilePic,
            percentGuessed: 0.0,
            link: player.bbref_page,
          });
        }
        break;
      }
    }

    currentBoxAnswer["answers"] = formatted_answers;
    if (boxPlayer) {
      currentBoxAnswer["playerGuessed"] = {
        id: boxPlayer.id,
        firstName: boxPlayer.firstName,
        lastName: boxPlayer.lastName,
        yearStart: boxPlayer.yearStart,
        yearEnd: boxPlayer.yearEnd,
        profilePic: boxPlayer.profilePic,
        percentGuessed: ((boxPlayerGuessed / total) * 100).toFixed(2),
        link: boxPlayer.bbref_page,
      };
    } else {
      currentBoxAnswer["playerGuessed"] = null;
    }

    // sort currentBoxAnswer by percentGuessed descending
    currentBoxAnswer["answers"].sort((a, b) => {
      return parseFloat(b.percentGuessed) - parseFloat(a.percentGuessed);
    });

    boxData.push(currentBoxAnswer);
    console.log("Finished box number %d ", i);
  }

  // do daily data calculations

  let daily: DailyData | false = false;

  if (!isEndless) {
    daily = {
      rarity: 0,
      place: 0,
      average_score: 0,
    };
  }

  const response: AnswerData = {
    boxData: boxData,
    daily: daily,
  };

  return NextResponse.json(response);
}
