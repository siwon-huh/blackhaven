// Blackhaven 컨트랙트 주소 (MegaETH 메인넷).
// 사용자 검증된 컨트랙트들입니다.

export const BOND_CONTRACTS = {
  d7: "0xe5C0836bcd3A37627Fa95A432C7Dbb1b9c79e3df",
  d14: "0x28aF3CCb2DBc264A8b39E9361EF24f3FC84d83Fd",
  d30: "0x40f5F3654Db5F7F56cCe33caF0F7a0CAaaE57EAc",
} as const;

export const COMMIT_CONTRACT = "0x7c6773C78d22D8754A194f272232B33F0623F8d0";

// Stake 컨트랙트 + sRBT 토큰 주소가 알려지면 여기에 추가합니다.
// 현재는 Stake 페이지 TVL($42.05K) 과 Commit 24w reward(~15.8%) 가 정적 fallback 입니다.
export const STAKE_CONTRACT: string | null = null;
export const SRBT_TOKEN: string | null = null;

// RBT/USDm Kumbaya pool.
export const KUMBAYA_PAIR = "0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032";

// RBT 토큰 주소 (Reserve Backed Token, MegaETH).
export const RBT_TOKEN = "0x8F77A685bDe702E6d32A103e9AeB41906317D7e5";

// USDm 토큰 주소 (MegaUSD).
export const USDM_TOKEN = "0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7";

// 트레저리 컨트랙트. 본드 USDm 의 90퍼센트가 흘러 들어옵니다.
// USDm.balanceOf(TREASURY_CONTRACT) 로 라이브 reserves 측정 가능.
export const TREASURY_CONTRACT = "0xb59126f8a13f907f63e67cfc248160698ce41918";

// Liquidity Manager 후보. 본드 USDm 의 10퍼센트가 영구 LP 로 흘러 들어옵니다.
// 전체 주소는 추후 추가합니다.
export const LIQUIDITY_MANAGER: string | null = null;

// MegaETH mainnet (chain id 4326, MEGAETH-A1) RPC.
// 환경변수가 있으면 우선 사용합니다.
export const MEGAETH_CHAIN_ID = 4326;
export const MEGAETH_RPC =
  process.env.MEGAETH_RPC ?? "https://mainnet.megaeth.com/rpc";

export const BOND_DISCOUNT_BY_DAYS: Record<number, number> = {
  7: 5.0,
  14: 10.0,
  30: 15.0,
};
