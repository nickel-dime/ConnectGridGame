import { NFLPlayer, NBAPlayer } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  var url = new URL(request.url);
  var firstName = url.searchParams.get("firstName");
  var lastName = url.searchParams.get("lastName");
  var league = url.searchParams.get("league");

  let result: NFLPlayer[] | NBAPlayer[] = [];

  if (firstName == null) {
    return NextResponse.json([]);
  } else if (lastName == null) {
    const query = `SELECT "firstName", "lastName", "id", "yearEnd", "yearStart", "profilePic", "position" FROM "${league}Player" WHERE "${league}Player"."firstName" % '${firstName}' OR "${league}Player"."lastName" % '${firstName}' ORDER BY "yearEnd" desc LIMIT 25;`;
    result = await prisma.$queryRawUnsafe(query);
  } else {
    const query = `SELECT "firstName", "lastName", "id", "yearEnd", "yearStart", "profilePic", "position" FROM "${league}Player" WHERE "${league}Player"."firstName" % '${firstName}' AND UPPER("${league}Player"."lastName") LIKE '${lastName.toUpperCase()}%' ORDER BY "yearEnd" desc LIMIT 25;`;
    result = await prisma.$queryRawUnsafe(query);
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
      profilePic: player.profilePic,
    });
  }

  return NextResponse.json(formatted_result);
}
