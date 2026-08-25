import { __ } from "@wordpress/i18n";
import { TEXT_DOMAIN } from "./utils";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

const days = [
  __("Sunday", TEXT_DOMAIN),
  __("Monday", TEXT_DOMAIN),
  __("Tuesday", TEXT_DOMAIN),
  __("Wednesday", TEXT_DOMAIN),
  __("Thursday", TEXT_DOMAIN),
  __("Friday", TEXT_DOMAIN),
  __("Saturday", TEXT_DOMAIN),
];

export function formatDay(day: number): string {
  return days[day] || "";
}

export function formatTime(time: number | null): string {
  if (!time) {
    return "";
  }
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
