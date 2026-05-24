"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string | null;

  warehouses: {
    warehouseId: string;
    warehouseName: string;
    availableStock: number;
  }[];
};

export default function Home() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const router =
    useRouter();

  useEffect(() => {

    async function loadProducts() {

      try {

        const response =
          await fetch("/api/products");

        const data =
          await response.json();

        setProducts(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadProducts();

  }, []);

  async function reserve(
    productId: string,
    warehouseId: string
  ) {

    try {

      const response =
        await fetch(
          "/api/reservations",
          {

            method: "POST",

            headers: {

              "Content-Type":
              "application/json"

            },

            body: JSON.stringify({

              productId,

              warehouseId,

              quantity: 1

            })

          }
        );

      if (
        response.status === 409
      ) {

        alert(
          "Not enough stock"
        );

        return;

      }

      if (!response.ok) {

        alert(
          "Reservation failed"
        );

        return;

      }

      const reservation =
        await response.json();

      router.push(
        `/checkout/${reservation.id}`
      );

    } catch {

      alert(
        "Something failed"
      );

    }

  }

  if (loading) {

    return (

      <div
      className="p-8"
      >

        Loading...

      </div>

    );

  }

  return (

    <div
    className="p-8 max-w-4xl mx-auto"
    >

      <h1
      className=
      "text-3xl font-bold mb-6"
      >

        Inventory

      </h1>

      <div
      className="space-y-6"
      >

        {

          products.map(

            (product) => (

              <div

              key={product.id}

              className=
              "border rounded-lg p-5 shadow-sm"

              >

                <h2
                className=
                "text-xl font-bold"
                >

                  {product.name}

                </h2>

                <p
                className=
                "text-gray-600 mb-3"
                >

                  {
                  product.description
                  }

                </p>

                {

                  product.warehouses.map(

                    (warehouse) => (

                      <div

                      key={
                      warehouse.warehouseId
                      }

                      className=

                      "border-t pt-3 mt-3"

                      >

                        <p>

                          <strong>

                          Warehouse:

                          </strong>

                          {" "}

                          {

                          warehouse.warehouseName

                          }

                        </p>

                        <p>

                          <strong>

                          Available:

                          </strong>

                          {" "}

                          {

                          warehouse.availableStock

                          }

                        </p>

                        <button

                        onClick={()=>

                        reserve(

                        product.id,

                        warehouse.warehouseId

                        )

                        }

                        className=

                        "mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"

                        >

                          Reserve

                        </button>

                      </div>

                    )

                  )

                }

              </div>

            )

          )

        }

      </div>

    </div>

  );

}