import bharatanatyamImg from "@/assets/bharatanatyam.jpg";
import kathakImg from "@/assets/kathak.jpg";
import odissiImg from "@/assets/odissi.jpg";
import kathakaliImg from "@/assets/kathakali.jpg";

export interface Dance {
  id: string;
  name: string;
  origin: string;
  shortDescription: string;
  description: string;
  history: string;
  templeTraitions: string;
  philosophy: string;
  famousMudras: string[];
  imageUrl: string;
}

export const dances: Dance[] = [
  {
    id: "bharatanatyam",
    name: "Bharatanatyam",
    origin: "Tamil Nadu",
    shortDescription: "One of the oldest classical dance forms, known for its grace, purity, tenderness, and sculpturesque poses.",
    description: "Bharatanatyam is a major form of Indian classical dance that originated in Tamil Nadu. It has its roots in the Natyashastra, an ancient treatise on the performing arts.",
    history: "Bharatanatyam is one of the oldest classical dance traditions in India, with origins tracing back over 2,000 years to the temples of Tamil Nadu. It was originally performed by Devadasis (temple dancers) as a form of devotion and later revived in the 20th century by pioneers like Rukmini Devi Arundale.",
    templeTraitions: "This dance form has deep connections to Hindu temple traditions, particularly in South India. The sculptures at Chidambaram, Thanjavur, and other temples depict many of the 108 karanas (dance poses) described in the Natyashastra.",
    philosophy: "Bharatanatyam embodies the concept of Natya Yoga — the path to spiritual liberation through dance. It expresses the Nava Rasas (nine emotions) and connects the dancer to the divine through movement, rhythm, and expression.",
    famousMudras: ["Anjali", "Alapadma", "Kartarimukha", "Pataka"],
    imageUrl: bharatanatyamImg,
  },
  {
    id: "kathak",
    name: "Kathak",
    origin: "North India",
    shortDescription: "A storytelling dance form characterized by rhythmic footwork, spins, and expressive gestures.",
    description: "Kathak is one of the major classical dance forms of India, originating from the travelling bards of North India known as Kathakars or storytellers.",
    history: "Kathak evolved from the storytelling traditions of ancient North India. The Kathakars would narrate stories from the epics and mythology through dance. Under the Mughal era, it absorbed Persian and Central Asian influences, developing the gharana system with distinct styles.",
    templeTraitions: "Originally performed in temples and later in royal courts, Kathak carries the dual legacy of Hindu devotional traditions and Mughal courtly elegance. The Lucknow and Jaipur gharanas represent these different influences.",
    philosophy: "Kathak explores the interplay of time (taal) and space through intricate footwork and spins. It embodies the philosophy that rhythm is the heartbeat of the universe, and through mastery of rhythm, one can transcend the mundane.",
    famousMudras: ["Pataka", "Tripataka", "Mayura", "Hamsasya"],
    imageUrl: kathakImg,
  },
  {
    id: "odissi",
    name: "Odissi",
    origin: "Odisha",
    shortDescription: "A lyrical dance form known for its fluid movements, tribhangi posture, and temple sculpture-inspired poses.",
    description: "Odissi is one of the pre-eminent classical dance forms of India, originating from the state of Odisha. It is known for its sculpturesque quality and fluid grace.",
    history: "Odissi has archaeological evidence dating back to the 2nd century BCE, making it one of the oldest surviving dance forms. The caves of Udayagiri and Khandagiri contain the earliest evidence. It was revived in the mid-20th century from the Mahari (temple dancer) and Gotipua traditions.",
    templeTraitions: "Deeply connected to the Jagannath temple tradition of Puri, Odissi was performed as a sacred offering. The Konark Sun Temple and Mukteshwar Temple feature extensive dance sculptures that form the basis of many Odissi poses.",
    philosophy: "Odissi embodies the Tribhangi — a three-fold bending of the body symbolizing the union of the physical, mental, and spiritual realms. It draws heavily from Jayadeva's Gita Govinda, exploring devotion and divine love.",
    famousMudras: ["Chandrakala", "Ardhachandra", "Mushti", "Katakamukha"],
    imageUrl: odissiImg,
  },
  {
    id: "kathakali",
    name: "Kathakali",
    origin: "Kerala",
    shortDescription: "A dramatic dance-theater form famous for its elaborate costumes, vivid makeup, and powerful storytelling.",
    description: "Kathakali is a major form of classical Indian dance and dance-drama from Kerala, known for its elaborate costumes, detailed gestures, and well-defined body movements.",
    history: "Kathakali evolved in the 17th century from earlier art forms like Krishnanattam and Ramanattam. It was patronized by the rulers of Kottarakkara and Travancore. The art form combines elements of dance, music, and acting to present stories from Hindu epics.",
    templeTraitions: "While Kathakali is performed both in temples and secular settings, it has strong connections to Kerala's temple festivals. Performances traditionally begin at dusk and continue through the night, creating an immersive ritualistic experience.",
    philosophy: "Kathakali is built on the Natyashastra's rasa theory, with particular emphasis on the heroic (Vira) and furious (Raudra) sentiments. The elaborate makeup system (Vesham) categorizes characters by their moral nature — green for noble, red for evil, and black for demons.",
    famousMudras: ["Hamsapaksha", "Samdamsha", "Mushti", "Sikhara"],
    imageUrl: kathakaliImg,
  },
];
