import { Sparkles } from "lucide-react";

type Props = {
  phase: string;
};

/** 未実装ページの仮ブロック。 */
export function ComingSoon({ phase }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-white p-12 text-center shadow-card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint-softer">
        <Sparkles className="h-6 w-6 text-mint-dark" />
      </div>
      <h2 className="text-lg font-semibold text-ink">まもなく実装されます</h2>
      <p className="mt-2 text-sm text-ink-soft">
        この画面は「{phase}」で作成予定です。
      </p>
    </div>
  );
}
