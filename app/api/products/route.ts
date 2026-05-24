import { NextResponse }
from "next/server";

import { prisma }
from "@/app/lib/prisma";

export async function GET(){

  try{

    const products =

    await prisma.product.findMany({

      include:{

        inventories:{

          include:{

            warehouse:true

          }

        }

      }

    });

    const result =

    products.map(

      (product)=>({

        id:product.id,

        name:product.name,

        description:
        product.description,

        warehouses:

        product.inventories.map(

          (inventory)=>({

            warehouseId:

            inventory.warehouse.id,

            warehouseName:

            inventory.warehouse.name,

            availableStock:

            inventory.totalStock

            -

            inventory.reservedStock

          })

        )

      })

    );

    return NextResponse.json(

      result

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