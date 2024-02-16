import { IEvent } from "@/lib/database/models/event.model";
import React from "react";

type CheckOutProps = {
  event: IEvent;
  userId: string;
};

function CheckOut({ event, userId }: CheckOutProps) {
  const onCheckOut = async () => {
    console.log("CHCECK OUT");
  };

  return <form action={onCheckOut} method="post"></form>;
}

export default CheckOut;
