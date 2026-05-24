import { NextRequest }
from "next/server";

import { NextResponse }
from "next/server";

import { reserveStock }
from "@/app/lib/reserve";

export async function POST(

request:NextRequest

){

  try{

    const body =

    await request.json();

    const {

      productId,

      warehouseId,

      quantity

    } = body;

    if(

      !productId ||

      !warehouseId ||

      !quantity

    ){

      return NextResponse.json(

        {

          error:

          "Missing fields"

        },

        {

          status:400

        }

      );

    }

    const reservation =

    await reserveStock(

      productId,

      warehouseId,

      quantity

    );

    return NextResponse.json(

      reservation,

      {

        status:201

      }

    );

  }

  catch(error){

    if(

      error instanceof Error

    ){

      if(

        error.message==="409"

      ){

        return NextResponse.json(

          {

            error:

            "Not enough stock"

          },

          {

            status:409

          }

        );

      }

    }

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