// Cities and Municipalities Competitiveness Index (CMCI) by the DTI's National Competitiveness Council,
// from https://cmci.dti.gov.ph (Plaridel (BU) in the data portal). The 2024 tables were taken from the
// public scrape at github.com/tca-codes/philippine-lgu-competitiveness; Plaridel's figures match its
// official CMCI profile page. Ranks are within the LGU's category; scores are out of 100 (20 per pillar,
// 2 per sub-indicator). Category averages and bests are computed from the same 2024 tables.

export const CMCI_YEAR = 2024;

export const category = { name: "1st–2nd class municipalities", count: 509 } as const;

export type Indicator = { name: string; score: number; categoryAverage: number };

export type Pillar = {
  key: string;
  name: string;
  score: number;
  rank: number;
  categoryAverage: number;
  categoryBest: number;
  indicators: Indicator[];
};

export const overall = {
  score: 35.5607,
  rank: 46,
  categoryAverage: 30.5669,
  categoryBest: 44.8114,
};

export const pillars: Pillar[] = [
  {
    key: "economic-dynamism",
    name: "Economic Dynamism",
    score: 3.6349,
    rank: 171,
    categoryAverage: 3.4122,
    categoryBest: 9.0696,
    indicators: [
      {
        name: "Local Economy Size",
        score: 0.1818,
        categoryAverage: 0.0285
      },
      {
        name: "Local Economy Growth",
        score: 0.0008,
        categoryAverage: 0.0083
      },
      {
        name: "Active Establishments in the Locality",
        score: 0.3022,
        categoryAverage: 0.2107
      },
      {
        name: "Safety Compliant Business",
        score: 0.2922,
        categoryAverage: 0.1727
      },
      {
        name: "Employment Generation",
        score: 0.3289,
        categoryAverage: 0.1177
      },
      {
        name: "Cost of Living",
        score: 0.3636,
        categoryAverage: 1.0326
      },
      {
        name: "Cost of Doing Business",
        score: 1.4821,
        categoryAverage: 1.4882
      },
      {
        name: "Financial Deepening",
        score: 0.294,
        categoryAverage: 0.193
      },
      {
        name: "Productivity",
        score: 0.3799,
        categoryAverage: 0.081
      },
      {
        name: "Presence of Business and Professional Organizations",
        score: 0.0094,
        categoryAverage: 0.0795
      }
    ]
  },
  {
    key: "government-efficiency",
    name: "Government Efficiency",
    score: 9.4777,
    rank: 43,
    categoryAverage: 8.2361,
    categoryBest: 11.9473,
    indicators: [
      {
        name: "Compliance to National Directives",
        score: 1.92,
        categoryAverage: 1.8332
      },
      {
        name: "Presence of Investment Promotion Unit",
        score: 1.9286,
        categoryAverage: 1.7332
      },
      {
        name: "Compliance to ARTA Citizen's Charter",
        score: 2,
        categoryAverage: 1.9253
      },
      {
        name: "Capacity to Generate Local Resource",
        score: 0.1113,
        categoryAverage: 0.1117
      },
      {
        name: "Capacity of Health Services",
        score: 0.4736,
        categoryAverage: 0.1938
      },
      {
        name: "Capacity of School Services",
        score: 0.1389,
        categoryAverage: 0.059
      },
      {
        name: "Recognition of Performance",
        score: 0.3751,
        categoryAverage: 0.1252
      },
      {
        name: "Getting Business Permits",
        score: 2,
        categoryAverage: 1.664
      },
      {
        name: "Peace and Order",
        score: 0.0412,
        categoryAverage: 0.1259
      },
      {
        name: "Social Protection",
        score: 0.489,
        categoryAverage: 0.4647
      }
    ]
  },
  {
    key: "infrastructure",
    name: "Infrastructure",
    score: 2.6846,
    rank: 125,
    categoryAverage: 2.4875,
    categoryBest: 5.2973,
    indicators: [
      {
        name: "Road Network",
        score: 0.004,
        categoryAverage: 0.0098
      },
      {
        name: "Distance to Ports",
        score: 1.3316,
        categoryAverage: 1.7791
      },
      {
        name: "Availability of Basic Utilities",
        score: 0.3646,
        categoryAverage: 0.294
      },
      {
        name: "Transportation Vehicles",
        score: 0.1383,
        categoryAverage: 0.043
      },
      {
        name: "Education",
        score: 0.2262,
        categoryAverage: 0.0743
      },
      {
        name: "Health",
        score: 0.2921,
        categoryAverage: 0.1497
      },
      {
        name: "LGU Investment",
        score: 0.0035,
        categoryAverage: 0.0105
      },
      {
        name: "Accommodation Capacity",
        score: 0.0988,
        categoryAverage: 0.0315
      },
      {
        name: "Information Technology Capacity",
        score: 0.0086,
        categoryAverage: 0.0123
      },
      {
        name: "Financial Technology Capacity",
        score: 0.2169,
        categoryAverage: 0.0832
      }
    ]
  },
  {
    key: "resiliency",
    name: "Resiliency",
    score: 11.7985,
    rank: 49,
    categoryAverage: 11.2764,
    categoryBest: 14.7296,
    indicators: [
      {
        name: "Land Use Plan",
        score: 1.9571,
        categoryAverage: 1.8862
      },
      {
        name: "Disaster Risk Reduction Plan",
        score: 1.9565,
        categoryAverage: 1.9445
      },
      {
        name: "Annual Disaster Drill",
        score: 1.0028,
        categoryAverage: 1.0134
      },
      {
        name: "Early Warning System",
        score: 1.1065,
        categoryAverage: 1.0159
      },
      {
        name: "Budget for DRRMP",
        score: 0.0018,
        categoryAverage: 0.0113
      },
      {
        name: "Local Risk Assessments",
        score: 2,
        categoryAverage: 1.9784
      },
      {
        name: "Emergency Infrastructure",
        score: 0.6083,
        categoryAverage: 0.4002
      },
      {
        name: "Utilities",
        score: 1.5463,
        categoryAverage: 1.4902
      },
      {
        name: "Employed Population",
        score: 0.1192,
        categoryAverage: 0.0975
      },
      {
        name: "Sanitary System",
        score: 1.5,
        categoryAverage: 1.4388
      }
    ]
  },
  {
    key: "innovation",
    name: "Innovation",
    score: 7.965,
    rank: 16,
    categoryAverage: 5.1547,
    categoryBest: 10.7084,
    indicators: [
      {
        name: "ICT Plan",
        score: 2.0001,
        categoryAverage: 1.4408
      },
      {
        name: "Innovation Financing (R&D Expenditures)",
        score: 0.0006,
        categoryAverage: 0.0045
      },
      {
        name: "ICT Use (e-BPLS Software)",
        score: 2,
        categoryAverage: 1.7171
      },
      {
        name: "Online Payment Facilities",
        score: 2,
        categoryAverage: 0.8605
      },
      {
        name: "STEM Graduates",
        score: 0.0159,
        categoryAverage: 0.042
      },
      {
        name: "Intellectual Property Registration",
        score: 0.213,
        categoryAverage: 0.0324
      },
      {
        name: "Internet Capability",
        score: 1.0023,
        categoryAverage: 0.8118
      },
      {
        name: "Availability of Basic Internet Service",
        score: 0.7172,
        categoryAverage: 0.2164
      },
      {
        name: "Start-up and Innovation Facilities",
        score: 0.0159,
        categoryAverage: 0.0245
      },
      {
        name: "New Technology",
        score: 0,
        categoryAverage: 0.0048
      }
    ]
  }
];

// Every Bulacan city and municipality, highest overall score first.
export type BulacanLgu = { name: string; category: string; rank: number; score: number };

export const bulacan: BulacanLgu[] = [
  {
    name: "San Jose Del Monte",
    category: "Component Cities",
    rank: 26,
    score: 41.7576
  },
  {
    name: "Malolos",
    category: "Component Cities",
    rank: 28,
    score: 41.4287
  },
  {
    name: "Baliwag",
    category: "Component Cities",
    rank: 46,
    score: 39.0818
  },
  {
    name: "Marilao",
    category: "1st-2nd Class Municipalities",
    rank: 11,
    score: 38.7963
  },
  {
    name: "Meycauayan",
    category: "Component Cities",
    rank: 54,
    score: 38.3927
  },
  {
    name: "Santa Maria",
    category: "1st-2nd Class Municipalities",
    rank: 34,
    score: 36.2622
  },
  {
    name: "Pulilan",
    category: "1st-2nd Class Municipalities",
    rank: 37,
    score: 36.0757
  },
  {
    name: "Plaridel",
    category: "1st-2nd Class Municipalities",
    rank: 46,
    score: 35.5607
  },
  {
    name: "Guiguinto",
    category: "1st-2nd Class Municipalities",
    rank: 47,
    score: 35.5442
  },
  {
    name: "San Rafael",
    category: "1st-2nd Class Municipalities",
    rank: 55,
    score: 35.1575
  },
  {
    name: "Pandi",
    category: "1st-2nd Class Municipalities",
    rank: 160,
    score: 32.4224
  },
  {
    name: "Obando",
    category: "1st-2nd Class Municipalities",
    rank: 177,
    score: 32.1216
  },
  {
    name: "Bustos",
    category: "1st-2nd Class Municipalities",
    rank: 187,
    score: 31.8733
  },
  {
    name: "Angat",
    category: "1st-2nd Class Municipalities",
    rank: 225,
    score: 31.2129
  },
  {
    name: "Paombong",
    category: "3rd-4th Class Municipalities",
    rank: 235,
    score: 31.0636
  },
  {
    name: "San Ildefonso",
    category: "1st-2nd Class Municipalities",
    rank: 238,
    score: 30.8763
  },
  {
    name: "Norzagaray",
    category: "1st-2nd Class Municipalities",
    rank: 240,
    score: 30.8544
  },
  {
    name: "Doña Remedios Trinidad",
    category: "1st-2nd Class Municipalities",
    rank: 242,
    score: 30.8343
  },
  {
    name: "Balagtas",
    category: "1st-2nd Class Municipalities",
    rank: 245,
    score: 30.7842
  },
  {
    name: "Bulakan",
    category: "1st-2nd Class Municipalities",
    rank: 287,
    score: 30.0693
  },
  {
    name: "San Miguel",
    category: "1st-2nd Class Municipalities",
    rank: 301,
    score: 29.8419
  },
  {
    name: "Calumpit",
    category: "1st-2nd Class Municipalities",
    rank: 317,
    score: 29.5071
  },
  {
    name: "Bocaue",
    category: "1st-2nd Class Municipalities",
    rank: 360,
    score: 28.8956
  },
  {
    name: "Hagonoy",
    category: "1st-2nd Class Municipalities",
    rank: 463,
    score: 25.3269
  }
];
