import { NextResponse }
from "next/server";

import { prisma }
from "@/app/lib/prisma";

export async function GET(){

  try{

    const warehouses =

    await prisma.warehouse.findMany();

    return NextResponse.json(

      warehouses

    );

  }

  catch{

    return NextResponse.json(

      {

        error:

        "Server Error"

      },

      {

        status:500

      }

    );

  }

}