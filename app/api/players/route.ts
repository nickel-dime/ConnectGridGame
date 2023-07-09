import { Player } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var firstName = url.searchParams.get("firstName");
  var lastName = url.searchParams.get("lastName");

  let query_where = {};

  if (firstName == null) {
    return NextResponse.json([]);
  } else if (lastName == null) {
    query_where = {
      OR: [
        {
          firstName: {
            startsWith: firstName,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            startsWith: firstName,
            mode: "insensitive",
          },
        },
      ],
    };
  } else {
    query_where = {
      firstName: {
        startsWith: firstName,
        mode: "insensitive",
      },
      lastName: {
        startsWith: lastName,
        mode: "insensitive",
      },
    };
  }
  const result = await prisma.player.findMany({
    where: query_where,
    take: 25,
    orderBy: {
      yearEnd: "desc",
    },
  });

  if (result === undefined || result.length == 0) {
    const result = await prisma.player.findMany({
      where: {
        lastName: {
          startsWith: firstName,
          mode: "insensitive",
        },
      },
      take: 25,
      orderBy: {
        yearEnd: "desc",
      },
    });
  }

  let formatted_result = [];

  for (const player of result) {
    formatted_result.push({
      firstName: player.firstName,
      lastName: player.lastName,
      yearStart: player.yearStart,
      yearEnd: player.yearEnd,
      position: player.position,
      id: player.id,
      profilePic: player.profilePic
        ? player.profilePic
        : "https://images.fantasypros.com/images/players/nfl/22978/headshot/70x70.png",
    });
  }

  return NextResponse.json(formatted_result);
}
