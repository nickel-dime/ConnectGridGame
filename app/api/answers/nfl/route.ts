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
import { captureException } from "@sentry/nextjs";
import { PlayerData, Player, AnswerData, DailyData } from "../model";

// {
//         league: league,
//         isEndless: isEndless,
//         currentHints: currentHints,
//         playerSelected: playerSelected,
//       }

const MAP_BOX_ID_TO_GRID_ID = [
  [0, 3],
  [1, 3],
  [2, 3],
  [0, 4],
  [1, 4],
  [2, 4],
  [0, 5],
  [1, 5],
  [2, 5],
];

const MAP_PLAYER = [0, 3, 6, 1, 4, 7, 2, 5, 8];

function getQuery(hint: NFLHints) {
  return {
    Player_Team: {
      some: {
        teamName: hint.value as NFLTeam,
      },
    },
  };
}

export async function POST(request: Request) {
  const data = await request.json();
  const currentHints = data["currentHints"];
  const playerSelected = data["playerSelected"];
  const isEndless = data["isEndless"];

  const boxData: PlayerData[] = [];

  for (let i = 0; i <= 8; i++) {
    const currentBoxAnswer: PlayerData = {
      playerGuessed: null,
      answers: [],
    };

    let hints = MAP_BOX_ID_TO_GRID_ID[i];

    const hint1: NFLHints = currentHints[hints[0]];
    const hint2: NFLHints = currentHints[hints[1]];

    const boxPlayer = playerSelected[MAP_PLAYER[i]];
    let boxPlayerGuessed = 0.0;
    const query1 = getQuery(hint1);
    const query2 = getQuery(hint2);
    // prisma call to get all possible answers sorted by year limited to 25

    const currentAnswers = await prisma.nFLAnswers.findMany({
      where: {
        OR: [
          {
            AND: {
              hint_one: hint1,
              hint_two: hint2,
            },
          },
          {
            AND: {
              hint_one: hint2,
              hint_two: hint1,
            },
          },
        ],
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

    const formatted_answers: Player[] = [];

    while (formatted_answers.length < 10) {
      for (let answer of currentAnswers) {
        let player = answer.player;
        if (boxPlayer && player.id == boxPlayer.id) {
          boxPlayerGuessed = answer.count / total;
        }

        formatted_answers.push({
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          yearStart: player.yearStart,
          yearEnd: player.yearEnd,
          profilePic: player.profilePic!,
          percentGuessed: ((answer.count / total) * 100).toFixed(2),
          link: player.fbdb_page!,
        });
      }
      break;
    }

    if (
      formatted_answers.length < 10 &&
      hint1.category == "teams" &&
      hint2.category == "teams"
    ) {
      const notAnswered = await prisma.nFLPlayer.findMany({
        where: {
          AND: [query1, query2],
          Answers: {
            none: {
              playerId: {
                not: -1,
              },
            },
          },
        },
        take: 10,
        orderBy: {
          yearEnd: "desc",
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
            profilePic: player.profilePic!,
            percentGuessed: "0.0",
            link: player.fbdb_page!,
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
        percentGuessed: (boxPlayerGuessed * 100).toFixed(2),
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
  }

  // do daily data calculations

  let totalCorrect = 0;
  let totalRarity = 0;

  for (const player of boxData) {
    if (player.playerGuessed) {
      totalCorrect += 1;
      totalRarity += parseFloat(player.playerGuessed.percentGuessed);
    }
  }

  let daily: DailyData | false = false;

  // do daily data calculations
  // total, place,
  try {
    if (!isEndless) {
      let yourDate = new Date();
      let data = {};
      if (totalCorrect == 9) {
        data = {
          scores: {
            increment: totalCorrect,
          },
          place: {
            increment: 1,
          },
          attempts: {
            increment: 1,
          },
        };
      } else {
        data = {
          scores: {
            increment: totalCorrect,
          },
          attempts: {
            increment: 1,
          },
        };
      }
      const result = await prisma.nFLGrid.update({
        where: {
          day: yourDate,
        },
        data: data,
      });

      let average_score = (result.scores / result.attempts).toFixed(1);
      let rarity = scaleRarity(100 - totalRarity / totalCorrect).toFixed(1);

      daily = {
        rarity: totalCorrect > 0 ? rarity.toString() : "-",
        place: totalCorrect == 9 ? result.place.toString() : "-",
        average_score: average_score.toString(),
      };
    } else {
      daily = {
        rarity: "-",
        place: "-",
        average_score: "-",
      };
    }
  } catch (e) {
    captureException(e);
    console.log(e);
    daily = {
      rarity: "-",
      place: "-",
      average_score: "-",
    };
  }

  const response: AnswerData = {
    boxData: boxData,
    daily: daily,
  };

  return NextResponse.json(response);
}

function scaleRarity(rarity: number) {
  const subt = 100 - rarity;

  return Math.max(rarity - subt, 0);
}
