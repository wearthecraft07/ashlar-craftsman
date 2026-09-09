import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Put Your Sticker on a Shirt",
  description:
    "Turn your Ashlar Craftsman sticker into a wearable shirt design — your character, your placement, your shirt.",
};

const ShirtCustomizer = dynamic(
  () =>
    import("@/components/stickers/ShirtCustomizer").then(
      (m) => m.ShirtCustomizer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 pt-28">
        <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]">
          Preparing your shirt…
        </p>
      </div>
    ),
  },
);

export default function ShirtCustomizerPage() {
  return <ShirtCustomizer />;
}
