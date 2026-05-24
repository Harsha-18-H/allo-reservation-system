"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useRouter
} from "next/navigation";

export default function Checkout() {

  const params =
    useParams();

  const router =
    useRouter();

  const [
    seconds,
    setSeconds
  ] = useState(600);

  const [
    loading,
    setLoading
  ] = useState(false);

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev => {

          if (prev <= 1) {

            clearInterval(timer);

            alert(
              "Reservation expired"
            );

            router.push("/");

            return 0;

          }

          return prev - 1;

        });

      }, 1000);

    return () => {

      clearInterval(
        timer
      );

    };

  }, [router]);

  async function confirm() {

    try {

      setLoading(true);

      const response =

      await fetch(

        `/api/reservations/${params.id}/confirm`,

        {

          method: "POST"

        }

      );

      if (
        response.status === 410
      ) {

        alert(
          "Reservation expired"
        );

        router.push("/");

        return;

      }

      if (
        response.ok
      ) {

        alert(
          "Purchase confirmed"
        );

        router.push("/");

        return;

      }

      alert(
        "Purchase failed"
      );

    }

    finally {

      setLoading(false);

    }

  }

  async function cancel() {

    try {

      setLoading(true);

      await fetch(

        `/api/reservations/${params.id}/release`,

        {

          method: "POST"

        }

      );

      alert(
        "Reservation cancelled"
      );

      router.push("/");

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <div
    className="p-8"
    >

      <h1
      className="text-3xl font-bold"
      >

        Checkout

      </h1>

      <p
      className="mt-4"
      >

        Reservation ID:

        {" "}

        {params.id}

      </p>

      <p
      className="mt-3 text-lg"
      >

        Time Remaining:

        {" "}

        {

          Math.floor(
            seconds / 60
          )

        }

        :

        {

          String(

            seconds % 60

          ).padStart(

            2,

            "0"

          )

        }

      </p>

      <div
      className="mt-6 flex gap-3"
      >

        <button

        disabled={
          loading ||
          seconds===0
        }

        onClick={
          confirm
        }

        className=

        "bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"

        >

          Confirm Purchase

        </button>

        <button

        disabled={
          loading ||
          seconds===0
        }

        onClick={
          cancel
        }

        className=

        "bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"

        >

          Cancel

        </button>

      </div>

    </div>

  );

}