export const vehicleKinds = [
  { value: "box", label: "Box truck", capacity: "cuft" },
  { value: "van", label: "Cargo van", capacity: "cuft" },
  { value: "pickup", label: "Pickup truck", capacity: "weight" },
  { value: "flatbed", label: "Flatbed", capacity: "weight" },
  { value: "car-carrier", label: "Open car carrier", capacity: "cars" },
  { value: "enclosed", label: "Enclosed trailer", capacity: "cars" },
] as const;

export type VehicleKind = (typeof vehicleKinds)[number]["value"];

type VehicleStatus = "Verified" | "Pending review";

export type Vehicle = {
  id: string;
  name: string;
  kind: VehicleKind;
  /** Shown under the name, e.g. "16 ft box truck". */
  type: string;
  capacity: string;
  plate: string;
  insurance: string;
  status: VehicleStatus;
  /** Front photo, when the vehicle was added in this session. */
  photo?: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "VEH-1",
    name: "2020 Isuzu NPR",
    kind: "box",
    type: "16 ft box truck",
    capacity: "800 cu ft · 6,500 lb",
    plate: "TX 4RD-8812",
    insurance: "Up to $100,000 · expires Mar 2027",
    status: "Verified",
  },
  {
    id: "VEH-2",
    name: "2022 Big Tex 70CH",
    kind: "car-carrier",
    type: "2-car open trailer",
    capacity: "2 cars",
    plate: "TX 9TL-0457",
    insurance: "Up to $150,000 · expires Jan 2027",
    status: "Pending review",
  },
];

export const usStates = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
] as const;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2027-03-14" → "Mar 2027". */
export function monthYear(iso: string) {
  const [y, m] = iso.split("-");
  return `${months[Number(m) - 1]} ${y}`;
}
