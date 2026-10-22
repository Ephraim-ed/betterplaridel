// Current officials of Plaridel, Bulacan.
// Source: DILG Bulacan LGRC — Local Government Units: Plaridel.
// Obvious spacing typos in the source were fixed (e.g. "Sam uel" → "Samuel").

export const TERM = "2025–2028"; // municipal elected officials
export const SOURCE = {
  label: "DILG Bulacan — LGU profile of Plaridel",
  url: "https://www.lgrcbulacan.region3.dilg.gov.ph/about-us/partners-and-stakeholders/local-government-units/plaridel",
};

export type OrgNodeKind = "lgu" | "executive" | "legislative" | "member" | "barangay" | "kagawad" | "sk-chair" | "sk-member";

export type Roster = { label: string; people: string[] };

export type OrgNode = {
  id: string;
  parentId?: string;
  kind: OrgNodeKind;
  name: string; // person's name, or the office/body for group nodes
  position: string;
  description?: string;
  contact?: string;
  childrenLabel?: string; // what this node's children are called, e.g. "barangays"
  rosters?: Roster[]; // e.g. a barangay's kagawads and SK officials
};

type Barangay = {
  barangay: string;
  captain: string;
  secretary: string;
  kagawad: string[];
  skChair: string;
  skSecretary: string;
  skKagawad: string[];
};

const barangays: Barangay[] = [
  {
    barangay: "Agnaya",
    captain: "Maximo V. Lazaro",
    secretary: "John F. Bigornia",
    kagawad: ["Ricardo S. Centano", "Ferdinand D. Castillo", "Edilberto B. Tuazon", "Jefferson M. Lumague", "Marvin I. Lacanglacang", "Edwin C. Ramos", "Luis A. Gliane"],
    skChair: "Loise Kamil L. Yambao",
    skSecretary: "Joshua R. Gabriel",
    skKagawad: ["Erika Mae C. Santos", "Duke Harvey P. Galura", "Angelica A. Rivera", "Liezl Frances B. Largo", "Joana Kristine M. Castillo", "Robert Joseph A. Bernardo", "Louie Angelo Quizzagan"],
  },
  {
    barangay: "Bagong Silang",
    captain: "Samuel P. Dayao",
    secretary: "Mariel J. Ilao",
    kagawad: ["Marlon D.C. Bautista", "Emmanuel R. Daja", "Annaliza M. Carangan", "Bernardo E. Talastas", "Jeffrey P. Dayao", "Victorino C. Cordero", "Marie John C. Del Rosario"],
    skChair: "Shenlhee D. Gesmundo",
    skSecretary: "Jerome B. Preagola",
    skKagawad: ["John Mark P. Dela Cruz", "Trisha Mae D.C. Santos", "Lerwin A. De Jesus", "Irish Benedict E. Carangan", "Daniella D. Urbano", "Hazelene O. Udan", "John Carlo C. Hilario"],
  },
  {
    barangay: "Banga I",
    captain: "Edwin M. De Dios",
    secretary: "Rechildo E. Mago",
    kagawad: ["Maria Elsie S. Castillo", "Kevin Anton L. Dela Cruz", "Rolando D.G. Malubay", "Ruel J. Dela Cruz", "Dennis S. Cansino", "Philip S. Aquino", "Edgardo P. Loreto"],
    skChair: "Sheila Marie E. Catarina",
    skSecretary: "Jewel Christine C. Sayo",
    skKagawad: ["Leo C. Cabarles", "Aldrin M. Altares", "Charles C. Castillo", "Ira Denise B. Cansino", "Natasha Mae T. Ramos", "Tracy S. Bote", "Alessandra C. Mendieta"],
  },
  {
    barangay: "Banga II",
    captain: "Jaymon F. Punzalan",
    secretary: "Maria Noridy B. Apostol",
    kagawad: ["Joel B. Leonardo", "Demie L. San Deigo", "Orlando R. Talastas", "Christopher D.D. Leoncio", "Angelito F. Bautista", "Ernesto San Juan", "Rolando Enriquez"],
    skChair: "Princess P. Dayao",
    skSecretary: "Wackie Roman B. Enriquez",
    skKagawad: ["Ellah Mae M. Pascual", "Rhea Mae Perez", "Ricardo S. Salvador", "Dan Joseph Arribe", "John Paolo S. Romano", "Charmaigne L. Leonardo", "Mary Nicole R. Santos"],
  },
  {
    barangay: "Bintog",
    captain: "Raymond S. Bell",
    secretary: "Khenneth M. Santiago",
    kagawad: ["Dennis S. Lumague", "Thelma D. Baylon", "Elias R. Santos", "Rolando R. Manalad", "Wilfredo S. Gatmaitan", "Margaret D.G. Herrera", "Alexander D. Yusingco"],
    skChair: "Don Joshua M. Mendoza",
    skSecretary: "Lance B. Belen",
    skKagawad: ["Eingrid Therese D. Abrera", "Aivan James S. Alcantara", "Kyla May L. Balonzo", "Maria Paulyn Ellyzcel G. Mariano", "Jhoanna Mae S. Aringoy", "Aera Jara M. Lumague", "Kathleen Kate S. Mariano"],
  },
  {
    barangay: "Bulihan",
    captain: "Esperanza S. Garcia",
    secretary: "Maxima S. Hipolito",
    kagawad: ["Gregorio S. Hernandez", "Enrique C. San Diego", "Florentina C. Salonga", "Emmanuelle SM. Dela Cruz", "Nicolas C. Mendoza", "Andresito C. Cervania", "Jeric C. Jacinto"],
    skChair: "Bjorn Roddick S.D. Cervania",
    skSecretary: "Roniel A. Francisco",
    skKagawad: ["Nicole G. Mendoza", "John Noelly C. Camacho", "Ronalyn D. Caralde", "Josh Yuri M. Osias", "Christian Ann V. Angeles", "Kristin Ann C. Bernardino", "John Christian S.D. Hernandez"],
  },
  {
    barangay: "Culianin",
    captain: "Edwin S. Reyes",
    secretary: "Catherine T. Dela Cruz",
    kagawad: ["Rosario P. Nativo", "Raynand S. Lopez", "Aldrin L. Martin", "Oscar V. Mendoza", "Jonas Vladimir V. De Rueda", "Romano Garcia", "Joel Fuentes"],
    skChair: "Jayrald G. Fuentes",
    skSecretary: "Kyla Mae C. Rivarez",
    skKagawad: ["John Clarence S. Penaloza", "Cassandra Mae D.S. Lopez", "Mary Mar M. Villalon", "Harvy S. Lopez", "Axl I. Villalon", "Cathrine Keith M. Dularte", "Marlochris D. De Mesa"],
  },
  {
    barangay: "Dampol",
    captain: "Feliciano T. De Robles",
    secretary: "Maricel S. Bagan",
    kagawad: ["Cecilia M. Manangan", "Felizardo M. Venturina", "Hermogenes V. Manahan", "Rodelio M. Corpuz", "Aurea V. San Pedro", "Myla T. Bayog", "Ellen D.C. Alabania"],
    skChair: "Priscilo T. Bautista",
    skSecretary: "Luigi Miguel V. Mendoza",
    skKagawad: ["Angel C. Dela Cruz", "Chonnalyn B. Sayo", "Geero Macvil V. Macaraeg", "Edchelle D.C. Cruz", "Mark Lester G. Lumague", "John Wayne D. Balmes", "Allen G. Pulumbarit"],
  },
  {
    barangay: "Lagundi",
    captain: "Rolando E. Dela Cruz",
    secretary: "Maria Melliza R. Dela Cruz",
    kagawad: ["Robert C. Del Rosario", "Pablo E. Magsakay", "Dominador D.C. Mag-isa", "Aurea E. Maclang", "Elena B. Lopez", "Narciso V. Magsakay"],
    skChair: "Marcuz Nicollo M. Gutierrez",
    skSecretary: "Joshua J. Gasper",
    skKagawad: ["Christine Joy D. Macaraeg", "Ericka Mae D.C. Leynes", "John Jedrix G. Reyes", "Jaspher Daivid R. Dionisio", "Aira Kristine P. Carusa", "John Mickaella G. Diemsen", "Scott N. Echavarria"],
  },
  {
    barangay: "Lalangan",
    captain: "Danilo M. Tayao",
    secretary: "Maria Carolina R. Galvez",
    kagawad: ["Marvin S. Dela Cruz", "Albert S. Marcelo", "Ramil O. Ramos", "Ma. Theresa D. Bataoil", "Aurelio B. Bernarbe", "Dennis M. Tayao", "Enrico B. Bustamante"],
    skChair: "John Loiyd I. Javier",
    skSecretary: "Julie S. Lomotan",
    skKagawad: ["Mark Jomhar B. Dela Cruz", "Lieka Montallana", "Andrei S. Solomon", "Angela Lee Bautista", "Sarah Micah T. Sikat", "Carla Therese A. Javier", "Divine S. Dela Cruz"],
  },
  {
    barangay: "Lumang Bayan",
    captain: "Leoncio C. Ramos",
    secretary: "Roxanne R. Flores",
    kagawad: ["Rosita G. Ninalga", "Benjurita M. Aviso", "Timoteo R. Espiritu", "Renato M. Acuna", "Michelle Marie P. Gaba", "Aris Castillo", "Ricky M. Ignacio"],
    skChair: "Jazzper Bjorn D. Valencia",
    skSecretary: "Aila Mariz G. Bautista",
    skKagawad: ["Katrina M. Tapang", "Christopher B. Yasay", "Ashley Jhanyka V. Ryan", "Daniella S. Mariano", "Aileen Culilap", "Mar Jan Leonard B. Cuevo", "Kcris Erlvic DJ. Lazaro"],
  },
  {
    barangay: "Parulan",
    captain: "Juanesto R. Sayo",
    secretary: "Rodney Ashley D.C. Esteban",
    kagawad: ["Reinerio A. Ravago", "Nicasio L. Gatmaitan", "Armando N. Hilario", "Silvestre E. De Jesus", "Amor P. Dela Cruz", "Robert Ray C. Reyes", "Joselito I. Cando"],
    skChair: "Roy Kenneth D.S. Lingat",
    skSecretary: "John Mauro M. Panaglima",
    skKagawad: ["Kim Angela S. Esteban", "Denies Eirielle D.C. Dela Pena", "Paul Clement O. Gatmaitan", "Charmaine Joyce D.P. Trinidad", "Jerico F. Gamboa", "Joshua Andrei L. Sayo", "Erickson Symond C. Guillen"],
  },
  {
    barangay: "Poblacion",
    captain: "Ruel C. Marquez",
    secretary: "Elenita A. Velasco",
    kagawad: ["Eden S. Olivarez", "Ma. Nerissa J. Martin", "Maria Asuncion C. Alba", "Ronell R. Delino", "Francisco P. Capulong", "Risza D.C. Castro", "Alfredo S. Galvez"],
    skChair: "Ivan I. Molina",
    skSecretary: "Dirkzeen A. Bunag",
    skKagawad: ["Jaysie M. Colling", "William Angeles", "Mark Dave Gutierrez", "John Matthew G. Javier", "Ann Sherina Dana H. Alejo", "Daniel B. Diezmo"],
  },
  {
    barangay: "Rueda",
    captain: "Butch R. Bastes",
    secretary: "Rosene C. Alcuizar",
    kagawad: ["Rodolfo S.P. Bautista", "Mario B. Tayao", "Nelita D. Cadiz", "Simeona C. Tayao", "Marlon M. Pagdanganan", "Carlito M. Flores", "Michael S. Morales"],
    skChair: "Josh Marco E. Flores",
    skSecretary: "Daniella L. Pangilinan",
    skKagawad: ["Frexine A. Sayo", "Jomari S. Surigao", "Jules Alwen S. Montehermoso", "Jasper Andrei Concepcion", "Melanie G. Macarilay", "Mark C. Mecado", "Ma. Louse Nicole Cleto"],
  },
  {
    barangay: "San Jose",
    captain: "Pedro Mariano",
    secretary: "Ma. Christina V. Rogando",
    kagawad: ["Crizaldye E. Ladores", "Noel J. Lumague", "Antonio B. Lopez", "Editha M. Fabian", "Jose Alex I. Santos", "Naldy S. Ortiz"],
    skChair: "Kristina Cassandra M. Mendoza",
    skSecretary: "Mary Ann G. Verdey",
    skKagawad: ["April Rose G. Jose", "Emjay P. Santiago", "Ericka Mhel S. De Jesus", "Gyn Grei Illa C. Estacio", "John Ralph G. Tiburania", "Justine C. Bartolome", "Ralph Laurence S. Fabian"],
  },
  {
    barangay: "Santa Ines",
    captain: "Gary S. Constantino",
    secretary: "Rodrigo N. Vegas",
    kagawad: ["Gilbert S. Vilino", "Ernesto S. Angeles", "Rolando S. Magcaling", "Merlita M. Camua", "Gardner P. Sisno", "Jonathan E. Malicsi", "Julian P. Angeles"],
    skChair: "Johnnhel Dave L. Romero",
    skSecretary: "John Paul F. Dela Torre",
    skKagawad: ["Mark Anthony Beloro", "Jelly Mae C. Lucas", "Emman Justine P. Vegas", "Airah May A. Baloloy", "Nikki Ann V. Andres", "Alyssa Mae S. Mabanag", "Gerome B. Santiago"],
  },
  {
    barangay: "Santo Niño",
    captain: "Romeo J. Dela Cruz",
    secretary: "Michael Robert B. Leonardo",
    kagawad: ["Alberto D.C. Lucas", "Benjamin M. Bondoc", "Amelia J. Dungca", "Jaime L. Leoncio", "Ferdinand A. Leoncio", "Ruel S. Dela Cruz", "Rodel V. Leoncio"],
    skChair: "AJ Manuel S. Domingo",
    skSecretary: "Ram Justine Villamil",
    skKagawad: ["Nica Claire C. Domingo", "Laiza L. Estrella", "Roy D. Faustino", "Queem Ferbie C. Enriquez", "Laurence L. Bantillo", "Kurt Ivan B. Bernardo", "Mary Fercell M. Gabe"],
  },
  {
    barangay: "Sipat",
    captain: "Oscar D.C. Gabriel",
    secretary: "Ross Ann J. Adona",
    kagawad: ["Mario G. Reyes", "Ernesto R. Eusebio", "Wendell Juztin G. Dela Cruz", "Lani G. Lucas", "Jake Anthony G. Lumague", "Neptalie M. Gatchalian", "Elphie A. Camua"],
    skChair: "Prince Jared V. Santiago",
    skSecretary: "Vryth Kenneth M. Mercurio",
    skKagawad: ["Charee B. Joson", "Charl Justine R. Yap", "Rupert Dave D. Gabriel", "Aaron Christian C. Quising", "Jepoy C. Pactoran", "Janice M. Yumol", "Arvin B. Lumague"],
  },
  {
    barangay: "Tabang",
    captain: "Cherry Lyn D.C. Preligera",
    secretary: "Genoveva M. Reyes",
    kagawad: ["Wilfredo L. Villareal", "Luis V. Gatuz", "Mark Anthony V. Liwanag", "Nelson S.M. Aguilar", "Caridad C. Alcantara", "Noel B. Ramos", "Alejandro C. Gatuz"],
    skChair: "MC Lloyd A. Asuncion",
    skSecretary: "Albert Joson I. Reyes",
    skKagawad: ["Christian Rey I. Gatuz", "Teddy C. De Jesus", "Allyzza Jewel B. Estrella", "Hanna Mariz P. Dulaogon", "Patricia May T. Caparas", "Aila Marie G. Castillo", "Katrina Mae S. Dela Cruz"],
  },
];

const councilors = [
  "Seth Josiah V. Cucio",
  "Sheila Anna P. Enriquez",
  "Mary Grace A. Alcantara",
  "Rosita S. Geronimo",
  "Ryan Christian S. Sagala",
  "Aimee R. San Gabriel",
  "Allan Chris T. De Leon",
  "Raul V. Gatuz",
];

export const orgNodes: OrgNode[] = [
  {
    id: "lgu",
    kind: "lgu",
    name: "Municipality of Plaridel",
    position: "Bulacan · 19 barangays",
    childrenLabel: "officials",
    description: "The local government unit, led by an executive (the Mayor) and a legislature (the Sangguniang Bayan).",
    contact: "(044) 794-0119",
  },
  {
    id: "mayor",
    parentId: "lgu",
    kind: "executive",
    name: "Hon. Jocell Aimee Vistan",
    position: "Municipal Mayor",
    childrenLabel: "barangays",
    description: "Local chief executive. Runs the municipal government and its offices, and supervises the barangays.",
    contact: "(044) 794-0119 loc. 1001 / 1002",
  },
  {
    id: "vice-mayor",
    parentId: "lgu",
    kind: "legislative",
    name: "Hon. Imelda G. De Leon",
    position: "Municipal Vice Mayor",
    childrenLabel: "council members",
    description: "Presiding officer of the Sangguniang Bayan, and first in line to succeed the Mayor.",
  },
  ...councilors.map(
    (name, i): OrgNode => ({
      id: `councilor-${i + 1}`,
      parentId: "vice-mayor",
      kind: "member",
      name: `Hon. ${name}`,
      position: "Municipal Councilor",
      description: "Elected member of the Sangguniang Bayan. Drafts and passes municipal ordinances and resolutions.",
    }),
  ),
  ...barangays.flatMap((b): OrgNode[] => {
    const id = `brgy-${b.barangay.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return [
      {
        id,
        parentId: "mayor",
        kind: "barangay",
        name: `Hon. ${b.captain}`,
        position: `Punong Barangay · ${b.barangay}`,
        childrenLabel: "officials",
        description: `Barangay captain of ${b.barangay}, under the general supervision of the Mayor.`,
        rosters: [{ label: "Barangay Secretary", people: [b.secretary] }],
      },
      ...b.kagawad.map(
        (name, i): OrgNode => ({
          id: `${id}-kagawad-${i + 1}`,
          parentId: id,
          kind: "kagawad",
          name: `Hon. ${name}`,
          position: `Barangay Kagawad · ${b.barangay}`,
          description: `Member of the Sangguniang Barangay of ${b.barangay}. Passes barangay ordinances and resolutions.`,
        }),
      ),
      // The SK Chairperson sits on the barangay council (ex officio) and leads the youth council.
      {
        id: `${id}-sk`,
        parentId: id,
        kind: "sk-chair",
        name: `Hon. ${b.skChair}`,
        position: `SK Chairperson · ${b.barangay}`,
        childrenLabel: "SK officials",
        description: `Leads the Sangguniang Kabataan (youth council) of ${b.barangay}, and sits on the barangay council.`,
      },
      ...b.skKagawad.map(
        (name, i): OrgNode => ({
          id: `${id}-sk-kagawad-${i + 1}`,
          parentId: `${id}-sk`,
          kind: "sk-member",
          name: `Hon. ${name}`,
          position: `SK Kagawad · ${b.barangay}`,
          description: `Member of the Sangguniang Kabataan of ${b.barangay}. Plans and runs youth programs.`,
        }),
      ),
      {
        id: `${id}-sk-secretary`,
        parentId: `${id}-sk`,
        kind: "sk-member",
        name: b.skSecretary,
        position: `SK Secretary · ${b.barangay}`,
        description: `Appointed secretary of the Sangguniang Kabataan of ${b.barangay}.`,
      },
    ];
  }),
];
