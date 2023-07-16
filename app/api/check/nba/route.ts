import {
  NFLPlayer,
  NFLTeam,
  NBAHints,
  NBAPlayer,
  NBATeam,
} from "@prisma/client";
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
  const hints: NBAHints[] = data["hints"];
  const success = await check_if_hints_fit(
    data["player"],
    hints[grid_ids[0]],
    hints[grid_ids[1]]
  );

  if (success) {
    grid_ids.sort();

    console.log({
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

    await prisma.nBAAnswers.upsert({
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
  player: NBAPlayer,
  hint1: NBAHints,
  hint2: NBAHints
) {
  const first = await checkIfHintFits(player, hint1);
  const second = await checkIfHintFits(player, hint2);

  return first && second;
}

async function checkIfHintFits(player: NBAPlayer, hint: NBAHints) {
  if (hint.category == "teams") {
    const teams = await prisma.nBAPlayer_Team.findMany({
      where: {
        playerId: player.id,
      },
    });

    if (teams == null) {
      return false;
    }

    let teamNames = teams.map((v) => v.teamName);
    return teamNames.includes(hint.value as NBATeam);
  } else if (hint.category == "position") {
    const db_player = await prisma.nBAPlayer.findUnique({
      where: {
        id: player.id,
      },
    });

    if (db_player == null) {
      return false;
    }

    return db_player.position.includes(hint.value);
  } else if (hint.category == "trait") {
    const db_player = await prisma.nBAPlayer.findUnique({
      where: {
        id: player.id,
      },
    });

    if (db_player == null) {
      return false;
    }

    return db_player.isActive;
  } else if (hint.category == "award") {
    const HEADERS = {
      Host: "stats.nba.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "x-nba-stats-origin": "stats",
      "x-nba-stats-token": "true",
      Connection: "keep-alive",
      Referer: "https://stats.nba.com/",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };

    const awards: any = await api(
      `https://stats.nba.com/stats/playerawards?PlayerID=${player.id}`,
      HEADERS
    );

    console.log(awards);

    let parsedAwards = awards["resultSets"][0]["rowSet"];

    for (const award in parsedAwards) {
      let format_award = parsedAwards[award];

      if (format_award[4] == hint.value) {
        return true;
      }
    }

    return false;
    console.log(awards);
  }
}

function api<T>(url: string, HEADERS: HeadersInit): Promise<T> {
  return fetch(url, {
    headers: HEADERS,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}