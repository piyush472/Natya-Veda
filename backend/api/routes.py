from flask import Blueprint, request, jsonify
# from .mudra_detection import MudraDetector
# import cv2
# import numpy as np
# from PIL import Image
# import io

api_bp = Blueprint('api', __name__)

# Initialize mudra detector (commented out for now due to dependency issues)
# detector = MudraDetector()

# Complete dance data (moved from frontend)
DANCES = {
    "bharatanatyam": {
        "id": "bharatanatyam",
        "name": "Bharatanatyam",
        "origin": "Tamil Nadu",
        "shortDescription": "One of the oldest classical dance forms, known for its grace, purity, tenderness, and sculpturesque poses.",
        "description": "Bharatanatyam is a major form of Indian classical dance that originated in Tamil Nadu. It has its roots in the Natyashastra, an ancient treatise on the performing arts. With over 2,000 years of documented history, it represents the spiritual and aesthetic pinnacle of South Indian classical traditions.",
        "history": "Bharatanatyam is one of the oldest classical dance traditions in India, with origins tracing back over 2,000 years to the temples of Tamil Nadu. It was originally performed by Devadasis (temple dancers) as a form of devotion and later revived in the 20th century by pioneers like Rukmini Devi Arundale.",
        "completeHistory": {
            "ancientOrigins": "Bharatanatyam's documented history stretches back over 2,000 years into the vibrant Tamil civilization. The most authoritative textual source is the Natya Shastra, attributed to the sage Bharata Muni, dated between 500 BCE and 500 CE. This monumental treatise, structured into 36 chapters with approximately 6,000 verses, provides foundational theory for Bharatanatyam and all classical Indian dance forms. The term 'Bharatanatyam' is a backronym—'Bha' for Bhavam (emotions), 'Ra' for Ragam (melody), 'Tam' for Talam (rhythm)—meaning a dance harmoniously integrating emotion, melody, and rhythm. Archaeological evidence from Kanchipuram's Shiva temple (6th-9th century CE) confirms refined dance was a well-developed performance art by the mid-1st millennium CE. The ancient Tamil epic Silappatikaram (circa 2nd century CE) provides crucial historical references including the story of dancer Madhavi. The Sangam texts (3rd-1st century BCE) mention dancers and their sophisticated techniques. The Chola dynasty (9th-13th century CE), particularly Raja Raja Chola I, systematically patronized and refined Bharatanatyam, establishing it as a sophisticated sacred art. The magnificent Brihadeeswarar Temple in Thanjavur, built around 1010 CE, became a renowned center for dance development and patronage.",
            "templeHeritage": "Bharatanatyam is fundamentally inseparable from Hindu temple spirituality, particularly the worship of Lord Shiva as Nataraja—the divine dancer whose circular movements represent eternal cycles of creation, preservation, and destruction. The Chidambaram Nataraja Temple in Tamil Nadu is the spiritual epicenter of Bharatanatyam. This sacred temple houses the most iconic sculptural representation of the 108 Karanas (fundamental dance poses) from the Natya Shastra, carved in stone as visual blueprints that dancers study and embody. These 108 Karanas represent the absolute vocabulary of classical movement. The Brihadeeswaraj Temple in Thanjavur, a UNESCO World Heritage Site built by Raja Raja Chola I, is equally significant with elaborate stone sculptures and reliefs depicting an extensive array of dance postures. Other vital temple centers include Meenakshi Temple in Madurai, Parthasarathy Temple in Chennai, and multiple Kumbakonam temples. These temples functioned as dual-purpose institutions: temples for worship and academies for dance education. The spatial geometry of temple courtyards directly shaped how dancers moved and positioned themselves on stage.",
            "devadasiTradition": "The Devadasi system, spanning more than 1,500 years, represents a complex and deeply misunderstood chapter in Bharatanatyam history. The word 'Devadasi' literally means 'servant of the deity'—women dedicated to temples as an act of religious devotion and family honor. During this tradition's height, Devadasis were highly trained, educated women who performed as dancers, singers, musicians, scholars, and custodians of sacred knowledge. Their daily temple performances were integral to worship rituals, performed during specific ceremonies and festivals. The training system was extraordinarily rigorous: young girls underwent decades of systematic instruction in Guru-Shishya Parampara (teacher-student succession lineage), learning movement, music, Sanskrit, philosophy, and spiritual practices. This institutional structure ensured remarkable continuity in preserving the dance form for centuries. Modern scholarship shows courtesan culture emerged later in the 16th-17th century, distinct from classical temple dancers. Yet by the late 19th century, colonial prejudices led to systematic marginalization. By the early 20th century, Devadasis faced severe social stigma despite their historical roles as respected community members. Yet the Devadasi system's greatest legacy is undeniable: it preserved Bharatanatyam's technical purity and intricate subtleties through centuries.",
            "modernRevival": "The colonial period of the late 19th and early 20th centuries proved critical for Bharatanatyam's survival. In 1892, the Christian reform movement launched the 'anti-dance movement.' In 1910, the British colonial government in the Madras Presidency issued a formal ban on temple dancing, effectively prohibiting the classical performance tradition in Hindu temples. This devastating ban sparked fierce resistance from the Tamil community, who recognized a priceless cultural heritage under existential threat. The revival became intertwined with India's nationalist movement. E. Krishna Iyer, a lawyer and devoted classical arts advocate, challenged colonial narratives by questioning why an art requiring years of disciplined training could be about immorality. He was imprisoned for his nationalist activism but continued advocating for arts preservation. Rukmini Devi Arundale emerged as the pivotal figure—a woman of elite social standing who brought unprecedented legitimacy to the dance form. In 1932-1933, E. Krishna Iyer and Rukmini Devi proposed renaming the dance to 'Bharatanatyam'—incorporating the profound philosophy of the Natya Shastra, lending it scholarly gravitas. In 1936, Rukmini Devi founded the Kalakshetra Academy in Chennai, which became the premier institution for preserving and systematizing Bharatanatyam. Balasaraswati also played a transformative role in revival. The Thanjavur Quartet formalized the structural organization of Bharatanatyam performances, codifying the seven-to-eight-part Margam sequence. By independence in 1947, Bharatanatyam had been repositioned from a marginalized temple tradition into a nationally celebrated classical art form.",
            "contemporaryEra": "Since independence, Bharatanatyam has undergone remarkable transformation into a truly global cultural phenomenon. In 1955, post-independent India established state-sponsored dance festivals to celebrate classical arts on a national platform. The Sangeet Natak Akademi formally recognized Bharatanatyam as a major classical dance tradition, granting it official status. Universities across India incorporated Bharatanatyam into curricula. The late 20th century saw extraordinary dancers advancing the form: Padma Subrahmanyam, Alarmel Valli, Sonal Mansingh, and others expanded the repertoire while maintaining classical foundations. Film, television, and digital media made Bharatanatyam accessible to billions worldwide. In 2001, UNESCO formally recognized Bharatanatyam as a Masterpiece of the Oral and Intangible Heritage of Humanity—placing it among the world's most important cultural expressions. Today, thousands of students learn Bharatanatyam in dance schools and universities on every continent. The Indian diaspora played a crucial role in globalization, establishing schools in Britain, North America, Australia, and elsewhere. Modern innovations continue as choreographers create entirely new pieces while honoring tradition. Bharatanatyam today represents a living, continuously evolving tradition that honors 2,000 years of heritage while remaining vibrantly contemporary."
        },
        "templeTraitions": "This dance form has deep connections to Hindu temple traditions, particularly in South India. The sculptures at Chidambaram, Thanjavur, and other temples depict many of the 108 karanas (dance poses) described in the Natyashastra.",
        "philosophy": "Bharatanatyam embodies the concept of Natya Yoga — the path to spiritual liberation through dance. It expresses the Nava Rasas (nine emotions) and connects the dancer to the divine through movement, rhythm, and expression.",
        "famousMudras": ["Anjali", "Alapadma", "Kartarimukha", "Pataka"]
    },
    "kathak": {
        "id": "kathak",
        "name": "Kathak",
        "origin": "North India",
        "shortDescription": "A storytelling dance form characterized by rhythmic footwork, spins, and expressive gestures.",
        "description": "Kathak is one of the major classical dance forms of India, originating from the travelling bards of North India known as Kathakars or storytellers.",
        "history": "Kathak evolved from the storytelling traditions of ancient North India. The Kathakars would narrate stories from the epics and mythology through dance. Under the Mughal era, it absorbed Persian and Central Asian influences, developing the gharana system with distinct styles.",
        "templeTraitions": "Originally performed in temples and later in royal courts, Kathak carries the dual legacy of Hindu devotional traditions and Mughal courtly elegance. The Lucknow and Jaipur gharanas represent these different influences.",
        "philosophy": "Kathak explores the interplay of time (taal) and space through intricate footwork and spins. It embodies the philosophy that rhythm is the heartbeat of the universe, and through mastery of rhythm, one can transcend the mundane.",
        "famousMudras": ["Pataka", "Tripataka", "Mayura", "Hamsasya"]
    },
    "odissi": {
        "id": "odissi",
        "name": "Odissi",
        "origin": "Odisha",
        "shortDescription": "A lyrical dance form known for its fluid movements, tribhangi posture, and temple sculpture-inspired poses.",
        "description": "Odissi is one of the pre-eminent classical dance forms of India, originating from the state of Odisha. It is known for its sculpturesque quality and fluid grace.",
        "history": "Odissi has archaeological evidence dating back to the 2nd century BCE, making it one of the oldest surviving dance forms. The caves of Udayagiri and Khandagiri contain the earliest evidence. It was revived in the mid-20th century from the Mahari (temple dancer) and Gotipua traditions.",
        "templeTraitions": "Deeply connected to the Jagannath temple tradition of Puri, Odissi was performed as a sacred offering. The Konark Sun Temple and Mukteshwar Temple feature extensive dance sculptures that form the basis of many Odissi poses.",
        "philosophy": "Odissi embodies the Tribhangi — a three-fold bending of the body symbolizing the union of the physical, mental, and spiritual realms. It draws heavily from Jayadeva's Gita Govinda, exploring devotion and divine love.",
        "famousMudras": ["Chandrakala", "Ardhachandra", "Mushti", "Katakamukha"]
    },
    "kathakali": {
        "id": "kathakali",
        "name": "Kathakali",
        "origin": "Kerala",
        "shortDescription": "A dramatic dance-theater form famous for its elaborate costumes, vivid makeup, and powerful storytelling.",
        "description": "Kathakali is a major form of classical Indian dance and dance-drama from Kerala, known for its elaborate costumes, detailed gestures, and well-defined body movements.",
        "history": "Kathakali evolved in the 17th century from earlier art forms like Krishnanattam and Ramanattam. It was patronized by the rulers of Kottarakkara and Travancore. The art form combines elements of dance, music, and acting to present stories from Hindu epics.",
        "templeTraitions": "While Kathakali is performed both in temples and secular settings, it has strong connections to Kerala's temple festivals. Performances traditionally begin at dusk and continue through the night, creating an immersive ritualistic experience.",
        "philosophy": "Kathakali is built on the Natyashastra's rasa theory, with particular emphasis on the heroic (Vira) and furious (Raudra) sentiments. The elaborate makeup system (Vesham) categorizes characters by their moral nature — green for noble, red for evil, and black for demons.",
        "famousMudras": ["Hamsapaksha", "Samdamsha", "Mushti", "Sikhara"]
    }
}

MUDRAS_INFO = {
    "Anjali": {
        "name": "Anjali",
        "meaning": "Prayer and reverence",
        "description": "Represents salutation and devotion",
        "usedIn": ["bharatanatyam", "odissi", "kathak"],
        "rasa": "Shanta (Peace)"
    },
    "Alapadma": {
        "name": "Alapadma",
        "meaning": "Blooming lotus",
        "description": "Depicts opening and expansion",
        "usedIn": ["bharatanatyam", "odissi"],
        "rasa": "Shringara (Love)"
    },
    "Kartarimukha": {
        "name": "Kartarimukha",
        "meaning": "Scissors hand",
        "description": "Index and middle fingers separated like scissors",
        "usedIn": ["bharatanatyam", "odissi"],
        "rasa": "Veera (Courage)"
    },
    "Pataka": {
        "name": "Pataka",
        "meaning": "Flag",
        "description": "Hand extended with all fingers together",
        "usedIn": ["bharatanatyam", "kathak", "odissi"],
        "rasa": "Shanta (Peace)"
    }
}

# ========== DANCE ENDPOINTS ==========

@api_bp.route('/dances', methods=['GET'])
def get_all_dances():
    """Get all classical Indian dances"""
    return jsonify(list(DANCES.values())), 200

@api_bp.route('/dances/<dance_id>', methods=['GET'])
def get_dance_detail(dance_id):
    """Get detailed info about a specific dance"""
    dance = DANCES.get(dance_id)
    if not dance:
        return jsonify({'error': 'Dance not found'}), 404
    return jsonify(dance), 200

# ========== MUDRA ENDPOINTS ==========

@api_bp.route('/mudras/<mudra_name>', methods=['GET'])
def get_mudra_info(mudra_name):
    """Get information about a mudra"""
    mudra = MUDRAS_INFO.get(mudra_name)
    if not mudra:
        return jsonify({'error': 'Mudra not found'}), 404
    return jsonify(mudra), 200

@api_bp.route('/detect-mudra', methods=['POST'])
def detect_mudra():
    """Detect mudra from uploaded image"""
    # Mudra detection feature coming soon
    return jsonify({'error': 'Mudra detection API is under development'}), 501

@api_bp.route('/detect-mudra-stream', methods=['POST'])
def detect_mudra_stream():
    """Detect mudra from webcam stream"""
    # Will implement real-time detection later with WebSockets
    pass

# ========== HEALTH CHECK ==========

@api_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({'message': 'API is working!'}), 200
