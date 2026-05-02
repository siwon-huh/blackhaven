export default function SiteFooter() {
  return (
    <footer className="border-t hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6 text-[12px] text-ink-400">
        <div className="leading-relaxed">
          <div className="text-[13px] text-ink-100 font-medium">Blackhaven</div>
          <p className="mt-2 text-ink-300">
            MegaETH 위에 자리잡은 reserve-backed treasury 입니다. 본드, 락업, BAM, POL 의 결합으로 동작합니다.
          </p>
          <p className="mt-3 text-ink-400">
            본 페이지의 모든 수치는 forward-looking 시나리오와 라이브 데이터의 조합이며, 투자 권유나 보장 수익이 아닙니다.
          </p>
        </div>
        <div className="md:text-right space-y-2">
          <a
            className="block hover:text-ink-50"
            href="https://docs.blackhaven.xyz/overview"
            target="_blank"
            rel="noreferrer"
          >
            docs.blackhaven.xyz
          </a>
          <a
            className="block hover:text-ink-50"
            href="https://www.blackhaven.xyz"
            target="_blank"
            rel="noreferrer"
          >
            blackhaven.xyz
          </a>
          <span className="block kbd mt-3">© Adventale</span>
        </div>
      </div>
    </footer>
  );
}
