export type BlogCategory = "shipping" | "driving" | "news";

export const blogCategories: { value: BlogCategory; label: string }[] = [
  { value: "shipping", label: "Shipping guides" },
  { value: "driving", label: "Driver tips" },
  { value: "news", label: "Haulr news" },
];

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; title: string; text: string };

export type Author = { name: string; role: string };

export type CoverIcon =
  | "car"
  | "enclosed"
  | "sofa"
  | "checklist"
  | "route"
  | "offer"
  | "shield";

export type Post = {
  slug: string;
  category: BlogCategory;
  title: string;
  excerpt: string;
  author: Author;
  /** ISO date. */
  published: string;
  cover: CoverIcon;
  body: Block[];
};

const authors = {
  maya: { name: "Maya Chen", role: "Operations, Haulr" },
  daniel: { name: "Daniel Brooks", role: "Driver success, Haulr" },
} satisfies Record<string, Author>;

export const posts: Post[] = [
  {
    slug: "what-sets-the-price-of-shipping-a-car",
    category: "shipping",
    title: "What actually sets the price of shipping a car",
    excerpt:
      "Distance matters, but it’s only one part of the quote. Here’s what drivers weigh when they price your car, and how to get better offers.",
    author: authors.maya,
    published: "2026-10-12",
    cover: "car",
    body: [
      {
        type: "p",
        text: "Two people shipping the same car the same distance can get very different quotes. That’s not random. Drivers price each job around the cost and effort of fitting it into a trip, and a handful of details move that number more than anything else.",
      },
      { type: "h2", id: "distance-and-route", text: "Distance and route" },
      {
        type: "p",
        text: "Longer trips cost more in total, but usually less per mile. A cross-country run spreads fuel, tolls, and time over many miles, while a short trip still carries the fixed effort of loading, unloading, and paperwork.",
      },
      {
        type: "p",
        text: "The route matters too. Pickups near major highways and busy corridors are easier to fit into a driver’s schedule. Rural or out-of-the-way addresses can add time, so they often cost a little more.",
      },
      { type: "h2", id: "vehicle-size", text: "Vehicle size and condition" },
      {
        type: "p",
        text: "Car carriers are limited by both space and weight. A full-size pickup or SUV takes up more of the trailer than a compact sedan, so it usually costs more to move.",
      },
      {
        type: "p",
        text: "Condition matters as well. A car that runs and drives can be driven onto the trailer. A non-running car needs a winch or a different loading setup, which takes extra equipment and time. Always say up front if the car doesn’t run.",
      },
      { type: "h2", id: "trailer-type", text: "Open or enclosed trailer" },
      {
        type: "p",
        text: "Open carriers move most cars and are the most affordable option. Enclosed trailers protect the car from weather and road debris, but they carry fewer vehicles per trip, so they cost more. Enclosed transport is worth it for classic, luxury, or freshly restored cars.",
      },
      { type: "h2", id: "timing", text: "Timing and flexibility" },
      {
        type: "p",
        text: "A tight pickup window limits which drivers can take the job. Giving a few days of flexibility lets more drivers fit your car into a trip they’re already making, which usually means more offers and lower prices.",
      },
      {
        type: "p",
        text: "Seasons play a part too. Demand on some routes rises at certain times of year, such as when people move south for the winter, and prices on those routes can follow.",
      },
      {
        type: "tip",
        title: "Get better offers on Haulr",
        text: "Add clear photos, say whether the car runs, and give a pickup window of at least three days. Complete listings get more offers, and drivers can price them with fewer unknowns.",
      },
      { type: "h2", id: "summary", text: "The short version" },
      {
        type: "ul",
        items: [
          "Longer trips cost more in total but less per mile.",
          "Bigger and non-running vehicles cost more to move.",
          "Enclosed trailers cost more than open ones.",
          "Flexible dates bring in more offers.",
        ],
      },
    ],
  },
  {
    slug: "open-vs-enclosed-car-transport",
    category: "shipping",
    title: "Open vs. enclosed car transport: which one do you need?",
    excerpt:
      "Most cars travel on open trailers without a problem. Here’s when the extra protection of an enclosed trailer is worth paying for.",
    author: authors.maya,
    published: "2026-10-05",
    cover: "enclosed",
    body: [
      {
        type: "p",
        text: "When you post a car on Haulr, one of the first choices is the trailer type. Both options get your car there safely. The difference is how much it’s exposed along the way, and what that protection costs.",
      },
      { type: "h2", id: "open-trailers", text: "Open trailers" },
      {
        type: "p",
        text: "Open carriers are the multi-level trailers you see on the highway. They’re the most common way to ship a car, which makes them easier to book and more affordable.",
      },
      {
        type: "ul",
        items: [
          "Best for everyday cars, trucks, and SUVs",
          "More drivers and more routes, so pickup is often sooner",
          "The car is exposed to weather and road dust, much like daily driving",
        ],
      },
      { type: "h2", id: "enclosed-trailers", text: "Enclosed trailers" },
      {
        type: "p",
        text: "Enclosed trailers fully cover the car. Many use liftgates or low ramps, which helps with cars that sit low to the ground.",
      },
      {
        type: "ul",
        items: [
          "Best for classic, exotic, luxury, or newly restored cars",
          "Protects against rain, hail, sun, and stone chips",
          "Fewer trailers on the road, so allow more time to book",
        ],
      },
      {
        type: "h2",
        id: "how-to-choose",
        text: "How to choose",
      },
      {
        type: "p",
        text: "Ask yourself one question: would a layer of road dust or a stone chip be a real problem? If the answer is no, an open trailer is the practical choice. If the car has paint you’d rather not risk, or its value depends on its condition, choose enclosed.",
      },
      {
        type: "tip",
        title: "Not sure? Post with “open is fine”",
        text: "You can say open is fine and still accept an enclosed offer if one comes in at a price you like. Drivers with both trailer types will see your listing.",
      },
    ],
  },
  {
    slug: "prepare-furniture-for-long-distance-shipping",
    category: "shipping",
    title: "How to prepare furniture for long-distance shipping",
    excerpt:
      "A little prep before pickup protects your furniture and makes loading faster. Measure, take apart, wrap, and label. Here’s how.",
    author: authors.maya,
    published: "2026-09-28",
    cover: "sofa",
    body: [
      {
        type: "p",
        text: "Furniture is awkward to move: heavy, oddly shaped, and easy to scratch. Most damage happens during loading and unloading, not on the road, so the goal of prep is to make every piece easier and safer to handle.",
      },
      { type: "h2", id: "measure", text: "Measure first" },
      {
        type: "p",
        text: "Measure each large piece and the doorways, hallways, and stairs it needs to pass through at both ends. Add the dimensions and approximate weight to your listing so drivers can bring the right equipment and enough help.",
      },
      { type: "h2", id: "disassemble", text: "Take apart what you can" },
      {
        type: "ul",
        items: [
          "Remove legs from tables, sofas, and beds",
          "Take out drawers and shelves, or tape them shut",
          "Remove glass panels and mirrors and wrap them on their own",
          "Put screws and bolts in a labeled bag and tape it to the piece",
        ],
      },
      { type: "h2", id: "wrap", text: "Wrap everything" },
      {
        type: "p",
        text: "Moving blankets are the best protection for wood and upholstery. Hold them in place with stretch wrap or tape on the blanket, never directly on finished surfaces. Add cardboard corner guards to tables and dressers.",
      },
      {
        type: "p",
        text: "For upholstered pieces, a plastic cover underneath the blanket keeps out dust and moisture. Leave a small gap at the bottom so the fabric can breathe on long trips.",
      },
      { type: "h2", id: "document", text: "Document condition" },
      {
        type: "p",
        text: "Take clear photos of each piece from several angles before pickup, including any existing scratches. Haulr drivers also take photos at pickup and delivery, and having both makes any question about damage simple to settle.",
      },
      {
        type: "tip",
        title: "Tell drivers about stairs",
        text: "Say how many flights of stairs there are at each end and whether there’s an elevator. It changes how many people a driver brings, and that changes the price.",
      },
    ],
  },
  {
    slug: "car-pickup-checklist",
    category: "shipping",
    title: "Getting your car ready for pickup: a simple checklist",
    excerpt:
      "Ten minutes of prep the day before makes pickup quick and keeps your records clear. Use this checklist before the driver arrives.",
    author: authors.daniel,
    published: "2026-09-19",
    cover: "checklist",
    body: [
      {
        type: "p",
        text: "Pickup goes fastest when the car is ready to load the moment the driver arrives. Run through this list the day before.",
      },
      { type: "h2", id: "inside", text: "Inside the car" },
      {
        type: "ol",
        items: [
          "Remove personal items. They aren’t covered during transport and add weight.",
          "Take out toll tags and parking passes so you aren’t charged along the route.",
          "Leave about a quarter tank of fuel. That’s enough to load and unload without adding weight.",
          "Turn off or disable any car alarm, or tell the driver how to switch it off.",
        ],
      },
      { type: "h2", id: "outside", text: "Outside the car" },
      {
        type: "ol",
        items: [
          "Wash the car so any existing scratches and dents are easy to see.",
          "Take dated photos of every side, the roof, and the wheels.",
          "Fold in mirrors and remove or secure loose parts, like spoilers or roof racks.",
          "Check the tires and battery so the car can be driven on and off the trailer.",
        ],
      },
      { type: "h2", id: "at-pickup", text: "At pickup" },
      {
        type: "p",
        text: "Walk around the car with the driver and agree on its condition before it’s loaded. Hand over one set of keys, and keep your own copy of the inspection report.",
      },
      {
        type: "tip",
        title: "Mention leaks or quirks",
        text: "If the car leaks fluid, pulls hard, or has a tricky starter, tell the driver ahead of time. They can load it in a spot where a drip won’t reach other cars.",
      },
    ],
  },
  {
    slug: "fill-empty-miles-on-return-trips",
    category: "driving",
    title: "How to fill empty miles on your return trip",
    excerpt:
      "Driving home empty costs you fuel and time. Here’s how to plan backhauls and share space on trips you’re already making.",
    author: authors.daniel,
    published: "2026-10-09",
    cover: "route",
    body: [
      {
        type: "p",
        text: "Every mile you drive with an empty trailer is a mile you pay for and don’t get paid for. Industry folks call it deadhead. You can’t get rid of it completely, but a little planning cuts it down a lot.",
      },
      {
        type: "h2",
        id: "plan-early",
        text: "Plan the return before you leave",
      },
      {
        type: "p",
        text: "As soon as you book a job, look at where it drops off. Search for shipments that pick up near that city and head back toward home, or toward your next job.",
      },
      { type: "h2", id: "share-space", text: "Post your route as truck space" },
      {
        type: "p",
        text: "On Haulr you can post a trip you’re already making, with your dates and how much room you have. Shippers on that route can book a spot directly. It works well for partial loads, like a sofa or a few boxes, that wouldn’t justify a trip on their own.",
      },
      { type: "h2", id: "widen-search", text: "Widen your search a little" },
      {
        type: "ul",
        items: [
          "Look at pickups within a short detour of your route, not just in the exact city",
          "Be flexible by a day or two on pickup dates",
          "Consider smaller jobs that fit around what’s already on the trailer",
        ],
      },
      { type: "h2", id: "price-it-right", text: "Price backhauls to win" },
      {
        type: "p",
        text: "A load on a trip you’re driving anyway doesn’t need to cover the whole cost of the drive. Even a modest price beats an empty trailer, and competitive offers on return legs help you build ratings and repeat customers.",
      },
      {
        type: "tip",
        title: "Post your space early",
        text: "Shippers plan ahead too. Posting your return trip as soon as your outbound job is booked gives them more time to find and book a spot.",
      },
    ],
  },
  {
    slug: "writing-offers-that-win",
    category: "driving",
    title: "Writing offers that win: a guide for drivers",
    excerpt:
      "The lowest price doesn’t always get the job. Shippers pick the driver they trust. Here’s how to write offers that stand out.",
    author: authors.daniel,
    published: "2026-09-24",
    cover: "offer",
    body: [
      {
        type: "p",
        text: "Shippers compare more than numbers. Many pick a driver based on ratings, reviews, delivery time, and how clearly they communicate. A good offer answers their questions before they ask.",
      },
      { type: "h2", id: "be-specific", text: "Be specific" },
      {
        type: "p",
        text: "Mention details from the listing so the shipper knows you read it. If it says the car is in a gated lot, say you’ll call 30 minutes ahead. If there are stairs, say how many people you’re bringing.",
      },
      { type: "h2", id: "realistic-dates", text: "Give realistic dates" },
      {
        type: "p",
        text: "Promise a delivery date you can actually hit. Being a day late on a promise hurts more than quoting an honest date up front, and on-time deliveries build the reviews that win future jobs.",
      },
      { type: "h2", id: "show-trust", text: "Show why they can trust you" },
      {
        type: "ul",
        items: [
          "Get verified and keep your insurance details up to date",
          "Add clear photos of your truck and trailer",
          "Mention relevant experience, like enclosed transport or piano moves",
        ],
      },
      { type: "h2", id: "respond-fast", text: "Respond quickly" },
      {
        type: "p",
        text: "Shippers often decide within a day or two of posting. Offers that arrive early, and quick answers to questions, keep you at the top of their list.",
      },
      {
        type: "tip",
        title: "Use the message field",
        text: "Two or three short sentences are enough: when you can pick up, how you’ll handle the item, and anything from the listing you’ve planned for.",
      },
    ],
  },
  {
    slug: "how-payment-protection-works",
    category: "news",
    title: "How payment protection works on Haulr",
    excerpt:
      "Shippers pay a deposit when they book and the rest after delivery. Drivers are paid once delivery is confirmed. Here’s the full flow.",
    author: authors.maya,
    published: "2026-09-15",
    cover: "shield",
    body: [
      {
        type: "p",
        text: "Every booking on Haulr includes payment protection. It’s designed so shippers don’t pay in full until their item arrives, and drivers know the money is there before they start driving.",
      },
      { type: "h2", id: "booking", text: "When you book" },
      {
        type: "p",
        text: "The shipper pays a deposit when they accept an offer. That confirms the booking and shares pickup details with the driver.",
      },
      { type: "h2", id: "delivery", text: "At delivery" },
      {
        type: "p",
        text: "The driver takes photos at pickup and delivery and marks the job as delivered. The shipper then pays the rest and confirms everything arrived as expected.",
      },
      { type: "h2", id: "payout", text: "Driver payouts" },
      {
        type: "p",
        text: "Drivers are paid within 2 business days after the delivery is confirmed. A small fee is taken only on booked jobs. Posting shipments and sending offers are always free.",
      },
      { type: "h2", id: "disputes", text: "If something goes wrong" },
      {
        type: "p",
        text: "Either side can open a dispute from their dashboard. Our team reviews the listing, messages, and the pickup and delivery photos, and helps both sides reach a fair outcome.",
      },
      {
        type: "tip",
        title: "Keep everything on Haulr",
        text: "Payment protection only covers bookings paid through Haulr. Never pay a driver directly or move a conversation off the platform before booking.",
      },
    ],
  },
];

const longDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPublished(iso: string) {
  return longDate.format(new Date(`${iso}T00:00:00Z`));
}

/** Reading time at about 220 words a minute. */
export function readingTime(post: Post) {
  const words = post.body
    .flatMap((b) =>
      "items" in b ? b.items : "title" in b ? [b.title, b.text] : [b.text],
    )
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function categoryLabel(category: BlogCategory) {
  return blogCategories.find((c) => c.value === category)?.label ?? "";
}

/** Newest first. */
export const sortedPosts = [...posts].sort((a, b) =>
  b.published.localeCompare(a.published),
);
