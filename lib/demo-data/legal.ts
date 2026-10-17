// DRAFT: The legal text in this file is a plain-English draft written for the
// product prototype. It has not been reviewed and must be reviewed by a lawyer
// before launch.

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "contact"; text: string; email: string };

type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const terms: LegalDoc = {
  title: "Terms of service",
  updated: "Oct 1, 2026",
  intro:
    "These terms explain the rules for using Haulr. By creating an account, you agree to them.",
  sections: [
    {
      id: "your-account",
      title: "Your account",
      blocks: [
        {
          type: "p",
          text: "You must be 18 or older to create a Haulr account.",
        },
        {
          type: "p",
          text: "Keep your name, contact details, and other account information accurate and up to date, and keep your login details to yourself. You’re responsible for what happens under your account.",
        },
      ],
    },
    {
      id: "how-haulr-works",
      title: "How Haulr works",
      blocks: [
        {
          type: "p",
          text: "Haulr connects people who need something shipped (shippers) with people who have room to carry it (drivers). We provide the place to post shipments, send offers, and arrange bookings.",
        },
        {
          type: "p",
          text: "Drivers are independent. They are not Haulr employees, and they decide which jobs to take and what to charge.",
        },
      ],
    },
    {
      id: "posting-shipments",
      title: "Posting shipments",
      blocks: [
        {
          type: "p",
          text: "When you post a shipment, describe your items honestly, including their size, weight, and condition, so drivers know what they’re agreeing to carry.",
        },
        {
          type: "p",
          text: "Don’t post illegal or dangerous items. See Prohibited items below for the full list.",
        },
      ],
    },
    {
      id: "offers-and-bookings",
      title: "Offers and bookings",
      blocks: [
        {
          type: "p",
          text: "Drivers send offers on shipments. When a shipper accepts an offer, it becomes an agreement between that shipper and that driver to complete the job on the terms in the offer.",
        },
      ],
    },
    {
      id: "payments-and-fees",
      title: "Payments and fees",
      blocks: [
        {
          type: "p",
          text: "Haulr takes a fee on each booking. The fee is shown before you confirm.",
        },
        {
          type: "p",
          text: "Drivers are paid after the delivery is confirmed.",
        },
      ],
    },
    {
      id: "cancellations",
      title: "Cancellations",
      blocks: [
        {
          type: "p",
          text: "You can cancel a booking for free up to 48 hours before pickup.",
        },
        {
          type: "p",
          text: "Cancellations made later than that may have a fee.",
        },
      ],
    },
    {
      id: "damage-and-disputes",
      title: "Damage and disputes",
      blocks: [
        {
          type: "p",
          text: "Drivers are responsible for items while they are in their care, from pickup until delivery.",
        },
        {
          type: "p",
          text: "If something goes wrong, let us know. Disputes between shippers and drivers are reviewed by our team.",
        },
      ],
    },
    {
      id: "prohibited-items",
      title: "Prohibited items",
      blocks: [
        { type: "p", text: "You can’t ship any of the following on Haulr:" },
        {
          type: "ul",
          items: [
            "Weapons",
            "Hazardous materials",
            "Illegal goods",
            "Live animals",
          ],
        },
      ],
    },
    {
      id: "ending-your-account",
      title: "Ending your account",
      blocks: [
        {
          type: "p",
          text: "We may suspend accounts that break these rules.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "contact",
          text: "Questions about these terms? Email us at",
          email: "support@haulr.com",
        },
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  title: "Privacy policy",
  updated: "Oct 1, 2026",
  intro:
    "Your privacy matters to us. This page explains what we collect and how we use it.",
  sections: [
    {
      id: "what-we-collect",
      title: "What we collect",
      blocks: [
        {
          type: "p",
          text: "We collect the information you give us when you use Haulr:",
        },
        {
          type: "ul",
          items: [
            "Your name, email, and phone number",
            "Pickup and delivery addresses",
            "Vehicle details, if you drive",
            "Payment information",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      blocks: [
        {
          type: "p",
          text: "We use your information to run bookings, process payments, verify drivers, and keep Haulr safe for everyone.",
        },
      ],
    },
    {
      id: "what-we-share",
      title: "What we share",
      blocks: [
        {
          type: "p",
          text: "Your exact address goes only to the driver you book, so they can pick up and deliver your items.",
        },
        {
          type: "p",
          text: "Payment details are handled by our payment provider.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          type: "p",
          text: "We use cookies to keep you logged in and to understand how the site is used.",
        },
      ],
    },
    {
      id: "your-choices",
      title: "Your choices",
      blocks: [
        {
          type: "p",
          text: "You can update or delete your data anytime in your settings.",
        },
      ],
    },
    {
      id: "keeping-data-safe",
      title: "Keeping data safe",
      blocks: [
        {
          type: "p",
          text: "We use encryption and secure storage to protect your information.",
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          type: "p",
          text: "Haulr is not for people under 18.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "contact",
          text: "Questions about your privacy? Email us at",
          email: "privacy@haulr.com",
        },
      ],
    },
  ],
};
