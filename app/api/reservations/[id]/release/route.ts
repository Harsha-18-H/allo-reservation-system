import { NextRequest }
from "next/server";

import { NextResponse }
from "next/server";

import { prisma }
from "@/app/lib/prisma";

export async function POST(

request:NextRequest,

{
params
}:{

params:Promise<{
id:string
}>

}

){

try{

const { id } =
await params;

const reservation =

await prisma.reservation.findUnique({

where:{
id
}

});

if(

!reservation

){

return NextResponse.json(

{

error:
"Reservation not found"

},

{

status:404

}

);

}

if(

reservation.status
!== "PENDING"

){

return NextResponse.json(

{

error:
"Already processed"

},

{

status:400

}

);

}

await prisma.$transaction(

async(tx)=>{

const inventory =

await tx.inventory.findFirst({

where:{

productId:
reservation.productId,

warehouseId:
reservation.warehouseId

}

});

if(

!inventory

){

throw new Error(
"Inventory missing"
);

}

await tx.inventory.update({

where:{

id:
inventory.id

},

data:{

reservedStock:{

decrement:
reservation.quantity

}

}

});

await tx.reservation.update({

where:{

id

},

data:{

status:
"RELEASED"

}

});

}

);

return NextResponse.json({

success:true

});

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