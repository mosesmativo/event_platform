"use client";

import { IEvent } from "@/lib/database/models/event.model";
import React from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Link from "next/link";
import CheckOut from "./CheckOut";

function CheckoutButton({ event }: { event: IEvent }) {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  // chcek if the event has finnished by comparing the event date with todays date
  const hasEventFinnished = new Date(event.endDateTime) < new Date();
  return (
    <div className="flex items-center gap-3">
      {/* cannot buy passed event */}
      {hasEventFinnished ? (
        <p className="p-2 text-red-400">
          Sorry Tickets are no longer available
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <CheckOut event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
}

export default CheckoutButton;
