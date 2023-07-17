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
  const hints: NBAHints[] = data["hints"];
  const success = await check_if_hints_fit(
    data["player"],
    hints[grid_ids[0]],
    hints[grid_ids[1]]
  );

  if (success) {
    grid_ids.sort();

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
  try {
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
    } else if (hint.category == "trait" || hint.category == "stats") {
      const db_player = await prisma.nBAPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null) {
        return false;
      }

      if (hint.value == "retired") {
        return !db_player.isActive;
      } else if (hint.value == "Active") {
        return db_player.isActive;
      } else if (hint.value == "10k+ Points") {
        const points = db_player.pts;

        if (points == null) {
          return false;
        }

        return points >= 10000;
      } else if (hint.value == "3k+ Assists") {
        const assists = db_player.ast;

        if (assists == null) {
          return false;
        }

        return assists >= 3000;
      } else if (hint.value == "5k+ Rebounds") {
        const rebounds = db_player.reb;

        if (rebounds == null) {
          return false;
        }

        return rebounds >= 5000;
      } else if (hint.value == "500+ Blocks") {
        const blocks = db_player.blk;

        if (blocks == null) {
          return false;
        }

        return blocks >= 500;
      } else if (hint.value == "1500+ Turnovers") {
        const tov = db_player.tov;

        if (tov == null) {
          return false;
        }

        return tov >= 1500;
      } else if (hint.value == "Over 250 Pounds") {
        const weight = db_player.weight;

        if (weight == null) {
          return false;
        }

        return weight >= 250;
      } else if (hint.value == "USA") {
        const country = db_player.country;

        if (country == null) {
          return false;
        }

        return country == "USA";
      } else if (hint.value == "International") {
        const country = db_player.country;

        if (country == null) {
          return false;
        }

        return country != "USA";
      } else if (hint.value == "Undrafted") {
        const draft = db_player.draft;

        if (draft == null) {
          return false;
        }

        return draft == "Undrafted";
      } else if (hint.value == "Top 5 Pick") {
        const draft = db_player.draft;

        if (draft == null) {
          return false;
        }

        var parsed_draft = draft.split(",");

        if (parsed_draft.length != 3) {
          return false;
        }

        return parseInt(parsed_draft[1]) == 1 && parseInt(parsed_draft[2]) <= 5;
      } else if (hint.value == "Over 7 Feet") {
        const height = db_player.height;

        const parsed_height = height?.split("-");

        console.log(parsed_height);

        if (parsed_height == undefined || parsed_height.length < 2) {
          return false;
        }

        console.log(parsed_height, parseInt(parsed_height[0]));

        return parseInt(parsed_height[0]) >= 7;
      } else if (hint.value == "Played 13+ Seasons") {
        const seasons = db_player.number_seasons;

        if (seasons == null) {
          return false;
        }

        return seasons >= 13;
      } else {
        Sentry.captureException(`${hint} not working`);
        return true;
      }
    } else if (hint.category == "award") {
      const db_player = await prisma.nBAPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null) {
        return false;
      }

      if (hint.value == "All-NBA") {
        return db_player.isAllNBA;
      } else if (hint.value == "Greatest 75") {
        return db_player.greatest_75;
      }
    } else if (hint.category == "loyalty") {
      const teams = await prisma.nBAPlayer_Team.findMany({
        where: {
          playerId: player.id,
        },
      });

      if (teams == null) {
        return false;
      }

      return teams.length == 1;
    } else if (hint.category == "college") {
      const db_player = await prisma.nBAPlayer.findUnique({
        where: {
          id: player.id,
        },
      });

      if (db_player == null) {
        return false;
      }

      return db_player.school == hint.value;
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
