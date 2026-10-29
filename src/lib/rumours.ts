export interface Rumour {
  id: string;
  title: string;
  /** What is reported, kept short. No prices on purpose. */
  summary: string;
  sources: ReadonlyArray<{ label: string; url: string }>;
}

/** Shown as a label above the list. These are reports and leaks, not announcements. */
export const RUMOUR_NOTE = "Rumoured, not confirmed. Dates and specs can change. No prices are known.";

/** Reported upcoming hardware, researched 29 Oct 2026. Details in buildrig-research.md. */
export const RUMOURS: readonly Rumour[] = [
  {
    id: "zen6",
    title: "AMD Zen 6 desktop CPUs (Ryzen 10000, Olympic Ridge)",
    summary: "Reported for 2027, possibly shown at CES 2027. AMD documents say it stays on socket AM5. Reported specs: up to 24 cores and 2 nm.",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/351994/amd-confirms-am5-compatibility-with-olympic-ridge-desktop-zen-6" },
      { label: "Tom's Hardware", url: "https://www.tomshardware.com/pc-components/cpus/amd-zen-6-and-intel-nova-lake-cpus-reportedly-arriving-late-delayed-to-ces-2027-next-gen-chips-rocked-by-industry-turmoil" }
    ]
  },
  {
    id: "nova-lake",
    title: "Intel Nova Lake-S (Core Ultra 400)",
    summary: "New LGA1954 socket, so new motherboards. First retail CPUs rumoured for Q1 2027 with up to 28 cores, a 52-core model later in 2027.",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/352121/intel-confirms-lga1954-as-the-socket-for-nova-lake-s-processors-through-internal-tools" },
      { label: "Tom's Hardware", url: "https://www.tomshardware.com/pc-components/cpus/intels-core-ultra-400-nova-lake-launch-schedule-leaks-out-mass-production-in-q4-first-nova-lake-cpus-in-q1-2027" }
    ]
  },
  {
    id: "rtx50-super",
    title: "NVIDIA RTX 50 Super refresh",
    summary: "Reportedly delayed or on hold because of GDDR7 and memory costs. It may still arrive late 2026 or in 2027. Not confirmed by NVIDIA.",
    sources: [{ label: "TrendForce", url: "https://www.trendforce.com/news/2026/10/29/insights-nvidia-rtx-60-may-slip-to-2028-amd-rdna-5-also-in-question-why-are-gaming-gpu-cycles-slowing/" }]
  },
  {
    id: "rtx60",
    title: "NVIDIA RTX 60 series (Rubin)",
    summary: "A leaker claims it may not come before 2028, with the RTX 6060 possibly in 2029. Not announced.",
    sources: [
      { label: "Tom's Hardware", url: "https://www.tomshardware.com/pc-components/gpus/nvidias-next-gen-rtx-60-gpus-might-not-be-released-until-2028-prominent-leaker-claims-gaming-takes-a-back-seat-as-company-focuses-on-delivering-data-center-products" },
      { label: "TechSpot", url: "https://www.techspot.com/news/114263-nvidia-rtx-6060-probably-wont-arrive-until-2029.html" }
    ]
  },
  {
    id: "rdna5",
    title: "AMD RDNA 5 Radeon graphics cards",
    summary: "A new GPU architecture seen in AMD code. Desktop cards are rumoured for the second half of 2027, mid-range first, higher tiers in 2028.",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/353626/amd-rdna-5-likely-scheduled-for-second-half-of-2027" },
      { label: "TechSpot", url: "https://www.techspot.com/news/114182-amd-rdna-5-graphics-cards-tipped-arrive-late.html" }
    ]
  }
];
