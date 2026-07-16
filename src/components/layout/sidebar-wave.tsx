/**
 * サイドバー下部に表示する、TELEMOロゴをイメージした細い波形装飾。
 */
export function SidebarWave() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 overflow-hidden"
    >
      <svg viewBox="0 0 260 160" preserveAspectRatio="none" className="h-full w-full">
        <path d="M-20 90 Q40 60 100 90 T220 90 T340 90" fill="none" stroke="#2FC7A2" strokeOpacity="0.35" strokeWidth="1.2" />
        <path d="M-20 110 Q50 80 120 110 T260 110 T400 110" fill="none" stroke="#18AA87" strokeOpacity="0.5" strokeWidth="1.2" />
        <path d="M-20 130 Q60 100 140 130 T280 130 T420 130" fill="none" stroke="#2FC7A2" strokeOpacity="0.25" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
