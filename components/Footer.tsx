export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-[12px] text-mist-400">
        <div>
          데이터는{" "}
          <a
            className="text-white hover:underline"
            href="https://docs.blackhaven.xyz/overview"
            target="_blank"
            rel="noreferrer"
          >
            docs.blackhaven.xyz
          </a>
          의 메커니즘에 기반한 베스트케이스 시나리오입니다.{" "}
          <span className="text-white">투자 권유나 보장 수익이 아닙니다.</span>
        </div>
        <span className="kbd">© Adventale</span>
      </div>
    </footer>
  );
}
