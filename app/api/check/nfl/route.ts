import { NFLPlayer, NFLTeam } from "@prisma/client";
import next from "next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
  const teams = data["teams"];
  const success = await check_if_player_fits_teams(
    data["player"],
    teams[grid_ids[0]],
    teams[grid_ids[1]]
  );

  if (success) {
    grid_ids.sort();

    await prisma.nFLAnswers.upsert({
      where: {
        hint_one_hint_two_playerId: {
          hint_one: teams[grid_ids[0]],
          hint_two: teams[grid_ids[1]],
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
        hint_one: teams[grid_ids[0]],
        hint_two: teams[grid_ids[1]],
        count: 1,
      },
    });
  }

  return NextResponse.json({
    success: success,
  });
  // } else if (!data["isEndless"]) {
  //   return (
  //     NextResponse.error(),
  //     {
  //       status: 400,
  //       statusText: "No normal mode",
  //     }
  //   );
  // }

  return (
    NextResponse.error(),
    {
      status: 400,
      statusText: "Could not get mode for checking",
    }
  );
}

async function check_if_player_fits_teams(
  player: NFLPlayer,
  team1: NFLTeam,
  team2: NFLTeam
) {
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

  return [team1, team2].every((team) => teamNames.includes(team));
}
