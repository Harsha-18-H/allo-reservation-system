import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.reservation.deleteMany();

  await prisma.inventory.deleteMany();

  await prisma.product.deleteMany();

  await prisma.warehouse.deleteMany();

  const warehouse1 =
  await prisma.warehouse.create({

    data:{

      name:"Bangalore Warehouse",

      location:"Bangalore"

    }

  });

  const warehouse2 =
  await prisma.warehouse.create({

    data:{

      name:"Mumbai Warehouse",

      location:"Mumbai"

    }

  });

  const product1 =
  await prisma.product.create({

    data:{

      name:
      "Health Checkup Package",

      description:
      "Diagnostic package"

    }

  });

  const product2 =
  await prisma.product.create({

    data:{

      name:
      "Premium Wellness Package",

      description:
      "Advanced diagnostics"

    }

  });

  await prisma.inventory.createMany({

    data:[

      {

        productId:
        product1.id,

        warehouseId:
        warehouse1.id,

        totalStock:10,

        reservedStock:0

      },

      {

        productId:
        product1.id,

        warehouseId:
        warehouse2.id,

        totalStock:5,

        reservedStock:0

      },

      {

        productId:
        product2.id,

        warehouseId:
        warehouse1.id,

        totalStock:8,

        reservedStock:0

      }

    ]

  });

  console.log(
    "Seed completed"
  );

}

main()

.catch(console.error)

.finally(async()=>{

await prisma.$disconnect();

});