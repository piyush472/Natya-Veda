export type SourceType = "institutional" | "encyclopedic" | "academic";

export interface DanceSource {
  title: string;
  url: string;
  type: SourceType;
  notes?: string;
}

export interface DanceKnowledge {
  id: string;
  name: string;
  overview: string;
  origin: string;
  timeline: string[];
  history: string[];
  templeTraditions: string[];
  repertoireAndTechnique: string[];
  musicAndPerformance: string[];
  costumeAndVisualLanguage: string[];
  philosophyAndAesthetics: string[];
  majorSchoolsOrLineages: string[];
  notableExponents: string[];
  institutionsAndFestivals: string[];
  modernContext: string[];
  quickFacts: Record<string, string>;
  references: DanceSource[];
  lastReviewed: string;
}

export const danceKnowledgeById: Record<string, DanceKnowledge> = {
  bharatanatyam: {
    id: "bharatanatyam",
    name: "Bharatanatyam",
    overview:
      "Bharatanatyam is a major Indian classical dance tradition from Tamil Nadu. It combines nritta (pure movement), nritya (expressive storytelling), and natya (dramatic enactment), and is strongly connected to bhakti, temple culture, Carnatic music, and the aesthetic framework of rasa and bhava.",
    origin: "Tamil Nadu, South India",
    timeline: [
      "Early foundations are discussed through the Natya Shastra tradition and classical Tamil literature.",
      "Dance traditions in Tamil temple culture are evidenced in inscriptions, literary references, and temple sculpture programs.",
      "In the 18th-19th centuries, related performance practice (often referred to as Sadir) remained linked to temple and court ecosystems.",
      "In the late colonial period, anti-nautch reforms and legal restrictions damaged hereditary performance systems.",
      "In the 20th century, revival and reform movements reshaped public stage Bharatanatyam; the modern margam format became widely standardized.",
      "Post-independence, Bharatanatyam became a major national and global classical dance form taught through institutional and guru-shishya systems."
    ],
    history: [
      "Bharatanatyam is historically tied to South Indian devotional and performative traditions where dance, music, poetry, and ritual were interlinked.",
      "Its modern identity emerged through both continuity and reform. The revival period involved artists, scholars, nattuvanars, and institutions who preserved repertoire while adapting presentation, pedagogy, and stage framing.",
      "The tradition carries layered histories: temple practice, court culture, colonial disruption, nationalist cultural reconstruction, and global circulation."
    ],
    templeTraditions: [
      "Temple environments in Tamil regions preserved dance-linked ritual and iconographic vocabularies over centuries.",
      "Major temple centers, including Chidambaram and Thanjavur, are frequently discussed in relation to dance history and Shiva-centered iconography.",
      "Karanas, mudra symbolism, and sacred narrative themes help connect performance grammar with temple visual culture and devotional practice."
    ],
    repertoireAndTechnique: [
      "The modern performance arc is commonly described through margam items such as alarippu, jatiswaram, shabdam, varnam, padam or javali, tillana, and mangalam (line-up can vary by bani and production design).",
      "Core technical identity includes araimandi geometry, adavu families, rhythmic precision, expressive abhinaya, and codified hand gestures.",
      "Advanced practice balances physical architecture, rhythmic mathematics, emotional nuance, textual interpretation, and musical intelligence."
    ],
    musicAndPerformance: [
      "Bharatanatyam is typically performed with Carnatic music support and a collaborative ensemble.",
      "Common stage roles include nattuvanar, vocalist, mridangam artist, and melodic instrumentalists such as violin, flute, or veena.",
      "Texts may include Tamil, Sanskrit, Telugu, Kannada, and other classical or devotional compositions depending on repertoire and lineage."
    ],
    costumeAndVisualLanguage: [
      "The costume architecture supports leg geometry, line clarity, and rhythmic footwork while preserving classical aesthetics.",
      "Jewelry systems, head adornment, eye emphasis, and alta or kumkum on hands and feet amplify facial expression and gesture readability for audiences.",
      "Ankle bells (salangai or ghungroo) provide sonic reinforcement of rhythmic design and foot articulation."
    ],
    philosophyAndAesthetics: [
      "Aesthetic communication is usually discussed through bhava (inner emotional state), rasa (aesthetic flavor), and abhinaya (expressive conveyance).",
      "The form is often interpreted as sadhana: a disciplined artistic-spiritual practice that unites body, mind, rhythm, and meaning.",
      "Performance moves between abstract dance and narrative-emotive storytelling, making both technical excellence and interpretive depth essential."
    ],
    majorSchoolsOrLineages: [
      "Pandanallur lineage",
      "Kalakshetra style",
      "Vazhuvoor lineage",
      "Melattur lineage",
      "Thanjavur and related nattuvanar lineages"
    ],
    notableExponents: [
      "Rukmini Devi Arundale",
      "T. Balasaraswati",
      "Yamini Krishnamurti",
      "Padma Subrahmanyam",
      "Alarmel Valli",
      "Leela Samson",
      "M.R. Krishnamurthi and key nattuvanar families",
      "Many hereditary and institutional gurus across Tamil Nadu and beyond"
    ],
    institutionsAndFestivals: [
      "Kalakshetra Foundation, Chennai",
      "Madras Music Academy dance platform",
      "Sangeet Natak Akademi documentation and recognition frameworks",
      "State and private sabha circuits across Chennai and other cities",
      "National dance festivals and diaspora classical arts festivals"
    ],
    modernContext: [
      "Today Bharatanatyam is practiced in solo, ensemble, thematic, and interdisciplinary formats.",
      "Contemporary works include devotional, literary, social, and abstract themes while retaining classical grammar to varying degrees.",
      "Scholarly discourse continues around authenticity, revival politics, caste-gender history, pedagogy, and global transmission."
    ],
    quickFacts: {
      primaryRegion: "Tamil Nadu",
      classicalCategory: "Indian Classical Dance",
      performanceModes: "Nritta, Nritya, Natya",
      musicalSystem: "Carnatic",
      debutRecital: "Arangetram",
      commonLanguageCorpus: "Tamil, Sanskrit, Telugu, Kannada"
    },
    references: [
      {
        title: "Bharatanatyam - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Bharatanatyam",
        type: "encyclopedic",
        notes: "Use as starter synthesis; verify critical claims with institutional or academic sources."
      },
      {
        title: "Rukmini Devi Arundale - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Rukmini_Devi_Arundale",
        type: "encyclopedic"
      },
      {
        title: "Balasaraswati - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Balasaraswati",
        type: "encyclopedic"
      },
      {
        title: "Thanjavur Quartet - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Thanjavur_Quartet",
        type: "encyclopedic"
      },
      {
        title: "Sangeet Natak Akademi",
        url: "https://www.sangeetnatak.gov.in",
        type: "institutional"
      },
      {
        title: "CCRT (Government of India)",
        url: "https://ccrtindia.gov.in",
        type: "institutional"
      },
      {
        title: "Natya Shastra (Archive entry)",
        url: "https://archive.org/details/NatyaShastra",
        type: "academic"
      }
    ],
    lastReviewed: "2026-03-25"
  },
  kathak: {
    id: "kathak",
    name: "Kathak",
    overview:
      "Kathak is a major North Indian classical dance form known for rhythmic footwork, spins, improvisational dialogue with rhythm cycles, and expressive storytelling.",
    origin: "North India (historically linked to temple, court, and storytelling lineages)",
    timeline: [
      "Early roots in itinerant storytelling traditions associated with katha-vachak performance.",
      "Significant development in courtly contexts, including Mughal and regional patronage environments.",
      "Gharana-based pedagogy (notably Lucknow, Jaipur, and Banaras lineages) shaped stylistic emphasis.",
      "20th-century stage codification and institutional teaching expanded Kathak nationally and internationally."
    ],
    history: [
      "Kathak evolved as both narrative and abstract rhythmic art.",
      "Its repertoire absorbed devotional, courtly, and concert dimensions over time.",
      "Modern Kathak includes traditional solo format, duet and ensemble works, and thematic productions."
    ],
    templeTraditions: [
      "Early devotional storytelling remains central in many interpretive compositions.",
      "Krishna bhakti poetry and narrative episodes remain important for abhinaya repertoire."
    ],
    repertoireAndTechnique: [
      "Tatkar footwork, chakkars, tihais, paran, tukra, and layakari are central rhythmic tools.",
      "Nritta virtuosity and nritya storytelling coexist, often with improvisational exchange with tabla and vocal recitation.",
      "Gharana differences may emphasize abhinaya elegance, rhythmic power, or compositional architecture."
    ],
    musicAndPerformance: [
      "Hindustani music framework is standard in Kathak performance.",
      "Tabla, sarangi or harmonium, vocal support, and padhant recitation are commonly used."
    ],
    costumeAndVisualLanguage: [
      "Costume varies by production and lineage, often including angarkha or kurta-churidar for men and lehenga or anarkali variants for women.",
      "Gestural language includes subtle facial and wrist articulations alongside dynamic torso and spin control."
    ],
    philosophyAndAesthetics: [
      "Kathak aesthetics emphasize rhythmic intelligence, presence, and narrative immediacy.",
      "The form values both composed material and live improvisation within tala architecture."
    ],
    majorSchoolsOrLineages: ["Lucknow Gharana", "Jaipur Gharana", "Banaras Gharana", "Raigarh contributions"],
    notableExponents: ["Birju Maharaj", "Sitara Devi", "Kumudini Lakhia", "Durga Lal", "Shovana Narayan"],
    institutionsAndFestivals: ["Kathak Kendra", "Major Hindustani and dance festivals", "University and guru-led repertory systems"],
    modernContext: [
      "Kathak now spans traditional solo recital, dance-theatre, and cross-genre collaboration.",
      "Digital archives and notation projects are helping preserve older compositions and teaching traditions."
    ],
    quickFacts: {
      primaryRegion: "North India",
      classicalCategory: "Indian Classical Dance",
      musicalSystem: "Hindustani",
      coreStrength: "Rhythm and spin vocabulary"
    },
    references: [
      { title: "Kathak - Wikipedia", url: "https://en.wikipedia.org/wiki/Kathak", type: "encyclopedic" },
      { title: "Sangeet Natak Akademi", url: "https://www.sangeetnatak.gov.in", type: "institutional" }
    ],
    lastReviewed: "2026-03-25"
  },
  odissi: {
    id: "odissi",
    name: "Odissi",
    overview:
      "Odissi is a major classical dance form from Odisha, noted for tribhangi body architecture, lyrical torso movement, and deep links to Jagannath devotional culture.",
    origin: "Odisha, Eastern India",
    timeline: [
      "Historical references appear in Odisha temple sculpture and regional performance traditions.",
      "Mahari and Gotipua traditions are key historical carriers of performance vocabulary.",
      "20th-century reconstruction and codification shaped the modern stage form."
    ],
    history: [
      "Odissi integrates sculptural stillness and fluid movement, often described as both geometric and lyrical.",
      "Post-independence codification involved guru collaboration, repertoire selection, and pedagogy design."
    ],
    templeTraditions: [
      "Strong connections to Jagannath temple culture and Odia devotional literature.",
      "Temple iconography and karana-like motifs informed reconstruction vocabularies."
    ],
    repertoireAndTechnique: [
      "Core ideas include chowk and tribhangi, with strong emphasis on torso isolation and expressive subtlety.",
      "Common stage formats include invocatory items, pure dance passages, abhinaya pieces, and climactic endings."
    ],
    musicAndPerformance: [
      "Odissi music tradition supports dance repertoire with region-specific melodic and rhythmic language.",
      "Mardala percussion and vocal poetry are central in many productions."
    ],
    costumeAndVisualLanguage: [
      "Costume and silver jewelry are signature visual identifiers in many Odissi productions.",
      "Head ornaments and temple-inspired motifs reinforce historical and devotional framing."
    ],
    philosophyAndAesthetics: [
      "Odissi performance is strongly associated with bhakti aesthetics and poetic interpretation.",
      "Expressive storytelling and sculptural line are treated as mutually reinforcing modes."
    ],
    majorSchoolsOrLineages: ["Major 20th-century guru lineages of Odisha"],
    notableExponents: ["Kelucharan Mohapatra", "Sanjukta Panigrahi", "Sonal Mansingh", "Sujata Mohapatra"],
    institutionsAndFestivals: ["Odissi Research Centre and related institutions", "Konark and Odisha festival circuits"],
    modernContext: [
      "Odissi continues to grow globally with strong solo, ensemble, and pedagogical ecosystems.",
      "Archival and notation work remains crucial for preserving repertoire variants."
    ],
    quickFacts: {
      primaryRegion: "Odisha",
      classicalCategory: "Indian Classical Dance",
      coreBodyIdeas: "Chowk and Tribhangi"
    },
    references: [
      { title: "Odissi - Wikipedia", url: "https://en.wikipedia.org/wiki/Odissi", type: "encyclopedic" },
      { title: "Sangeet Natak Akademi", url: "https://www.sangeetnatak.gov.in", type: "institutional" }
    ],
    lastReviewed: "2026-03-25"
  },
  kathakali: {
    id: "kathakali",
    name: "Kathakali",
    overview:
      "Kathakali is a major classical dance-drama tradition from Kerala known for codified acting, elaborate makeup systems, strong percussion language, and epic narrative theatre.",
    origin: "Kerala, South India",
    timeline: [
      "Emerged through interactions among Kerala performance and ritual theatre traditions.",
      "Court, temple, and community patronage sustained repertoire and performer training.",
      "20th-century institutions formalized teaching and widened national visibility."
    ],
    history: [
      "Kathakali combines dance, theatre, music, and martial body training into a highly codified dramatic form.",
      "It developed a sophisticated role taxonomy and visual grammar to communicate character archetypes and ethical tensions."
    ],
    templeTraditions: [
      "Temple festival circuits and ritual calendars historically shaped performance contexts.",
      "Mythic narratives from the Mahabharata, Ramayana, and Puranic cycles dominate repertoire."
    ],
    repertoireAndTechnique: [
      "Technique emphasizes eye control, facial musculature training, hand gestures, and powerful stance dynamics.",
      "Character embodiment requires role-specific movement logic, expressive coding, and dramatic timing."
    ],
    musicAndPerformance: [
      "Percussion systems such as chenda and maddalam are central, along with vocal narration traditions.",
      "Performance often extends over long durations with structurally layered scenes."
    ],
    costumeAndVisualLanguage: [
      "Highly developed makeup and costume categories function as visual semantics for moral, heroic, demonic, and feminine character types.",
      "Headgear, facial color coding, and costume massing help establish archetype before movement begins."
    ],
    philosophyAndAesthetics: [
      "Kathakali foregrounds rasa through dramatic intensification and codified acting detail.",
      "The form fuses ritual gravity with theatrical precision."
    ],
    majorSchoolsOrLineages: ["Kerala-based gurukulam and institutional lineages"],
    notableExponents: ["Kalamandalam Krishnan Nair", "Kottakkal Sivaraman", "Kalamandalam Gopi"],
    institutionsAndFestivals: ["Kerala Kalamandalam", "Regional temple and seasonal theatre festivals"],
    modernContext: [
      "Kathakali continues as a living classical theatre with strong institutional training and global touring.",
      "Contemporary productions include condensed format adaptations for new audiences while preserving core grammar."
    ],
    quickFacts: {
      primaryRegion: "Kerala",
      classicalCategory: "Indian Classical Dance-Drama",
      coreIdentity: "Codified character acting and visual dramaturgy"
    },
    references: [
      { title: "Kathakali - Wikipedia", url: "https://en.wikipedia.org/wiki/Kathakali", type: "encyclopedic" },
      { title: "Sangeet Natak Akademi", url: "https://www.sangeetnatak.gov.in", type: "institutional" }
    ],
    lastReviewed: "2026-03-25"
  }
};

export const danceKnowledgeList = Object.values(danceKnowledgeById);
