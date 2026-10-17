export type ChatMessage = {
  id: string;
  /** "me" is Sarah, the signed-in user. */
  from: "me" | "them";
  text: string;
  /** Display time, e.g. "Oct 20, 9:42 AM". */
  time: string;
  attachment?: string;
};

export type Conversation = {
  id: string;
  person: string;
  /** Job/shipment/trip id, e.g. "SHP-1042". */
  ref: string;
  item: string;
  lastTime: string;
  unread: number;
  /** Optional context strip shown above the chat. */
  context?: {
    title: string;
    status: string;
    href: string;
    linkLabel: string;
  };
  messages: ChatMessage[];
};

export const conversations: Conversation[] = [
  {
    id: "mike-reed",
    person: "Mike Reed",
    ref: "SHP-1042",
    item: "Honda Civic",
    lastTime: "2h ago",
    unread: 1,
    context: {
      title: "2019 Honda Civic",
      status: "In transit",
      href: "/dashboard/tracking",
      linkLabel: "View shipment",
    },
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Picked up your car. Photos are uploaded.",
        time: "Oct 20, 9:42 AM",
      },
      {
        id: "m2",
        from: "me",
        text: "Thank you! Looks great.",
        time: "Oct 20, 9:50 AM",
      },
      {
        id: "m3",
        from: "them",
        text: "Passing Oklahoma City now, all good. Still on track for Oct 26.",
        time: "Oct 22, 8:31 AM",
      },
    ],
  },
  {
    id: "daniel-kim",
    person: "Daniel Kim",
    ref: "TRP-310",
    item: "Sofa",
    lastTime: "5h ago",
    unread: 1,
    messages: [
      {
        id: "d1",
        from: "them",
        text: "Hi Sarah, I just booked space on your Dallas to Chicago trip for my sofa.",
        time: "Oct 21, 4:12 PM",
      },
      {
        id: "d2",
        from: "me",
        text: "Got it, thanks Daniel. I load up on the morning of the 24th.",
        time: "Oct 21, 4:30 PM",
      },
      {
        id: "d3",
        from: "them",
        text: "Can I drop it off the night before?",
        time: "Oct 22, 5:05 AM",
      },
    ],
  },
  {
    id: "jordan-lee",
    person: "Jordan Lee",
    ref: "JOB-512",
    item: "Treadmill",
    lastTime: "1d ago",
    unread: 0,
    messages: [
      {
        id: "j1",
        from: "me",
        text: "Hi Jordan, I can pick up the treadmill this Saturday morning. Does 9 work?",
        time: "Oct 20, 6:18 PM",
      },
      {
        id: "j2",
        from: "them",
        text: "9 is perfect. It's in the garage, so you can back right up.",
        time: "Oct 20, 6:40 PM",
      },
      {
        id: "j3",
        from: "them",
        text: "See you Saturday at 9!",
        time: "Oct 21, 10:02 AM",
      },
    ],
  },
  {
    id: "luis-martinez",
    person: "Luis Martinez",
    ref: "SHP-1057",
    item: "Dining table",
    lastTime: "1d ago",
    unread: 0,
    messages: [
      {
        id: "l1",
        from: "them",
        text: "Hi Sarah, I sent an offer on your dining table and chairs. I've moved a few sets like this one.",
        time: "Oct 21, 9:15 AM",
      },
      {
        id: "l2",
        from: "them",
        text: "Happy to answer any questions.",
        time: "Oct 21, 9:16 AM",
      },
    ],
  },
];
