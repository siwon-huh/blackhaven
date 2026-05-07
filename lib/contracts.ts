// Blackhaven 컨트랙트 매핑 (MegaETH mainnet, chain id 4326).
// 출처: 사용자 검증 + Zellic audit report + onchain selector probing.
// repo: https://github.com/blackhaven-xyz/blackhaven-factory

// ===== 토큰 =====
// RBT (Reserve Backed Token, ERC20)
export const RBT_TOKEN = "0x8F77A685bDe702E6d32A103e9AeB41906317D7e5";

// sRBT (Stacked RBT, ERC20). RBT 를 stake 하면 1:1 로 발행됩니다.
export const SRBT_TOKEN = "0x52117400f0815c1a3d4652111ac15fbb557b2277";

// USDm (MegaUSD, ERC20). 외부 토큰.
export const USDM_TOKEN = "0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7";

// aMegUSDm (Aave 이자 발생 wrapped USDm, ERC20).
// 트레저리가 USDm 을 Aave MegaETH 마켓에 예치하고 받은 aToken 으로,
// underlying 은 항상 1:1 redeem 보장 + 누적 이자가 붙습니다.
// 첫 예치 tx: 0xaff0b0212b73cfeb71630b3833c247b0356846e62119f1e65482809ea3eb7594
export const AMEG_USDM_TOKEN =
  "0x5dF82810CB4B8f3e0Da3c031cCc9208ee9cF9500";

// ===== 코어 컴포넌트 (audit 보고서 명시) =====
// BackingCalculator: NAV(), FDV(), mNAV(), singleNAV(token) view 함수 제공.
// multi-token backing 도 정확히 합산해 주는 진정한 라이브 NAV 소스.
export const BACKING_CALCULATOR =
  "0xc24f717410e68409603c3ac125032a47048666d8";

// BAM (Backing Arbitrage Module): collectPremium() 으로 양방향 차익거래.
export const BAM_CONTRACT = "0xac73cfc568533ddeb445c902b0989661d844cc8a";

// RBTNote: commit/lock NFT (ERC721). 사용자 commit position 을 NFT 로 발행.
// 사용자가 알려준 commit 컨트랙트 주소와 동일.
export const RBTNOTE_CONTRACT =
  "0x7c6773C78d22D8754A194f272232B33F0623F8d0";
export const COMMIT_CONTRACT = RBTNOTE_CONTRACT; // alias

// LiquidityManager: Uniswap V3 NFT 영구 보유. 본드 USDm 의 10퍼센트가 들어옵니다.
export const LIQUIDITY_MANAGER =
  "0x5d2512d0768ac21bc61732208be20389a7a2441d";

// Stake / Minter (probing 결과로 추정).
// 둘 모두 자체 RBT/USDm balance 가 0 이라 라이브 메트릭 직접 노출은 어렵습니다.
export const STAKE_CONTRACT = "0x1e11586ad6091f793d1d7d9659ecf2e3bd6ebb2d";
export const MINTER_CONTRACT = "0x6238672d016d278111113970fdf8ec833ebb702e";

// Oracle: BAM 이 reference 하는 가격 피드.
export const ORACLE_CONTRACT =
  "0x90196f6d52fce394c79d1614265d36d3f0033ccf";

// ===== 본드 컨트랙트 =====
export const BOND_CONTRACTS = {
  d7: "0xe5C0836bcd3A37627Fa95A432C7Dbb1b9c79e3df",
  d14: "0x28aF3CCb2DBc264A8b39E9361EF24f3FC84d83Fd",
  d30: "0x40f5F3654Db5F7F56cCe33caF0F7a0CAaaE57EAc",
} as const;

export const BOND_DISCOUNT_BY_DAYS: Record<number, number> = {
  7: 5.0,
  14: 10.0,
  30: 15.0,
};

// ===== 트레저리 / 자금 흐름 =====
// backingStorage: 본드 USDm 의 90퍼센트가 흘러 들어옵니다.
// BackingCalculator 의 backingStorage() 호출과 일치 검증됨.
export const TREASURY_CONTRACT =
  "0xb59126f8a13f907f63e67cfc248160698ce41918";

// ===== 인프라 =====
export const KUMBAYA_PAIR = "0x3fa634c81ee8aa78c4f37364e6feccb8a89c0032";

// 최초 deployer (EOA) 와 관리자 EOA, Proxy Factory.
export const DEPLOYER_EOA = "0x50b06b6baf85b408d5f9a2179f358a29db21767d";
export const ADMIN_EOA = "0xb53fae9998a2ecb5b3b9e71330fbcd2b2db85591";
export const PROXY_FACTORY = "0x4e1dcf7ad4e460cfd30791ccc4f9c8a4f820ec67";

// ===== 네트워크 =====
export const MEGAETH_CHAIN_ID = 4326;
export const MEGAETH_RPC =
  process.env.MEGAETH_RPC ?? "https://mainnet.megaeth.com/rpc";
