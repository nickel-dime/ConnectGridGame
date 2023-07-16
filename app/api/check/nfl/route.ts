import { NFLHints, NFLPlayer, NFLTeam } from "@prisma/client";
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
  const hints = data["hints"];
  const success = await check_if_player_fits_teams(
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

async function check_if_player_fits_teams(
  player: NFLPlayer,
  team1: NFLHints,
  team2: NFLHints
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

  let teamNames: String[] = teams.map((v) => v.teamName);

  return [team1.value, team2.value].every((team) => teamNames.includes(team));
}
