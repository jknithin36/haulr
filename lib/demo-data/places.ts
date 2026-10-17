export type Place = { code: string; label: string; lat: number; lng: number };

export const city = {
  losAngeles: {
    code: "LA",
    label: "Los Angeles, CA",
    lat: 34.0522,
    lng: -118.2437,
  },
  newYork: { code: "NYC", label: "New York, NY", lat: 40.7128, lng: -74.006 },
  austin: { code: "AUS", label: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  denver: { code: "DEN", label: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  chicago: { code: "CHI", label: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  atlanta: { code: "ATL", label: "Atlanta, GA", lat: 33.749, lng: -84.388 },
  seattle: { code: "SEA", label: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  phoenix: { code: "PHX", label: "Phoenix, AZ", lat: 33.4484, lng: -112.074 },
  miami: { code: "MIA", label: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  boston: { code: "BOS", label: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  dallas: { code: "DAL", label: "Dallas, TX", lat: 32.7767, lng: -96.797 },
  sanDiego: {
    code: "SD",
    label: "San Diego, CA",
    lat: 32.7157,
    lng: -117.1611,
  },
  portland: {
    code: "PDX",
    label: "Portland, OR",
    lat: 45.5152,
    lng: -122.6784,
  },
  sanFrancisco: {
    code: "SF",
    label: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
  },
  charlotte: {
    code: "CLT",
    label: "Charlotte, NC",
    lat: 35.2271,
    lng: -80.8431,
  },
  saltLakeCity: {
    code: "SLC",
    label: "Salt Lake City, UT",
    lat: 40.7608,
    lng: -111.891,
  },
  houston: { code: "HOU", label: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  nashville: {
    code: "NSH",
    label: "Nashville, TN",
    lat: 36.1627,
    lng: -86.7816,
  },
} satisfies Record<string, Place>;

/** Every known city, for pickers. */
export const places: Place[] = Object.values(city);

/** Rough driving miles: great-circle distance plus a typical road detour. */
export function roadMiles(a: Place, b: Place) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const crow = 2 * 3958.8 * Math.asin(Math.sqrt(h));
  return Math.round((crow * 1.15) / 10) * 10;
}
