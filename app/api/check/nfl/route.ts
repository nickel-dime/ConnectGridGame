import { NFLPlayer, NFLTeam, NFLHints } from "@prisma/client";
import next from "next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

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

export async function POST(request: Request) {
  var url = new URL(request.url);
  const boxId = url.searchParams.get("boxId");
  const data = await request.json();
  if (boxId == null) {
    return (
      NextResponse.error(),
      {
        status: 400,
        statusText: "No Box ID",
      }
    );
  }

  const grid_ids = MAP_BOX_ID_TO_GRID_ID[parseInt(boxId)];

  // if (data["isEndless"]) {
  const hints: NFLHints[] = data["hints"];
  const success = await check_if_hints_fit(
    data["player"],
    hints[grid_ids[0]],
    hints[grid_ids[1]]
  );

  if (success) {
    grid_ids.sort();

    await prisma.nFLAnswers.upsert({
      where: {
        hint_one_val_hint_two_val_playerId: {
          hint_one_val: hints[grid_ids[0]].value,
          hint_two_val: hints[grid_ids[1]].value,
          playerId: data["player"].id,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        playerId: data["player"].id,
        hint_one_val: hints[grid_ids[0]].value,
        hint_two_val: hints[grid_ids[1]].value,
        count: 1,
      },
    });
  }

  return NextResponse.json({
    success: success,
  });
}

async function check_if_hints_fit(
  player: NFLPlayer,
  hint1: NFLHints,
  hint2: NFLHints
) {
  const first = await checkIfHintFits(player, hint1);
  const second = await checkIfHintFits(player, hint2);

  return first && second;
}

async function checkIfHintFits(player: NFLPlayer, hint: NFLHints) {
  try {
    if (hint.category == "teams") {
      const teams = await prisma.nFLPlayer_Team.findMany({
        where: {
          playerFirstName: player.firstName,
          playerLastName: player.lastName,
          playerYearStart: player.yearStart,
          playerYearEnd: player.yearEnd,
        },
      });

      if (teams == null) {
        return false;
      }

      let teamNames = teams.map((v) => v.teamName);
      return teamNames.includes(hint.value as NFLTeam);
    } else if (hint.category == "position") {
      const db_player = await prisma.nFLPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null || db_player.position == null) {
        return false;
      }

      if (hint.value == "O-Line") {
        if (
          db_player.position == "OT" ||
          db_player.position == "OG" ||
          db_player.position == "C"
        ) {
          return true;
        } else {
          return false;
        }
      }

      return db_player.position.includes(hint.value);
    } else if (hint.category == "trait" || hint.category == "stats") {
      const db_player = await prisma.nFLPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null) {
        return false;
      }

      if (hint.value == "Active") {
        return db_player.yearEnd == "2023";
      } else if (hint.value == "Retired") {
        return db_player.yearEnd != "2023";
      }

      return false;
    } else if (hint.category == "award") {
      const db_player = await prisma.nFLPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null) {
        return false;
      }

      return false;
    } else if (hint.category == "loyalty") {
      const teams = await prisma.nFLPlayer_Team.findMany({
        where: {
          playerFirstName: player.firstName,
          playerLastName: player.lastName,
          playerYearStart: player.yearStart,
          playerYearEnd: player.yearEnd,
        },
      });

      if (teams == null) {
        return false;
      }

      return teams.length == 1;
    } else if (hint.category == "college") {
      const db_player = await prisma.nFLPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null || db_player.college == null) {
        return false;
      }

      return db_player.college == hint.value;
    }
  } catch (e) {
    Sentry.captureException(e);
    return true;
  }
}

// function api<T>(url: string, HEADERS: HeadersInit): Promise<T> {
//   return fetch(url, {
//     headers: HEADERS,
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }
//     return response.json() as Promise<T>;
//   });
// }

// Southern California
// Notre Dame
// Ohio State
// Michigan
// WR
// QB
// DB
// RB
// TE
// K
// O-Line
// Retired
// Active
// Loyal - Played with only one team
