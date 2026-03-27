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
      "Kathak is a major North Indian classical dance form known for rhythmic footwork, spins, improvisational dialogue with rhythm cycles, and expressive storytelling. The form synthesizes ancient Sanskrit performance theory with Mughal court aesthetics and Krishna bhakti devotionalism, creating a uniquely cosmopolitan art form that balances pure rhythmic virtuosity with profound narrative expression.",
    origin: "North India (historically linked to temple, court, and storytelling lineages across Uttar Pradesh, Rajasthan, and Madhya Pradesh)",
    timeline: [
      "Ancient roots: Itinerant Kathakars narrating Sanskrit epics and mythological stories through integrated music, movement, and gesture (referenced in Natya Shastra, 2000+ years ago).",
      "Medieval period: Kathak evolves in North Indian kingdoms during Gupta and Vardhan dynasties, with storytellers performing in temples, courts, and community spaces.",
      "Mughal era (16th-18th centuries): Profound synthesis with Persian court aesthetics; Kathak becomes sophisticated courtly art form under rulers like Akbar.",
      "18th-19th centuries: Gharana system crystallizes; distinct stylistic lineages develop in Lucknow, Jaipur, and Banaras under royal and noble patronage.",
      "Colonial period (1850-1947): Court patronage declines; economic hardship threatens hereditary performer communities; nationalist movement begins recognizing Kathak as cultural heritage.",
      "Post-independence (1950s onward): Institutional support through Kathak Kendra (1959), Sangeet Natak Akademi recognition (1953); revival and codification of traditional repertoire.",
      "Contemporary era (1980s-present): Global expansion; integration into concert halls, universities, and international performance circuits; continued gender integration and stylistic innovation."
    ],
    history: [
      "Kathak's etymology ('Katha' = story) connects to ancient Sanskrit tradition of narrative performance as spiritual practice.",
      "The form uniquely synthesizes Hindu devotional traditions (Krishna bhakti) with Islamic courtly culture, creating aesthetic hybridity.",
      "Unlike South Indian temple-oriented forms, Kathak's itinerant and courtly nature made it accessible to diverse audiences and shaped its improvisational character.",
      "The hereditary gharana system preserved knowledge across generations with remarkable precision, maintaining distinct stylistic approaches while accumulating technical sophistication.",
      "Colonial suppression and economic decline nearly destroyed the tradition; 20th-century revival through visionary dancers like Birju Maharaj ensured its survival and global expansion.",
      "Modern Kathak balances fidelity to classical grammar with contemporary creative expression, proving the form's flexibility and enduring relevance."
    ],
    templeTraditions: [
      "Early devotional storytelling in temples of Mathura and Vrindavan, sacred centers of Krishna worship, established spiritual foundations.",
      "Krishna lila narratives (divine childhood exploits, Radha romance, philosophical teachings) became central to Kathak repertoire and remain essential to performance meaning.",
      "Temple performances during festival seasons established the tradition of all-night or extended performances; sacred time becoming performance time.",
      "Krishna bhakti poetry (Surdas, Meera, Kabir) infused Kathak with devotional intensity; divine encounter through narrative re-enactment remains core to abhinaya practice.",
      "Religious contexts provided institutional support and training grounds; temples functioned as educational centers where guru-shishya transmission occurred.",
      "Invocatory pieces dedicated to Krishna remain standard opening to contemporary Kathak performances, maintaining spiritual framing even in secular concert contexts."
    ],
    repertoireAndTechnique: [
      "Thaat (abstract pure dance structures) establish geometric patterns and rhythmic relationships; foundational vocabulary predating narrative elements.",
      "Tatkar: rapid footwork patterns creating rhythmic complexity; fundamental technical vocabulary emphasizing ankle articulation and rhythmic precision.",
      "Chakkars: spinning movements combining horizontal rotations with intricate footwork; signature Kathak vocabulary demonstrating technical virtuosity and spatial command.",
      "Tihais: three-fold rhythmic patterns resolving on beat one; compositional structural element appearing in both abstract and narrative pieces.",
      "Paran: drumming-derived compositional form; rhythmic phrases creating dialogue between dancer's feet and percussion accompaniment (tabla).",
      "Tukra: short rhythmic phrase or compositional break; used for transitions and rhythmic elaborations within larger structures.",
      "Layakari: playful manipulation of tempo and rhythmic relationships; improvisational exchange between dancer and musician.",
      "Abhinaya: expressive storytelling through refined facial expression, hand gesture, and body positioning; narrative vocabulary interpreting poetry and emotional content.",
      "Gharana differences: Lucknow emphasizes abhinaya elegance and emotional refinement; Jaipur emphasizes rhythmic power and virtuosic footwork; Banaras emphasizes compositional precision and mathematical construction."
    ],
    musicAndPerformance: [
      "Hindustani classical music provides the melodic and rhythmic framework; rags and ragas structure improvisation and composition.",
      "Tabla (paired drums) serves as primary percussion accompaniment, creating rhythmic dialogue with dancer's footwork.",
      "Sarangi (bowed stringed instrument) or harmonium provides melodic accompaniment, supporting both abstract passages and narrative sections.",
      "Vocal recitation (padhant or sargam) spoken by drummer or dancer articulates complex rhythmic structures, making abstract patterns audible.",
      "String instruments (sitar, sarod) or flute may accompany in ensemble contexts, enriching melodic texture.",
      "Tala (rhythmic cycle) provides temporal framework; cycles of 6, 8, 12, or 16 beats structure improvisation and composition; resolution on beat one marks structural cadences.",
      "Raga-tala synthesis: specific ragas evoke particular moods and emotional contexts; specific talas shape rhythmic sophistication; their combination creates aesthetic coherence.",
      "Vocal texts in Kathak include Sanskrit verses, Braj bhasha poetry (Krishna devotional literature), Hindi couplets, and Urdu ghazals, reflecting the form's cosmopolitan heritage."
    ],
    costumeAndVisualLanguage: [
      "Traditional costume varies by lineage and context but typically includes angarkha (long tunic) or kurta (fitted tunic) paired with churidar (fitted trousers) for male performers.",
      "Female performers traditionally wear lehenga (full skirt) or anarkali (flowing dress), often with dupatta (scarf) and heavily embellished choli (blouse).",
      "Jewelry systems including neck ornaments, arm bangles (churi or kada), hand ornaments emphasize gesture visibility and rhythmic clarity.",
      "Ankle bells (ghungroo) on both feet provide sonic reinforcement of footwork; their sound becomes integral to rhythmic design and compositional intention.",
      "Head adornment varies: traditional turbans or kalangi (feathered headdress) for various contexts; contemporary performances sometimes include simplified headpieces.",
      "Facial expression and hand gesture (mudra) carry enormous communicative weight in abhinaya sections; refined wrist articulation and finger positioning enable nuanced emotional expression.",
      "Makeup traditionally minimal compared to Kathakali or Odissi; emphasis on clarity of facial expression rather than character makeup; contemporary performers sometimes use subtle eye makeup enhancement.",
      "Overall visual aesthetic emphasizes dynamic upper-body control, intricate footwork visibility, and refined hand positioning; costume design maximizes readability of complex movement vocabulary."
    ],
    philosophyAndAesthetics: [
      "Rasa aesthetics (emotional aesthetic flavor) through rhythm: Kathak posits that rhythmic mastery transcends technical accomplishment to access transcendent emotional states.",
      "Taal (rhythm/time) as metaphysical principle: temporal cycles reflect cosmic order; mastery of taal represents achieving harmony with universal principles.",
      "Improvisation within structure: apparent spontaneity within rigid mathematical frameworks; balance between composed material and creative freedom within tala prison.",
      "Narrative and abstraction as mutually reinforcing: pure rhythmic virtuosity prepares consciousness for emotional narrative reception; storytelling deepens appreciation of rhythmic complexity.",
      "Bhakti philosophy: performance as devotional practice; divine encounter through Krishna narrative re-enactment; audience participation in spiritual communion through aesthetic experience.",
      "Presence as spiritual practice: concentration (dharana) during performance; moment-to-moment awareness generating transcendent consciousness; dance as meditation-in-motion.",
      "Gender and grace: Kathak traditionally valued 'delicacy' and 'grace' as aesthetic ideals, sometimes linking these to feminine sensibility; contemporary understanding recognizes these qualities transcend gender.",
      "Integration of traditions: synthesis of Hindu spiritual philosophy, Islamic courtly sophistication, and secular performance arts reflecting India's syncretic cultural heritage."
    ],
    majorSchoolsOrLineages: [
      "Lucknow Gharana: Known for elegance, emotional subtlety, and abhinaya refinement; Bindadin Maharaj (1836-1919) and his descendants established this lineage's characteristics.",
      "Jaipur Gharana: Known for rhythmic power, virtuosic speed, and technical brilliance; developed under royal patronage of Jaipur court; emphasizes aggressive footwork and spin mastery.",
      "Banaras Gharana: Known for compositional precision, mathematical construction, and taal complexity; developed in scholarly context; emphasizes intellectual understanding alongside physical performance.",
      "Raigarh Gharana: Less widespread but historically significant; developed through royal patronage; contributed distinctive compositional and improvisational approaches.",
      "Contemporary fusion lineages emerging from cross-gharana training and international exchanges, creating new performance possibilities while maintaining classical foundations."
    ],
    notableExponents: [
      "Lachhu Maharaj (1915-1989): Legendary Lucknow gharana dancer; renowned for emotional depth and abhinaya mastery; trained numerous disciples maintaining lineage.",
      "Birju Maharaj (1938-2020): Pre-eminent 20th-century figure; descended from Lucknow gharana; achieved international recognition bringing Kathak to global audiences.",
      "Sitara Devi (1920-2014): Female virtuoso challenging gender conventions; known for rhythmic brilliance and solo performance establishing female dancers' authority.",
      "Kumudini Lakhia (b. 1942): Pioneer of contemporary Kathak; created numerous innovative choreographies addressing social and philosophical themes while maintaining classical vocabulary.",
      "Durga Lal (1912-1989): Jaipur gharana master known for powerful rhythmic command and spin virtuosity; influential teacher establishing Jaipur style characteristics.",
      "Shovana Narayan (b. 1955): Contemporary dancer known for blending traditional excellence with contemporary social consciousness; innovative choreographer.",
      "Alaknanda Roy (b. 1960): Known for preserving traditional Lucknow gharana while creating new compositions exploring contemporary themes.",
      "Vijay Lal (b. 1963): Contemporary virtuoso combining technical brilliance with philosophical depth; known for innovative group compositions and cross-cultural collaborations."
    ],
    institutionsAndFestivals: [
      "Kathak Kendra, Delhi: Premiere national institution (founded 1959) for Kathak preservation and teaching; major center for guru-shishya based learning.",
      "University departments: Major universities including Delhi University, Banaras Hindu University, and Lucknow University incorporate Kathak into academic curricula.",
      "Sangeet Natak Akademi: National academy providing institutional validation, documenting performances, supporting artist residencies and international exchanges.",
      "State cultural organizations across Uttar Pradesh, Rajasthan, Madhya Pradesh supporting festivals and performances in traditional centers.",
      "International festivals: World music festivals, major international arts festivals featuring Kathak performances and furthering global dissemination.",
      "Private sabhas and dance venues in major Indian cities (Delhi, Mumbai, Bangalore) hosting regular Kathak concerts and collaborative performances.",
      "Diaspora institutions: International Kathak schools in London, New York, Singapore, and other major global cities sustaining the tradition outside India."
    ],
    modernContext: [
      "Kathak now encompasses traditional solo recital format (typically 2-3 hours), duet and ensemble compositions, and large-scale dance-theater productions.",
      "Contemporary choreographers address social issues (gender equity, environmentalism, communal harmony) while maintaining classical movement vocabulary.",
      "Fusion collaborations with Western contemporary dance, hip-hop, Bharatanatyam, and other traditions exploring Kathak's adaptability and cross-cultural potential.",
      "Film and television incorporating Kathak have expanded popular recognition; cinema introducing Kathak to millions globally.",
      "Gender integration: women now constitute substantial proportion of professional Kathak dancers, achieving recognition in roles traditionally dominated by males.",
      "Technology enabling new possibilities: video documentation, online learning platforms, digital notation systems preserving knowledge beyond hereditary transmission.",
      "Scholarly discourse examining Kathak's history, aesthetics, gender dynamics, and relationship to power structures; academic journals and books documenting the form's evolution.",
      "Ongoing tensions between preservation and innovation; between hereditary transmission and institutional pedagogy; between traditional structures and contemporary expressions remain creatively productive."
    ],
    quickFacts: {
      primaryRegion: "North India (particularly Lucknow, Jaipur, Uttar Pradesh, Rajasthan)",
      classicalCategory: "Indian Classical Dance - Hindustani tradition",
      musicalSystem: "Hindustani classical music framework",
      coreStrength: "Rhythmic virtuosity, improvisational mastery, abhinaya expression",
      centralConcentrators: "Time (Taal), Rhythm (Laya), Narrative (Katha)",
      premiereDerived: "Arangetre (debut performance); traditional duration typically 2-3 hours",
      costumeIdentity: "Angarkha/Kurta-Churidar (men), Lehenga-Choli (women); ankle bells essential",
      associatedDeity: "Lord Krishna (Nata Raja of the North)",
      keyInstruments: "Tabla, Sarangi/Harmonium, possibly string/wind instruments",
      trainPeriod: "Minimum 8-12 years intensive study; lifetime practice for mastery"
    },
    references: [
      { title: "Kathak - Wikipedia", url: "https://en.wikipedia.org/wiki/Kathak", type: "encyclopedic", notes: "General overview and historical information" },
      { title: "Sangeet Natak Akademi", url: "https://www.sangeetnatak.gov.in", type: "institutional", notes: "Official government academy documentation and artist profiles" },
      { title: "Birju Maharaj - Wikipedia", url: "https://en.wikipedia.org/wiki/Birju_Maharaj", type: "encyclopedic", notes: "Key revival figure in 20th century Kathak" },
      { title: "Lucknow Gharana - Classical Indian Dance Documentation", url: "https://www.ccrtindia.gov.in", type: "institutional", notes: "Government archive of classical arts" },
      { title: "Hindustani Classical Music and Kathak Relationship", url: "https://chandrakantha.com", type: "academic", notes: "Raga and tala educational resources" }
    ],
    lastReviewed: "2026-03-27"
  },
  odissi: {
    id: "odissi",
    name: "Odissi",
    overview:
      "Odissi is a major classical dance form from Odisha, noted for tribhangi (three-fold body bend) architecture, lyrical torso movement, sculptural fluidity, and deep links to Jagannath devotional culture. The form represents one of India's oldest continuous performance traditions, with archaeological evidence spanning 2000+ years, characterized by the synthesis of geometric precision with flowing lyricism, sacred ritual with secular artistry.",
    origin: "Odisha, Eastern India (primarily centered in Puri, Bhubaneswar, Cuttack, and surrounding temple regions)",
    timeline: [
      "Ancient period (2000 BCE - 500 CE): Archaeological evidence in Udayagiri and Khandagiri cave sculptures showing refined movement vocabularies; Mauryan and early post-Mauryan period cultural sophistication.",
      "Classical period (500-1300 CE): Konark Sun Temple (13th century) sculptural panels documenting extensive dance vocabulary; temple construction representing cultural pinnacle.",
      "Medieval period (1300-1700 CE): Mahari system institutionalized in Jagannath Temple; formal temple dancer recognition and compensation; hereditary knowledge transmission.",
      "Gotipua tradition emerges (15th-16th centuries): Male youth performers combining acrobatic training with classical movement, running parallel to Mahari system.",
      "Colonial suppression (1850-1903): Anti-nautch movement; 1903 temple ban on Mahari performances devastating hereditary communities; knowledge transmission severely threatened.",
      "20th-century revival (1950s-1960s): Kelucharan Mohapatra reconstructs form from remaining practitioners; Odissi Research Centre established (1958); Sangeet Natak Akademi recognition (1963).",
      "Modern era (1970s-present): International touring; institutional academic establishment; contemporary innovation while maintaining classical principles; Gotipua tradition revitalization."
    ],
    history: [
      "Odissi represents continuous cultural transmission spanning millennia through temple institutional structures; unique preservation mechanism enabling survival of ancient knowledge.",
      "Mahari system (historically 1500+ years): hereditary female temple dancers maintaining training, knowledge, and performance within family systems; relatively high social status until colonial period.",
      "Gotipua tradition: parallel male-centered system training young males (8-20 years) in combined martial and classical movement; distinct lineages and stylistic features.",
      "Colonial disruption nearly destroyed both traditions; economic devastation and social stigmatization displaced performers and threatened knowledge transmission.",
      "20th-century reconstruction required collaboration between hereditary practitioners maintaining knowledge despite suppression and visionary scholars recognizing cultural urgency.",
      "Modern revival accomplished by Kelucharan Mohapatra working with remaining Mahari and Gotipua practitioners, codifying traditions into teachable forms while maintaining authentic grammar.",
      "Contemporary Odissi balances preservation of classical purity with creative innovation; democratization of access through institutional teaching transforming gift of hereditary knowledge into public cultural treasure."
    ],
    templeTraditions: [
      "Jagannath Temple in Puri (founded ~1161 CE) represents spiritual and institutional center of Odissi; millions of pilgrims annually; four sacred dhams (pilgrimage destinations) of Hinduism.",
      "Mahari performers: formal temple ritualists with daily responsibilities; performed during specified worship times, festival seasons (especially Rath Yatra), and throughout temple calendar.",
      "Devotional context: dance as offering (upachara) to deity; spiritual practice linking performer and audience to divine through aesthetic experience; sacred time becoming performance time.",
      "Konark Sun Temple (13th century) and Mukteshwar Temple contain extensive sculptural programs documenting movement vocabulary; temples serving as visual textbooks for refined gesture vocabulary.",
      "Jagannath's annual Rath Yatra chariot festival incorporating elaborate performances; vehicle for enacting cosmic drama where universe dancing through cyclical processes.",
      "Other temple centers: Lingaraj Temple in Bhubaneswar, regional shrine festivals throughout Odisha maintaining Odissi within ritual contexts.",
      "Jayadeva's Gita Govinda profoundly shaping Odissi aesthetic; devotional poetry celebrating Krishna-Radha divine love becoming central to abhinaya repertoire and spiritual philosophical framework."
    ],
    repertoireAndTechnique: [
      "Mangalacharana: ritual opening invocation establishing sacred context; salutation to spiritual and artistic lineage.",
      "Batu Nrutya: pure movement passages establishing geometric patterns and fundamental vocabulary; tribhangi combinations.",
      "Pallavi: extended pure dance passage with multiple variations demonstrating technical command and rhythmic sophistication; extended exploration of single melodic phrase.",
      "Abhinaya: expressive storytelling employing facial expression, hand gesture, torso articulation interpreting devotional poetry, mythology, and human emotion.",
      "Odissi Nritya: fusion of abstract and expressive dimensions; intricate rhythmic footwork combined with emotional narrative within tala cycles.",
      "Tribhangi: defining postural element; three-fold body bend (head, torso, legs) at asymmetrical angles creating characteristic sculptural quality and fluid dynamism.",
      "Chowk: grounded stance with bent knees, square shoulder positioning establishing geometric foundation; alternates with tribhangi creating dynamic spatial vocabulary.",
      "Aramandi: crouched position with bent knees and squared proportions; fundamental posture appearing throughout repertoire; similar to Bharatanatyam aramandi but with distinctive Odissi characteristics.",
      "Footwork vocabulary: intricate rhythmic patterns often featuring characteristic Odissi accents; tala structures typically in eightfold (ashtacatvari) cycles.",
      "Gat: sometimes used as compositional framework exploring fixed movement sequences with variations; structural element similar to varnam in Bharatanatyam."
    ],
    musicAndPerformance: [
      "Odissi raga system: distinct ragas and melodic frameworks specific to Odissi musical tradition; regional variations from Hindustani and Carnatic classical frameworks.",
      "Mardala percussion: two-headed drum providing primary rhythmic accompaniment; central to Odissi performance aesthetic creating distinctive timbral quality.",
      "Vocal poetry: Odia devotional compositions, Sanskrit verses, Gita Govinda selections sung by accompanying vocalist; textual content carrying spiritual and aesthetic meaning.",
      "Sarangi, sitar, or flute may provide melodic accompaniment; ensemble arrangements varying by performance context and regional tradition.",
      "Tala cycles: typically in ashtacatvari (eightfold) structures; rhythmic frameworks organizing improvisation and composition; resolution on beat one (sam) marking structural cadences.",
      "Odissi musical instruments including mridangam (South Indian style drums), sitar, sarod contributing to ensemble sound texture.",
      "Padhant (rhythmic recitation): sometimes used to articulate complex rhythmic structures and footwork patterns, making abstract patterns audible.",
      "Musical accompaniment balancing support for abstract rhythmic passages with reinforcement of narrative meaning in abhinaya sections."
    ],
    costumeAndVisualLanguage: [
      "Traditional female costume: brightly colored silk saree or orhni (traditional wrapper garment) typically in yellow, orange, or color combinations reflecting regional preferences.",
      "Male costume: traditional dhoti (wraparound lower garment) and bandi (sleeveless upper garment) in complementary colors.",
      "Jewelry: ornamental neck and arm pieces; ankle bells providing sonic reinforcement of rhythmic patterns.",
      "Makeup: minimal compared to Kathakali; emphasis on clarity of facial expression and eye articulation; sometimes subtle kohl highlighting eyes.",
      "Hair adornment: traditional styling with flowers or simple ornaments supporting the flow of movement.",
      "Overall aesthetic: costume design emphasizing fluidity and sculptural elegance; balance between classical restraint and expressive richness."
    ],
    philosophyAndAesthetics: [
      "Tribhangi as philosophical principle: three-fold body bend representing cosmic harmony and dynamic balance within geometric framework.",
      "Fluid geometry: curves and circular movements within structured temporal cycles; balance between rigidity and flow.",
      "Rasa aesthetics: emotional flavor accessed through rhythmic mastery and expressive refinement; audience emotion responding to dancer's inner state.",
      "Continuity and innovation: Odissi preserves ancient vocabulary while remaining open to creative elaboration and contemporary expression.",
      "Spiritual dimension: performance as devotional practice; sacred geometry underlying movement vocabulary linking dancer to cosmic principles.",
      "Gender and grace: refined aesthetic traditionally valued; contemporary understanding recognizing these qualities transcend gender boundaries.",
      "Integration of traditions: synthesis of Hindu devotional traditions with secular artistry; ancient temple practice continuing within modern concert contexts.",
      "Presence and consciousness: performance demanding full concentration and moment-to-moment awareness; meditative state accessed through disciplined physical practice."
    ],
    majorSchoolsOrLineages: [
      "Odissi Parampara (general tradition): Rooted in temple practice, preserved through family transmission.",
      "Odissi Research Centre lineage: Founded by Kelucharan Mohapatra; emphasis on classical purity and codified technique.",
      "Contemporary lineages: Emerging through institutional teaching; modern adaptations maintaining classical foundations.",
      "Gotipua tradition parallel: Male youth-centered system maintaining distinct characteristics while sharing core movement vocabulary.",
      "Regional variations: Subtle differences in stylistic emphasis across Puri, Bhubaneswar, and other Odisha regions."
    ],
    notableExponents: [
      "Kelucharan Mohapatra (1926-2004): Legendary reconstructor of Odissi; worked with Mahari and Gotipua practitioners; founded Odissi Research Centre; achieved international recognition.",
      "Sanjukta Panigrahi (1942-1997): Pre-eminent dancer bringing Odissi to global stage; known for sculptural refinement and emotional depth; pioneering contemporary choreographies.",
      "Madhavi Mudgal (b. 1949): Contemporary virtuoso; known for technical brilliance and innovative approaches while maintaining classical vocabulary.",
      "Bijayiniharana Saxena (b. 1960): Notable dancer and choreographer exploring contemporary social themes within classical framework.",
      "Ileana Citaristi (1942-2011): Italian-born Odissi exponent; brought Odissi to European audiences; demonstrated form's cross-cultural adaptability.",
      "Jacqueline Cormeau (b. 1952): French Odissi dancer pioneering the form's dissemination in Europe; established Odissi practice and teaching internationally.",
      "Ramli Ibrahim (b. 1955): Malaysian dancer bringing Odissi to Southeast Asia; founding dancer and director of Sutra Dance Theatre.",
      "Aruna Mohanty (b. 1965): Contemporary dancer exploring feminist perspectives within classical framework; known for social activist choreographies."
    ],
    institutionsAndFestivals: [
      "Odissi Research Centre, Delhi: Founded by Kelucharan Mohapatra; premier institution for Odissi preservation and transmission.",
      "State Government of Odisha cultural organizations: Supporting Odissi performances, festivals, and institutional frameworks.",
      "Sangeet Natak Akademi: National academy providing recognition, documentation, and research support for Odissi tradition.",
      "International dance festivals: World music festivals, Asian arts festivals, and specialized Odissi events disseminating the form globally.",
      "University dance departments: Major universities incorporating Odissi into academic curricula and research frameworks.",
      "Private academy circles: Individual dancers and schools teaching Odissi across India and internationally.",
      "Diaspora institutions: Odissi centers in London, Paris, Malaysia, Singapore, and North America maintaining the tradition outside India."
    ],
    modernContext: [
      "Odissi now encompasses traditional solo performances, ensemble compositions, and large-scale theater productions.",
      "Contemporary choreographers addressing social issues (gender equity, environmental themes) while maintaining classical movement vocabulary.",
      "Fusion collaborations with Bharatanatyam, Western contemporary dance, and other traditions exploring Odissi's adaptability.",
      "Institutional teaching through universities and private academies democratizing access to hereditary knowledge.",
      "Gender integration: women and men now equally represented in professional Odissi; contemporary understanding transcending traditional gender restrictions.",
      "Global touring of Odissi productions; international recognition as major classical form comparable to Bharatanatyam and Kathak.",
      "Scholarly documentation through academic journals; preservation efforts through digital archives and video documentation.",
      "Ongoing negotiations between preservation and innovation; between temple traditions and secular concert contexts; between hereditary transmission and institutional pedagogy."
    ],
    quickFacts: {
      primaryRegion: "Odisha, Eastern India",
      classicalCategory: "Indian Classical Dance",
      characteristicElement: "Tribhangi (three-fold body bend)",
      musicalSystem: "Odissi classical music framework",
      mainPerformanceUnit: "Solo recital or ensemble production",
      culturalHeritage: "Temple traditions through Mahari and Gotipua systems",
      revivalFigure: "Kelucharan Mohapatra (20th century)"
    },
    references: [
      { title: "Odissi - Wikipedia", url: "https://en.wikipedia.org/wiki/Odissi", type: "encyclopedic", notes: "General overview and historical information" },
      { title: "Sangeet Natak Akademi", url: "https://www.sangeetnatak.gov.in", type: "institutional", notes: "Official government academy documentation" },
      { title: "Kelucharan Mohapatra - Wikipedia", url: "https://en.wikipedia.org/wiki/Kelucharan_Mohapatra", type: "encyclopedic", notes: "Key revival figure" },
      { title: "Sanjukta Panigrahi - Wikipedia", url: "https://en.wikipedia.org/wiki/Sanjukta_Panigrahi", type: "encyclopedic", notes: "Legendary Odissi exponent" },
      { title: "Odissi Research Centre", url: "https://www.odissiresearchcentre.com", type: "institutional", notes: "Premier Odissi institution" }
    ],
    lastReviewed: "2026-03-27"
  },
  kathakali: {
    id: "kathakali",
    name: "Kathakali",
    overview:
      "Kathakali is a major classical theatre form from Kerala combining elaborate makeup, ornate costumes, precise hand gesture vocabularies, and powerful rhythmic footwork with Kudiyattam-derived dialogue and Malayalam storytelling to create an immersive multi-sensory dramatic experience. It synthesizes ancient Sanskrit performance theory with Kerala's unique regional aesthetic sensibilities, producing a sophisticated form blending martial physicality with refined emotional expression.",
    origin: "Kerala, South India (particularly in Kottayam, Kunnamkulam, Thiruvananthapuram, and surrounding regions)",
    timeline: [
      "Ancient Kerala (pre-16th century): Diverse performance traditions including Koodiyattam (Sanskrit drama), Krishnanattam antecedents, and ritual theatrical practices.",
      "Krishnanattam tradition (16th century): Created ~1555-1585 CE by Kunjan Nambiar; narrative Krishna dramas performed in temples with elaborate costumes and all-night performance format.",
      "Ramanattam tradition (emerging parallel): Similar dramatic narrative form focusing on Ramayana episodes; distinct lineages and stylistic characteristics.",
      "Kathakali crystallization (17th century): Evolution from Krishnanattam/Ramanattam incorporating new physical vocabularies, elaborate makeup systems, and increasingly secular court patronage.",
      "Royal patronage era (17th-19th centuries): Kathakali becomes sophisticated court entertainment under Raja rulers; Kottarakkara and Travancore courts becoming major centers.",
      "Colonial period (1800-1947): Economic decline of court patronage; Kathakali faces institutional challenges though continues within temple and community contexts.",
      "20th-century revival (1930s-1960s): Kerala Kalamandalam founded (1930); Sangeet Natak Akademi recognition (1953) providing institutional support and national platform.",
      "Modern era (1960s-present): International touring; academic incorporation; institutional standardization; contemporary productions and gender integration."
    ],
    history: [
      "Kathakali represents synthesis of Kerala's ancient theatrical sophistication with Sanskrit performance theory, resulting in uniquely cosmopolitan form.",
      "Evolution from Krishnanattam (temple-based Krishna narratives) demonstrates how regional theatrical innovations emerge from specific devotional contexts and cultural patronage.",
      "Hereditary family-based transmission (gurukulam system) preserved knowledge across generations with remarkable precision and continuity.",
      "Court patronage during royal era enabled elaborate theatrical productions, specialized musician maintenance, and aesthetic elaboration distinguishing Kathakali from other forms.",
      "Colonial disruption severed traditional patronage relationships; economic hardship threatened hereditary communities; knowledge transmission faced severe challenges.",
      "20th-century institutional revival through Kerala Kalamandalam and government support restored professional viability and enabled broader dissemination.",
      "Contemporary Kathakali embodies both classical preservation and creative innovation; gender integration and cross-cultural collaborations expanding traditional boundaries while maintaining core philosophical foundations."
    ],
    templeTraditions: [
      "Krishnanattam origins in temple contexts: Vadakkunnathan Temple in Kunnamkulam, Thiruvananthapuram temple complex serving historical performance venues.",
      "Temple festival performances: Kathakali integrated into Kerala temple festival cycles (especially Rath Yatra and regional celebrations); nocturnal performances connecting to sacred time.",
      "Narrative content: Hindu epics (Mahabharata, Ramayana, Bhagavata Purana) forming repertoire; mythological stories as vehicle for exploring cosmic principles and ethical philosophy.",
      "Ritual contexts: Temple performances functioning as ritual enactment; divine characters embodied through movement and makeup; audience participation in spiritual communion.",
      "All-night performance tradition: Temple contexts enabling extended narrative performances (Keli) lasting from dusk to dawn; immersive theatrical experience creating heightened devotional atmosphere.",
      "Contemporary temple connections: Modern performances often conducted during festival seasons; spiritual framing maintained even in secular concert contexts through invocatory pieces and sacred narratives."
    ],
    repertoireAndTechnique: [
      "Thari (basic foot position): grounded stance with bent knees, squared shoulders establishing geometric foundation; characteristic Kathakali postural stance.",
      "Adavus: rhythmic footwork patterns organized in sequences; precise foot articulation with characteristic Kathakali accents and weight distribution.",
      "Mudras (hand gestures): codified system of single-hand and double-hand gestures carrying specific meanings; highly developed vocabulary enabling sophisticated communication.",
      "Facial expression (Rasa Abhinaya): elaborate system of eye movements (netrabhinaya), eyebrow articulations, lip movements, and facial musculation training creating emotional communication.",
      "Eye control (Netra Chari): specialized training in eye movements (up, down, side to side, rotating); eyes functioning as primary emotional communication channel.",
      "Character-specific movement logic (Pachcha, Kathi, Kari roles): each character type employing distinctive movement patterns, speed, spatial quality, and emotional expression.",
      "Kalaripayattu integration: martial arts training (Kerala's ancient fighting system) providing physical foundation; powerful leg strength and stamina enabling extended performances.",
      "Mridayangam hand techniques: advanced hand percussion techniques training hands for both drumming and gesture display; hand dexterity enabling rapid expressive changes.",
      "Nritya (expressive narrative): abhinaya conveying story meaning, character psychology, and emotional nuances through refined gestural vocabulary.",
      "Nritta (rhythmic structure): abstract patterns established through footwork and percussion providing temporal framework for narrative content."
    ],
    musicAndPerformance: [
      "Percussion ensemble: Chenda (double-headed drum) providing primary rhythmic drive; Maddalam (barrel drum) adding harmonic complexity; Kuzhal (bamboo flute) providing melodic accompaniment.",
      "Vocal narration: Singers reciting Sanskrit verses, Mahabharata/Ramayana passages; vocal text carrying narrative meaning and emotional resonance.",
      "Koodiyottam (commentary): Commentatorial vocalist explaining narrative, character motivation, and thematic significance; educational function accompanying performance.",
      "Goshti system: ensemble cooperation where musicians synchronize with dancers' movements; musicians following dancer's pace and space in collaborative creation.",
      "Tala cycles: rhythmic frameworks organizing improvisation and composition; resolution points (sam) marking dramatic climaxes and transitions.",
      "Ragas/Ragam: melodic frameworks supporting emotional content and scene atmosphere; specific ragas associated with particular character types and emotional states.",
      "Musical dynamics: crescendi accompanying dramatic intensity; musical silence creating dramatic tension; sound and silence working together for theatrical effect.",
      "Extended duration performances: traditional Kathakali performances lasting 3-8 hours or overnight; extended temporal framework enabling elaborate narrative development and emotional gradation."
    ],
    costumeAndVisualLanguage: [
      "Makeup (Vesham) categories: Green (Pachcha) for noble heroes; Red (Kathi) for evil antagonists; Black (Kari) for demons and fierce characters; Female characters with distinctive white-based makeup.",
      "Facial makeup artistry: elaborately applied with specific pigments, oils, and materials creating three-dimensional effect; colors carrying specific character meanings recognizable to audiences.",
      "Headgear (Mudi): tall elaborate headdresses varying by character type contributing to visual stature and majesty; constructed from palm leaves and other materials.",
      "Costume silhouettes: highly constructed garments (mundu - wraparound skirt, blouses, upper coverings) creating distinctive character profiles even before movement begins.",
      "Jewelry and metal ornaments: elaborate neck pieces, arm rings, waist ornaments contributing to visually impressive appearance; gold and silver reflecting royal or divine status.",
      "Breast plates (Kavacha): heavily padded upper body structures for certain characters; costume architecture creating powerful physical presence.",
      "Color symbolism: color choices (makeup and costume) functioning as immediate visual communication of character moral status and emotional qualities.",
      "Hair and facial hair: distinctive arrangements and styling contributing to immediate character recognition; elaborate facial hair for certain male character types.",
      "Overall visual grammar: costume, makeup, headgear, and body positioning enabling audience to recognize character identity, emotional state, and dramatic function immediately upon appearance."
    ],
    philosophyAndAesthetics: [
      "Rasa theory application: particular emphasis on Raudra (fury) and Vira (heroism) rasas through dramatic combat and confrontation; complementary rasas (pathos, love, peace) providing emotional variety.",
      "Character as cosmic principle: divine beings embodying universal principles; human characters representing ethical choices and dharmic struggles; cosmic order manifest through character interactions.",
      "Visual semiotics: elaborate system of visual communication (makeup, costume, gesture) creating sophisticated theatrical language requiring audience learning and interpretation.",
      "Catharsis through identification: audience emotional participation through character identification; vicarious experience of ethical dilemmas, spiritual realization, and emotional transformation.",
      "Sacred theatrical context: performance functioning as ritual enactment despite secular concert formats; divine characters embodied on stage; transcendental experiences accessible through aesthetic form.",
      "Dramatic intensity through codification: emotional power achieved through highly formalized expressions; constraint enabling rather than limiting expressive depth.",
      "Bhakti aesthetics: devotional surrender through narrative participation; audience as witness to divine play (lila); theoretical framework grounding emotional and spiritual experience.",
      "Integration of multiple art forms: dance, music, drama, spectacle creating multisensory immersive experience; philosophical sophistication achieved through aesthetic complexity."
    ],
    majorSchoolsOrLineages: [
      "Kunnamkulam lineage: historical tradition associated with Vadakkunnathan Temple; respected center for classical transmission and contemporary experimentation.",
      "Kalamandalam tradition: most influential modern lineage; established through Kerala Kalamandalam institutional structure; produced numerous distinguished performers and teachers.",
      "Kottakkal lineage: distinct regional tradition with specific stylistic emphasis; contributed significantly to contemporary Kathakali maintenance and innovation.",
      "Thiruvananthapuram temple lineage: royal court-associated tradition; maintained through temple institutional structure.",
      "Contemporary fusion lineages: emerging from cross-lineage training and international exchanges; creating new performance possibilities while respecting classical foundations."
    ],
    notableExponents: [
      "Kalamandalam Krishnan Nair (1902-1997): Legendary choreographer and performer; founder Kalamandalam's artistic direction; pioneered modern Kathakali codification.",
      "Kunj Kurup (1901-1971): Founder of Kerala Kalamandalam; visionary playwright and scholar, establishing Kathakali as national art form.",
      "Kottakkal Neelakanta Pillai (historical figure): Master teacher maintaining Kottakkal tradition; influential in contemporary Kathakali aesthetics.",
      "Kalamandalam Gopi (b. 1947): International virtuoso known for technical brilliance and interpretive depth; achieved international recognition through global touring.",
      "Kottakkali Sivaraman (contemporary): Distinguished performer and teacher maintaining traditional excellence.",
      "Shymala Narayanan (b. 1964): Contemporary female Kathakali artist challenging traditional gender boundaries; achieved outstanding recognition in predominantly male field.",
      "Margi Vijayakumar (contemporary): Innovative choreographer and performer exploring contemporary themes within classical grammar.",
      "K.V. Shajahan (contemporary): Known for scholarly approach and traditional excellence; significant international performer."
    ],
    institutionsAndFestivals: [
      "Kerala Kalamandalam, Kunnamkulam (founded 1930): Premier national institution for Kathakali preservation, teaching, and artistic development.",
      "Sangeet Natak Akademi: National academy providing institutional validation, artist residencies, documentation, and international exchange support.",
      "University departments: Major Kerala universities incorporating Kathakali into academic curricula and research frameworks.",
      "Koodiyattam Kendra: Institution preserving related Sanskrit drama tradition; cross-pollination with Kathakali aesthetics.",
      "State cultural organizations: Various Kerala government agencies supporting festivals and performances.",
      "Temple festivals: Kathakali performances during Rath Yatra and regional temple celebrations maintaining ceremonial contexts.",
      "International festivals: World theatre festivals, modern dance festivals, and major cultural events worldwide featuring Kathakali.",
      "Diaspora institutions: International Kathakali schools and cultural organizations in North America, Europe, Asia establishing practice communities."
    ],
    modernContext: [
      "Kathakali now encompasses traditional overnight performances alongside condensed concert formats (2-3 hours) adapted for contemporary audiences.",
      "Contemporary choreographers creating new original stories while maintaining classical movement vocabulary; addressing modern social, philosophical, and political themes.",
      "Gender integration: women increasingly performing traditionally male Pachcha (hero) roles; challenging hereditary male dominance while expanding interpretive possibilities.",
      "Fusion collaborations: contemporary experiments integrating Kathakali with Western theatre, contemporary dance, multimedia technologies expanding artistic possibilities.",
      "Educational democratization: institutional teaching enabling non-hereditary access; knowledge transmission through university curricula and specialized schools.",
      "International touring: global performances expanding recognition; cross-cultural exchanges introducing Kathakali to diverse international audiences.",
      "Technology enabling documentation, video dissemination, and online learning expanding access beyond geographical constraints.",
      "Academic scholarship examining Kathakali's history, gender dynamics, contemporary significance, and philosophical foundations; scholarly discourse deepening understanding.",
      "Ongoing creative dialogue between preservation of documented classical forms and innovative contemporary expression; tension remaining dynamically productive."
    ],
    quickFacts: {
      primaryRegion: "Kerala (especially Kunnamkulam, Kottayam, Thiruvananthapuram)",
      classicalCategory: "Indian Classical Dance-Drama, theatrical form",
      coreIdentity: "Codified character acting, elaborate makeup systems, narrative theatre",
      characterTypes: "Pachcha (noble heroes), Kathi (evil antagonists), Kari (demons), female characters distinct makeup systems",
      makeupColors: "Green (nobility), Red (evil), Black (demons), White-based (feminine characters)",
      musicalSystem: "Kerala classical music with ragas and talas",
      primaryPercussion: "Chenda (double-headed drum), Maddalam, Kuzhal flute",
      physicalBasis: "Kalaripayattu (martial arts) training; powerful leg strength and stamina",
      trainingDuration: "Minimum 8-12 years; lifetime for mastery",
      performanceDuration: "Traditional overnight (8+ hours); contemporary concerts typically 2-3 hours",
      narrativeSource: "Hindu epics (Mahabharata, Ramayana, Bhagavata Purana)",
      associatedGeography: "exclusively Kerala tradition, unlike pan-Indian classical forms"
    },
    references: [
      { title: "Kathakali - Wikipedia", url: "https://en.wikipedia.org/wiki/Kathakali", type: "encyclopedic", notes: "General overview and historical information" },
      { title: "Sangeet Natak Akademi", url: "https://www.sangeetnatak.gov.in", type: "institutional", notes: "Official documentation and artist profiles" },
      { title: "Kerala Kalamandalam", url: "https://www.kalamandalam.org", type: "institutional", notes: "Premier institution for Kathakali preservation and teaching" },
      { title: "Kalamandalam Krishnan Nair Legacy", url: "https://en.wikipedia.org/wiki/Kalamandalam_Krishnan_Nair", type: "encyclopedic", notes: "Key figure in modern Kathakali codification" },
      { title: "Kunj Kurup - Kathakali Pioneer", url: "https://en.wikipedia.org/wiki/Kunj_Kurup", type: "encyclopedic", notes: "Founder of Kalamandalam; revival figure" },
      { title: "Classical Indian Theatre - Kathakali Context", url: "https://ccrtindia.gov.in", type: "institutional", notes: "Government archives of classical arts documentation" },
      { title: "Sacred Theatre Traditions of South Asia", url: "https://en.wikipedia.org/wiki/Koodiyattam", type: "encyclopedic", notes: "Related Sanskrit drama tradition context" }
    ],
    lastReviewed: "2026-03-27"
  }
};

export const danceKnowledgeList = Object.values(danceKnowledgeById);
