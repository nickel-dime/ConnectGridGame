import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  //   const currentUser = await getCurrentUser();

  //   if (!currentUser) {
  //     return console.log("Hi");
  //   }

  //   const body = await request.json();
  //   const { name, description, imageSrc } = body;

  //   //   Object.keys(body).forEach((value: any) => {
  //   //     if (!body[value]) {
  //   //       NextResponse.error();
  //   //     }
  //   //   });

  //   const listing = await prisma.listing.create({
  //     data: {
  //       name,
  //       imageSrc,
  //       description,
  //       userId: currentUser.id,
  //       //   userId: currentUser.id
  //     },
  //   });

  return NextResponse.json(["CLE", "BAL", "PIT", "ARI", "IND", "LAC"]);
}
