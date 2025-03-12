"use client";

import { useInbox } from "@/hooks/inbox/useInboxList";
import { format } from "date-fns";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VscVerifiedFilled } from "react-icons/vsc";

export default function InboxList() {
  const { inboxes, userProfiles, getOtherParticipant } = useInbox();

  return (
    <section className="flex w-full justify-center">
      <ul className="w-full">
        {inboxes.map((inbox) => {
          const otherParticipantId = getOtherParticipant(inbox.participants);
          const otherParticipantProfile =
            userProfiles[otherParticipantId || ""];

          const lastMessageTime = inbox.lastMessageTime
            ? format(inbox.lastMessageTime.toDate(), "p")
            : "";

          return (
            <li key={inbox.id} className="border-b p-2 w-full hover:bg-accent">
              {otherParticipantProfile ? (
                <Link href={`/inbox/${otherParticipantProfile.uid}`}  >
                 <div className="flex items-center gap-2" >
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={`/api/proxy?url=${encodeURIComponent(
                        otherParticipantProfile.photoURL
                      )}`}
                      alt={otherParticipantProfile.username}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {otherParticipantProfile.displayName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <p> {otherParticipantProfile.username}:</p>
                  {otherParticipantProfile.isVerified && (
                    <VscVerifiedFilled className=" text-blue-500" />
                  )}
</div>
                  <div>
                    <span className="opacity-60">{inbox.lastMessage}</span>
                    {lastMessageTime && (
                      <small className="float-end"> {lastMessageTime}</small>
                    )}
                  </div>

                  <p>
                    {inbox.unreadCounts[inbox.id] > 0 && (
                      <span> ({inbox.unreadCounts[inbox.id]} unread)</span>
                    )}
                  </p>
                </Link>
              ) : (
                <span className="flex justify-center">
                  {" "}
                  <Spinner />{" "}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
