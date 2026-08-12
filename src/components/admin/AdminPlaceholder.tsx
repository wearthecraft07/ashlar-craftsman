export function AdminPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/55">{subtitle}</p>
      <div className="mt-8 rounded-[1.5rem] border border-dashed border-[var(--gold)]/35 bg-[var(--gold)]/5 p-8 text-sm text-[var(--gold)]">
        Schema and admin navigation are ready. Full CRUD for this section lands
        in the next implementation phase — the database tables already exist in{" "}
        <code className="text-white/80">supabase/schema.sql</code>.
      </div>
    </div>
  );
}
