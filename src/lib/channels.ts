import { getPlace } from "@/data";

export function resolveChannels(slug: string): string[] {
  const place = getPlace(slug);
  if (place) return place.channels;
  return [slug, "amistad", "chatzona"];
}

export function channelString(channels: string[]): string {
  return channels.map((c) => `#${c}`).join(",");
}
