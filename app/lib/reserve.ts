import { prisma } from "./prisma";

export async function reserveStock(

  productId:string,

  warehouseId:string,

  quantity:number

){

  return await prisma.$transaction(

    async(tx)=>{

      const inventoryRows =

      await tx.$queryRaw<
      {

        id:string

        totalStock:number

        reservedStock:number

      }[]

      >`

      SELECT *

      FROM "Inventory"

      WHERE

      "productId"=${productId}

      AND

      "warehouseId"=${warehouseId}

      FOR UPDATE

      `;

      const inventory =
      inventoryRows[0];

      if(!inventory){

        throw new Error(
          "Inventory not found"
        );

      }

      const available =

      inventory.totalStock

      -

      inventory.reservedStock;

      if(

        available
        <
        quantity

      ){

        throw new Error(
          "409"
        );

      }

      await tx.inventory.update({

        where:{

          id:inventory.id

        },

        data:{

          reservedStock:{

            increment:
            quantity

          }

        }

      });

      const reservation =

      await tx.reservation.create({

        data:{

          productId,

          warehouseId,

          quantity,

          expiresAt:

          new Date(

            Date.now()
            +

            10*60*1000

          )

        }

      });

      return reservation;

    },

    {

      isolationLevel:
      "Serializable"

    }

  );

}