export const SITE_NAME = "Zirwa Qurbani Service";
export const SITE_URL = "https://zirwaqurbani.com";
export const WHATSAPP_NUMBER = "919844611300"; // update with real number

export const EMAIL_UK = "info@zirwaqurbani.uk";
export const EMAIL_IN = "info@zirwaqurbani.in";

export function getEmail(region: string): string {
  return region === "uk" ? EMAIL_UK : EMAIL_IN;
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/#packages" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/#contact" },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  slaughter_scheduled: "Slaughter Scheduled",
  slaughtered: "Slaughtered",
  distributed: "Distributed",
  completed: "Completed",
};

export const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
];
