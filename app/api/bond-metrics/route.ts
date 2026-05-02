// 본드 TVL 메트릭 server fetch.
// 현재는 정적 LIVE_BONDS 를 그대로 응답하지만 매 호출마다 fresh capturedAt 을 채웁니다.
// 컨트랙트 주소가 확보되면 onchain fetch 로 교체합니다.

import { NextResponse } from "next/server";
import { buildBondSnapshot } from "@/lib/bondMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = buildBondSnapshot();
  return NextResponse.json({ ok: true, ...snapshot });
}
