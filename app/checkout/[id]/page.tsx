"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useRouter
} from "next/navigation";

export default function Checkout(){

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

  useEffect(()=>{

    const timer =

    setInterval(()=>{

      setSeconds(prev=>{

        if(prev<=1){

          clearInterval(
            timer
          );

          return 0;

        }

        return prev-1;

      });

    },1000);

    return()=>{

      clearInterval(
        timer
      );

    };

  },[]);

  async function confirm(){

    setLoading(true);

    const response =

    await fetch(

      `/api/reservations/${params.id}/confirm`,

      {

        method:"POST"

      }

    );

    if(
      response.status===410
    ){

      alert(
        "Reservation expired"
      );

      router.push("/");

      return;

    }

    if(
      response.ok
    ){

      alert(
        "Purchase confirmed"
      );

      router.push("/");

    }

    setLoading(false);

  }

  async function cancel(){

    setLoading(true);

    await fetch(

      `/api/reservations/${params.id}/release`,

      {

        method:"POST"

      }

    );

    alert(
      "Reservation cancelled"
    );

    router.push("/");

  }

  return(

    <div
    className="p-8"
    >

      <h1
      className=

      "text-3xl font-bold"

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
      className="mt-3"
      >

        Time Remaining:

        {

        Math.floor(
          seconds/60
        )

        }

        :

        {

        String(

        seconds%60

        ).padStart(

        2,

        "0"

        )

        }

      </p>

      <div
      className=

      "mt-6 flex gap-3"

      >

        <button

        disabled={
          loading
        }

        onClick={
          confirm
        }

        className=

        "bg-green-500 text-white px-4 py-2 rounded"

        >

          Confirm Purchase

        </button>

        <button

        disabled={
          loading
        }

        onClick={
          cancel
        }

        className=

        "bg-red-500 text-white px-4 py-2 rounded"

        >

          Cancel

        </button>

      </div>

    </div>

  );

}