import { getActiveAnnouncements } from "@/lib/content/site";

export async function AnnouncementBanner() {
  const announcements = await getActiveAnnouncements();
  const latest = announcements[0];
  if (!latest) return null;

  return (
    <div className="border-b border-[var(--gold)]/25 bg-[var(--lodge-blue)] px-4 py-2.5 text-center text-sm text-[var(--ivory)]">
      <span className="font-semibold text-[var(--gold)]">{latest.title}</span>
      {latest.body ? (
        <span className="text-[var(--ivory)]/80"> — {latest.body}</span>
      ) : null}
    </div>
  );
}
