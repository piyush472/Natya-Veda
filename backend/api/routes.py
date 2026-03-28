from flask import Blueprint, request, jsonify
import cv2
import numpy as np
import base64
from pathlib import Path
from io import BytesIO
from collections import deque, Counter
import joblib
import mediapipe as mp
from PIL import Image

api_bp = Blueprint('api', __name__)

MODEL_PATH = Path(__file__).resolve().parent.parent / 'ml_pipeline' / 'artifacts' / 'model.pkl'
SMOOTH_WINDOW = 5
prediction_history = deque(maxlen=SMOOTH_WINDOW)

model_payload = None
model = None
scaler = None
label_encoder = None
feature_dim = 48
hands_detector = None

try:
    model_payload = joblib.load(MODEL_PATH)
    model = model_payload['model']
    scaler = model_payload.get('scaler', None)  # Load scaler if available
    label_encoder = model_payload['label_encoder']
    feature_dim = int(model_payload.get('feature_dim', 48))

    mp_hands = mp.solutions.hands
    hands_detector = mp_hands.Hands(
        static_image_mode=False,
        model_complexity=0,
        max_num_hands=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6,
    )
    print(f"✅ ML mudra model loaded: {feature_dim} features")
except Exception as e:
    print(f"⚠️ ML mudra model initialization failed: {e}")


def normalize_landmarks(landmarks_xy):
    """Normalize 21x2 landmarks with wrist-relative scale normalization."""
    wrist = landmarks_xy[0]
    centered = landmarks_xy - wrist
    scale = np.max(np.linalg.norm(centered, axis=1))
    if scale < 1e-6:
        return centered
    return centered / scale


def get_finger_bend_angles(landmarks_xy):
    """Calculate bend angles for each finger."""
    bend_angles = []
    finger_ranges = [
        (0, 1, 2, 3),   # Thumb
        (0, 5, 6, 7),   # Index
        (0, 9, 10, 11), # Middle
        (0, 13, 14, 15),# Ring
        (0, 17, 18, 19) # Pinky
    ]
    
    for wrist_idx, base_idx, pip_idx, tip_idx in finger_ranges:
        wrist = landmarks_xy[wrist_idx]
        pip = landmarks_xy[pip_idx]
        tip = landmarks_xy[tip_idx]
        
        v1 = landmarks_xy[base_idx] - pip
        v2 = tip - pip
        
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.arccos(cos_angle)
        bend_angles.append(angle)
    
    return np.array(bend_angles, dtype=np.float32)


def get_finger_spread(landmarks_xy):
    """Calculate finger spread variance."""
    finger_tips = [4, 8, 12, 16, 20]
    distances = []
    
    for i in range(len(finger_tips) - 1):
        tip1 = landmarks_xy[finger_tips[i]]
        tip2 = landmarks_xy[finger_tips[i + 1]]
        dist = np.linalg.norm(tip2 - tip1)
        distances.append(dist)
    
    return np.var(distances) if distances else 0.0


def extract_feature_vector(frame_bgr):
    """Extract enhanced feature vector with bend angles and finger spread."""
    if hands_detector is None:
        return None

    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(frame_rgb)

    if not results.multi_hand_landmarks:
        return None

    hand_landmarks = results.multi_hand_landmarks[0]
    landmarks_xy = np.array([(lm.x, lm.y) for lm in hand_landmarks.landmark], dtype=np.float32)
    landmarks_xy = normalize_landmarks(landmarks_xy)
    
    # Get base features (42 dimensions)
    base_features = landmarks_xy.flatten()
    
    # Only add bend angles and spread if model expects them (48 dims)
    if feature_dim == 48:
        bend_angles = get_finger_bend_angles(landmarks_xy)
        finger_spread = np.array([get_finger_spread(landmarks_xy)], dtype=np.float32)
        combined_features = np.concatenate([base_features, bend_angles, finger_spread])
    else:
        # Backward compatibility with 42-dim models
        combined_features = base_features
    
    return combined_features


def smooth_prediction(label):
    """Return stable label only when majority in recent frames agrees."""
    prediction_history.append(label)
    if len(prediction_history) < prediction_history.maxlen:
        return None

    winner, votes = Counter(prediction_history).most_common(1)[0]
    if votes >= (prediction_history.maxlen // 2 + 1):
        return winner
    return None

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
        "famousMudras": ["Anjali", "Alapadma", "Kartarimukha", "Pataka"],
        "audioNarration": {
            "english": "/audio/bharatanatyam_english.mp3",
            "hindi": "/audio/bharatanatyam_hindi.mp3"
        }
    },
    "kathak": {
        "id": "kathak",
        "name": "Kathak",
        "origin": "North India",
        "shortDescription": "A storytelling dance form characterized by rhythmic footwork, spins, and expressive gestures.",
        "description": "Kathak is one of the major classical dance forms of India, originating from the travelling bards of North India known as Kathakars or storytellers.",
        "history": "Kathak evolved from the storytelling traditions of ancient North India. The Kathakars would narrate stories from the epics and mythology through dance. Under the Mughal era, it absorbed Persian and Central Asian influences, developing the gharana system with distinct styles.",
        "completeHistory": {
            "ancientOrigins": "Kathak's history represents a fascinating convergence of Hindu devotional traditions and Islamic courtly culture in North India. The etymological root 'Katha' (meaning 'story' in Sanskrit) connects directly to the ancient Sanskrit term 'Kathakar' (storyteller). Historical references to storytellers performing narrative dances appear in Bharata's Natya Shastra, suggesting a lineage extending back at least 2,000 years. However, the specific form known as Kathak crystallized during the medieval period. Archaeological and textual evidence indicates that traveling bards and minstrels (Kathakars) existed throughout North Indian kingdoms during the classical period, particularly during the reign of the Guptas (4th-6th century CE) and Vardhanas (7th century CE). These performers would travel between villages, temples, and courts, narrating episodes from the Ramayana, Mahabharata, Bhagavata Purana, and other sacred texts. The narrative performance style integrated music, rhythmic patterns, and gestural language to create an immersive storytelling experience. Unlike temple-oriented South Indian classical forms, the itinerant nature of these North Indian performers made their art accessible to broader populations. The performance aesthetics emphasized rhythmic complexity, improvisational exchange between performer and musician, and the narrative clarity that allowed diverse audiences to follow stories. These early Kathakars established the fundamental principle of Kathak that would persist through centuries: the symbiosis between rhythm (taal) and narration, between pure rhythmic virtuosity and meaningful storytelling.",
            "templeHeritage": "While Kathak is often associated with courtly traditions, its deeper spiritual roots in Hindu temples and Krishna worship are equally significant. The form has profound connections to the Krishna bhakti movement that flourished in North India from the 15th century onwards. Major temple centers in North India, particularly in Mathura and Vrindavan (sacred sites of Krishna's birth and childhood revelries), developed sophisticated performance traditions where dancers narrated Krishna's divine pastimes (Krishna lila). The Srimanta Vallabha temple in Mathura became a major center for Krishna-focused narrative performances. During the 15th-16th centuries, the Sant tradition and Bhakti poetry movements (associated with figures like Kabir, Meera, and Surdas) created enormous demand for devotional performance arts. Krishna stories—particularly the divine childhood pranks, the divine love story with Radha (Raas Lila narratives), and the philosophical teachings of the Bhagavad Gita—became central to Kathak repertoire and remain so today. The spiritual dimension of Kathak connects to the concept that through the retelling of Krishna's stories, performers and audiences alike achieve a form of divine communion (darshan). Male performers (known as Kathakas) would perform in temples and sacred spaces, narrating Krishna's adventures with rhythmic bodily expression and intricate footwork. The worship of Lord Krishna as the supreme dancer (Nata Raja in the North, paralleling Shiva's role in the South) provided theological justification for dance as a legitimate form of spiritual expression. This sacred context explains why even today, Kathak performances often begin with invocatory pieces dedicated to Lord Krishna or other deities, maintaining the spiritual framework that grounded the form historically.",
            "devadasiTradition": "The transition from temple performers to court entertainers occurred gradually during the medieval period, particularly during the Mughal era (16th-18th centuries). Unlike the hereditary Devadasi system of South India (which had strictly formalized training structures), North India developed more fluid patronage systems where performers could serve variously in temples, courts, and community spaces. Female performers gained prominence in Kathak during the Mughal period, particularly in the 17th-18th centuries. These tawwaif dancers (a term later applied to courtesans) performed in palace courts, but many maintained connections to both religious and secular performance contexts. The most notable historical figure is Niyaz Begum (a significant tawwaif whose descendants carried forward Kathak knowledge), though many other celebrated performers remain historically undocumented. The integration of Kathak into Muslim court culture under the Mughals profoundly shaped the form's aesthetics. Mughal rulers, particularly Akbar (16th century) and his court under the administrative genius of Raja Todar Mal, became major patrons of the arts. The resulting aesthetic synthesis combined Hindu narrative themes with Persian musical concepts, Islamic geometric precision with classical Indian philosophical frameworks. This syncretism created a uniquely cosmopolitan art form. Male performers, particularly the Maharaj ji families (such as the Bindadin Maharaj lineage in Lucknow), also maintained the tradition, often as hereditary conveyers of knowledge within family systems. The hereditary nature of performance lineages in Kathak created what became known as the gharana system—family-based schools that preserved and transmitted specific stylistic approaches, repertoire, and pedagogical methods. This system proved remarkably stable, allowing technical sophistication to accumulate across generations while preventing the loss of knowledge that sometimes characterized non-hereditary traditions.",
            "modernRevival": "Like South Indian classical forms, Kathak faced severe challenges during the late colonial period. By the late 19th and early 20th centuries, British colonial authorities and Christian missionary movements began marginalized what they characterized as 'native entertainment' or 'morally questionable' performance practices. The anti-nautch movement of the 1890s extended beyond South India into North Indian cultural circles, though with less organized suppression. However, the true crisis for Kathak came with the decline of court patronage following the Indian independence struggle and the effective dissolution of princely state systems after 1947. Many hereditary Kathak families faced economic devastation as royal patrons could no longer sustain the expensive tradition. Simultaneously, intellectual and nationalist movements in North India began recognizing classical dance as an important element of cultural pride. Pioneering revivalists emerged: the legendary dancer Birju Maharaj (1938-2020), descended from the Lucknow gharana lineage of Bindadin Maharaj, became the pre-eminent figure in Kathak revival. Though Birju Maharaj did not face the same social ostracism as some South Indian dancers, the economic precarity of the profession was severe. His remarkable talent (he was performing publicly by age 6) and his family's dedication to the form ensured continuity. The establishment of Kathak Kendra in Delhi in 1959 as a state-sponsored institution marked an institutional turning point. Similar to South India's Kalakshetra Foundation, Kathak Kendra systematized pedagogy and created a framework for preserving and transmitting Kathak knowledge to non-hereditary students. Universities including Delhi University, Banaras Hindu University, and Lucknow University began incorporating Kathak into their curricula. The Sangeet Natak Akademi (established 1953) formally recognized Kathak as one of the major classical Indian dance traditions, placing it on par with Bharatanatyam, Odissi, and other forms. This official recognition was transformative, lending scholarly gravitas and institutional support that stabilized the tradition's transmission. The 1960s-1980s saw an extraordinary flourishing of Kathak performance and pedagogy, with outstanding dancers including Kumudini Lakhia, Shovana Narayan, and many others establishing themselves on the concert stage and in teaching positions.",
            "contemporaryEra": "Today, Kathak stands as a vibrant, internationally recognized classical tradition. The form has successfully balanced preservation of classical vocabulary with contemporary innovation. Modern Kathak performances span from rigorously traditional solo recitals (where a single dancer performs for 2-3 hours in the classical margam format) to dance-theater collaborations, ensemble works, and thematic productions exploring social issues. The three major gharanas—Lucknow (known for elegance and subtly layered expressiveness), Jaipur (known for powerful rhythmic virtuosity and dramatic intensity), and Banaras (known for compositional precision)—remain distinct stylistic families, with accomplished dancers often blending elements from multiple gharanas. Contemporary dancers like Vijay Lal, Aditi Mangaldas, and many others have created innovative choreographies that retain classical grammar while addressing modern themes. The form has proven remarkably adaptable: fusion collaborations with Western dance, incorporation of Kathak into Hindi cinema dance, and cross-cultural performances have all established Kathak's global presence. Digital technology has transformed knowledge transmission—online videos, dance tutorials, and stored recordings ensure that knowledge is no longer dependent solely on hereditary lineage transmission or living guru relationships. This democratization has expanded access while raising questions about depth and contextual understanding. International Kathak communities now flourish in London, New York, Singapore, and other global cities, particularly within diaspora communities but also among non-Indian students drawn to the form's rhythmic sophistication and expressive possibilities. The most significant contemporary achievement has been gender integration: while women have performed Kathak for centuries, the 20th-21st centuries have seen women dancers achieving the highest artistic recognition previously reserved for male performers, with women now constituting the majority of professional Kathak dancers worldwide. Scholarship on Kathak has expanded dramatically, with academic journals, books, and digital humanities projects documenting the form's history, aesthetics, and contemporary variations. Yet challenges persist: economic sustainability for performers outside major cities remains difficult, the contextualization of secular and sacred dimensions creates ongoing debate, and questions about cultural appropriation and non-Indian access to traditionally Indian forms remain cogent in global contexts."
        },
        "templeTraitions": "Originally performed in temples and later in royal courts, Kathak carries the dual legacy of Hindu devotional traditions and Mughal courtly elegance. The Lucknow and Jaipur gharanas represent these different influences.",
        "philosophy": "Kathak explores the interplay of time (taal) and space through intricate footwork and spins. It embodies the philosophy that rhythm is the heartbeat of the universe, and through mastery of rhythm, one can transcend the mundane.",
        "famousMudras": ["Pataka", "Tripataka", "Mayura", "Hamsasya"],
        "audioNarration": {
            "english": "/audio/kathak_english.mp3",
            "hindi": "/audio/kathak_hindi.mp3"
        }
    },
    "odissi": {
        "id": "odissi",
        "name": "Odissi",
        "origin": "Odisha",
        "shortDescription": "A lyrical dance form known for its fluid movements, tribhangi posture, and temple sculpture-inspired poses.",
        "description": "Odissi is one of the pre-eminent classical dance forms of India, originating from the state of Odisha. It is known for its sculpturesque quality and fluid grace.",
        "history": "Odissi has archaeological evidence dating back to the 2nd century BCE, making it one of the oldest surviving dance forms. The caves of Udayagiri and Khandagiri contain the earliest evidence. It was revived in the mid-20th century from the Mahari (temple dancer) and Gotipua traditions.",
        "completeHistory": {
            "ancientOrigins": "Odissi possesses one of the longest documented histories of any classical Indian dance form, with archaeological and sculptural evidence extending back over 2,000 years. The earliest evidence appears in the caves of Udayagiri and Khandagiri near Bhubaneswar, which contain inscriptions and relief sculptures dating to approximately 200-100 BCE during the Mauryan and early-post-Mauryan periods. These cave sanctuaries, carved into hillsides, contain dance-related iconography suggesting sophisticated movement vocabularies existed in ancient Odisha. More substantial sculptural evidence emerges from the classical periods. The magnificent Konark Sun Temple (Surya Mandir), constructed in the 13th century CE during the Eastern Ganga dynasty (around 1238-1264 CE), represents the architectural and sculptural pinnacle of Odia classical culture. This UNESCO World Heritage Site contains hundreds of sculptural panels depicting dancers, musicians, and celestial beings in various poses. The temple's extensive wall sculptures function as a three-dimensional archive of ancient Odia movement vocabulary—the tribhangi (three-fold body bend) appears repeatedly in stone, along with scores of hand positions, footwork patterns, and dynamic postures. Scholars and dancers study the Konark temple sculptures as authentic records of 13th-century Odia classical dance. The Mukteshwar Temple (10th-11th century CE) and the Lingaraj Temple (11th century CE, with later renovations) in Bhubaneswar similarly contain extensive dance sculptures. These temples functioned as living performance centers where dance remained an integral part of daily worship rituals. The sculptures' remarkable detail and variety suggest that highly codified dance vocabularies existed in medieval Odisha, comparable in sophistication to dance traditions elsewhere in India. Ancient Odia literature, including the Odia language portions of regional Sanskrit texts and early Odia poetry, contains references to sophisticated dance traditions. The cultural synthesis of tribal Odia traditions with Indo-Aryan classical frameworks created a distinctive aesthetic that prized both sculptural precision and fluid, lyrical expressiveness—qualities that remain characteristic of Odissi today.",
            "templeHeritage": "The Jagannath Temple in Puri represents the spiritual and cultural heart of Odissi dance tradition. This extraordinary temple, believed to have been founded around 1161 CE by King Anantavarman Chodaganga, houses one of Hinduism's most widely beloved deities—Lord Jagannath (a form of Lord Krishna). The temple's reputation extends far beyond Odisha: millions of pilgrims from across India journey to Puri annually, making the Jagannath Temple one of Hinduism's four dhams (sacred pilgrimage destinations). Within the temple's complex ritual system, dance held a crucial position. Female performers known as Maharis (meaning 'great dancer') served in the temple, performing daily around the sanctum sanctorum, before the deity during specified ritual times, and during festival occasions. The Mahari lineage represents a unique institutional development: these women dancers were formally recognized by the temple authority, received regular compensation and housing, and transmitted their knowledge through hereditary lineages within their families. Unlike the Devadasi system of South India (which later became conflated with exploitative practices), the Mahari system in Odisha maintained relatively higher social status, though the women's position became progressively marginalized over time as colonial attitudes and brahmanical reform movements affected Odia society. The Jagannath Temple's annual Rath Yatra (chariot festival), one of India's largest annual festivals drawing millions of devotees, traditionally featured elaborate performances and processionals that incorporated dance. During this festival, which celebrates Lord Jagannath's journey from the inner sanctum to the adjacent Gundicha temple, the cosmic drama of the universe unfolding was enacted through performance, music, sculpture, and ritual. Male performers known as Gotipuas (youth from families traditionally involved in acrobatic and martial training) also performed in the Jagannath Temple context, particularly during festival seasons. These young males, typically between ages 8-20, underwent rigorous physical training in both martial arts and dance, combining acrobatic virtuosity with classical movement vocabulary. The Gotipua tradition represented a parallel knowledge system to the Mahari system, with distinct lineages and stylistic features. The Jagannath Temple complex also inspired architectural and sculptural programs that visually encoded dance knowledge—the temple's intricate carvings served as teaching resources for dancers seeking to understand refined movement vocabulary. Beyond Jagannath Puri, other significant Odia temples maintained independent dance traditions: the Lingaraj Temple in Bhubaneswar, the Someswari Temple, and various regional shrines throughout Odisha developed their own distinctive practices while sharing a common classical vocabulary.",
            "devadasiTradition": "The Mahari and Gotipua traditions of Odisha functioned as hereditary knowledge transmission systems that preserved Odissi dance through centuries of social change. Unlike some southern Devadasi systems, the Maharis of the Jagannath Temple maintained formal institutional recognition and relative social respect until the colonial period. Mahari families resided within temple precincts or nearby areas, receiving daily sustenance and compensation from temple authorities in exchange for their performance services. The training process began at childhood: young girls from established Mahari families would begin learning the fundamentals around age 3-4, progressing through increasingly complex vocabulary over 10-15 years of intensive study under senior family members and accomplished teachers. The curriculum encompassed not merely choreography but embodied philosophy—the Maharis learned to see their bodies as instruments of divine service, their movements as offerings to the deity. The most accomplished Maharis achieved considerable prestige: they performed solo recitals, trained successive generations, and maintained complex knowledge systems that included rhythmic structures, expressive storytelling techniques, and spiritual practices. However, with colonial arrival in the 19th century, the Mahari tradition faced systematic attack. British administrators and Christian reformers applied the same 'immoral nautch dancer' framework to Odisha that they applied elsewhere in India, conflating temple dancers with courtesans and launching reform campaigns against the tradition. By the early 20th century, active suppression occurred: in 1903, the British administration effectively banned Mahari performances within the Jagannath Temple. This catastrophic blow devastated the tradition—many Mahari families lost their institutional livelihoods and social status overnight. Simultaneously, the Gotipua tradition faced difficulties: as the martial training contexts that sustained male performers declined and as social reform movements questioned the appropriateness of unmarried male youths engaging in classical dance, Gotipua training systems contracted. By the mid-20th century, very few practicing Gotipuas remained. Yet it is this fragile transmission line—maintained by scattered Mahari families and the few remaining Gotipua practitioners—through which Odissi knowledge survived the colonial period. When 20th-century revivalists began reconstructing Odissi, they worked directly with these remaining hereditary practitioners who had maintained the tradition against tremendous obstacles.",
            "modernRevival": "Odissi's revival in the mid-20th century represents one of the most remarkable cultural reconstructions in Indian classical dance history, accomplished through the collaborative efforts of hereditary practitioners, nationalist intellectuals, and visionary dancers. The process began in earnest during the 1950s independence era. Kelucharan Mohapatra (1926-2003) emerged as a pre-eminent figure in this reconstruction. Descended from a Gotipua family with deep knowledge of classical traditions, Mohapatra underwent training under senior gurus and developed an extraordinary technical facility and interpretive depth. Another crucial figure was Panjajali (a Mahari who maintained knowledge even after temple bans), and various other hereditary practitioners who preserved repertoire despite systematic suppression. These hereditary dancers collaborated with scholars, musicians, and nationalist cultural movements to codify and systematize Odissi. In 1958, the Government of Odisha established the Odissi Research Centre to document and preserve the form. This institutional initiative provided resources to record performances, interview elderly practitioners, analyze dance structures, and develop pedagogical frameworks. The research center became a model for other states seeking to preserve classical forms. Simultaneously, individuals from non-hereditary backgrounds—notably Sanjukta Panigrahi (1940-2000), who came from an urban, educated Odia family—began studying Odissi intensively. Panigrahi's entry into the form challenged the hereditary monopoly on classical knowledge, suggesting that dedicated training could transmit Odissi to committed students regardless of family background. Her extraordinary artistry established her as a towering figure, bringing international recognition to the newly reconstructed form. The 1960s-1970s saw rapid institutional expansion: universities incorporated Odissi into their curricula, state cultural organizations sponsored performances and training, and institutional support stabilized what had been a profession on the brink of extinction. The Sangeet Natak Akademi formally recognized Odissi as a major classical form in 1963, providing national legitimacy. This official recognition encouraged broader public support and international touring. By the 1980s-1990s, Odissi had achieved secure status as a nationally celebrated and internationally performed classical tradition, though it remained less widely known globally compared to Bharatanatyam. The reconstruction process was necessarily simplifying and selective—many repertoire variants, regional styles, and historical complexities were necessarily compressed into a standardized 'classical' form suitable for concert stage presentation. However, this systematization also enabled knowledge preservation and global transmission that might otherwise have been impossible.",
            "contemporaryEra": "Today, Odissi represents one of India's most vibrant classical traditions, practiced by thousands of dancers internationally and recognized as a major form of world cultural heritage. The tradition has successfully evolved from marginalized colonial-era suppression to celebrated status in contemporary Indian culture. Modern Odissi encompasses diverse performance contexts: classical solo concerts presenting the traditional margam structure (invocatory pieces, pure dance passages, expressive storytelling elements); ensemble and group performances; thematic and narrative productions exploring classical and contemporary themes; and innovative collaborations with other art forms and cultures. The form remains deeply connected to sacred dimensions—many performances begin with invocations to Lord Jagannath or other deities, maintaining spiritual framing even in secular concert contexts. Contemporary Odissi dancers include world-renowned artists such as Sonal Mansingh, Bijayini Satpathy, Ramli Ibrahim, and many others who have achieved international recognition while maintaining classical principles. The female dancer population has increased dramatically—women now constitute the majority of professional Odissi dancers, though questions of gender equity and representation remain active areas of discussion within the dance community. The rediscovery and valorization of Gotipua traditions represents another contemporary development. While the historical Gotipua system largely disappeared by mid-20th century, contemporary practitioners have revived and reconstructed elements of this male-centered classical vocabulary, drawing on documented movements, elderly practitioners' memories, and creative research. Young male dancers now explore Gotipua technique, adding diversity to Odissi's gender landscape. Technological developments have transformed knowledge transmission: video recording and internet dissemination have made Odissi accessible globally, though this also raises questions about decontextualization and the loss of subtle transmissions that occurred in direct guru-student relationships. Digital humanities projects document Odissi's history, notation systems preserve choreography, and academic scholarship explores the form's social history, philosophical dimensions, and contemporary significance. International Odissi communities now flourish in major cities worldwide, with dedicated schools, festivals, and performance opportunities sustained by both diaspora communities and non-Indian practitioners. UNESCO recognition and World Dance organizations have established Odissi's status as a world cultural treasure. Contemporary revivalist movements attempt to recover lost Mahari knowledge, explore suppressed gender dimensions, and restore connections to sacred temple contexts that were severed during colonialism. Yet modern Odissi also remains forward-looking: contemporary choreographers create new works on social themes, blend Odissi with other dance forms and artistic media, and explore how this ancient tradition speaks to 21st-century audiences. The tension between preserving classical purity and enabling contemporary expression remains productive rather than paralyzing, allowing Odissi to maintain deep historical roots while remaining vibrantly alive in the present moment."
        },
        "templeTraitions": "Deeply connected to the Jagannath temple tradition of Puri, Odissi was performed as a sacred offering. The Konark Sun Temple and Mukteshwar Temple feature extensive dance sculptures that form the basis of many Odissi poses.",
        "philosophy": "Odissi embodies the Tribhangi — a three-fold bending of the body symbolizing the union of the physical, mental, and spiritual realms. It draws heavily from Jayadeva's Gita Govinda, exploring devotion and divine love.",
        "famousMudras": ["Chandrakala", "Ardhachandra", "Mushti", "Katakamukha"],
        "audioNarration": {
            "english": "/audio/odissi_english.mp3",
            "hindi": "/audio/odissi_hindi.mp3"
        }
    },
    "kathakali": {
        "id": "kathakali",
        "name": "Kathakali",
        "origin": "Kerala",
        "shortDescription": "A dramatic dance-theater form famous for its elaborate costumes, vivid makeup, and powerful storytelling.",
        "description": "Kathakali is a major form of classical Indian dance and dance-drama from Kerala, known for its elaborate costumes, detailed gestures, and well-defined body movements.",
        "history": "Kathakali evolved in the 17th century from earlier art forms like Krishnanattam and Ramanattam. It was patronized by the rulers of Kottarakkara and Travancore. The art form combines elements of dance, music, and acting to present stories from Hindu epics.",
        "completeHistory": {
            "ancientOrigins": "Kathakali represents a synthesis of ancient Kerala performance traditions with classical Indian performance theory, emergent during the 16th-17th centuries. While Kerala's performance heritage extends back thousands of years, the specific dramatic form known as Kathakali crystallized during a particular historical moment of cultural florescence. Ancient Kerala society developed distinctive performance traditions shaped by its geographic position on India's southwestern coast, its unique ecology of backwaters and dense forests, its multilayered religious diversity (including Hindu, Muslim, Christian, and Jewish communities coexisting), and its trade-based mercantile prosperity. Early Sanskrit texts mention Kerala (Keralam, Chera kingdom) as a center of artistic sophistication. The region developed independent traditions of performance, music, martial training, and ritual theater that blended Sanskrit classical frameworks with locally evolved aesthetics. Archaeological evidence and historical texts suggest that elaborate forms of theater existed in Kerala during the classical and medieval periods, though specific documentation becomes fuller only from the medieval period onward. The emergence of recognizably 'Kathakali' form appears connected to transformations in Kerala society during the 16th century, when feudal political fragmentation, merchant prosperity, and changing patronage patterns created fertile conditions for new forms of theatrical expression. Prior to Kathakali's crystallization, Kerala hosted various performance traditions including village theatrical forms, martial arts performances, ritual dramas, and classical Sanskrit plays performed by brahmanical communities. The specific innovations that characterize Kathakali—elaborate makeup systems with chromatic symbolism, highly codified character types, powerful physical training integrating martial and dance vocabularies, extended narrative performances, and distinctive costume architecture—emerged from interactions among these pre-existing traditions.",
            "templeHeritage": "Kathakali's relationship to Kerala temple traditions is complexly layered. The form evolved from earlier temple-connected performance traditions, particularly Krishnanattam and Ramanattam. Krishnanattam, a dramatic performance tradition narrating Krishna's life, was created around 1555-1585 CE by Kunjan Nambiar, a royal court functionary serving the Zamorin (ruler) of Calicut. This form, performed inside temple precincts during festival occasions, established many theatrical principles that Kathakali later adopted: episodic narrative structure, mythological content drawn from sacred texts (particularly the Bhagavata Purana for Krishna lilas), integration of music and movement, elaborate costumes, and all-night performance duration. Ramanattam, similarly structured around epic Ramayana narratives, emerged in parallel. Both forms became associated with specific temples and priestly families who maintained the tradition across generations. The courtly and theatrical innovations of Krishnanattam and Ramanattam provided the foundational vocabulary from which Kathakali developed. Kathakali's emergence in the 17th century represented an evolution and expansion of these predecessor forms—incorporating new physical vocabularies, developing more elaborate makeup and costume systems, and increasingly moving toward secular court patronage while retaining sacred narrative content. Major Kerala temples, particularly those during festival seasons, became venues for Kathakali performance. The Vadakkunnathan Temple in Kunnamkulam, the Thiruvananthapuram temple complex, and various regional temple festivals throughout Kerala incorporated Kathakali within their ritual and festival calendars. All-night performances (Keli) became traditional, with Kathakali performances often commencing at dusk and continuing through dawn, mirroring earlier performance traditions but with dramatically intensified technical and thematic complexity. The nocturnal performance timing connected ritually to sacred time—the night hours carried mystical significance in Hindu and tantric frameworks, making extended night-long performances spiritually appropriate for narrating divine stories. The temple contexts provided training grounds and performance venues where elaborate productions could be mounted, where specialized accompanying musicians could be maintained, and where generations of performers and their families could sustain hereditary knowledge transmission systems. Even as Kathakali increasingly became a courtly art form under royal patronage, temple connections remained crucial—many performing lineages maintained both temple and court roles, and temple festivals continued as important performance venues.",
            "devadasiTradition": "Kathakali's historical development connects to Kerala's distinctive performance systems that included both male and female performer lineages, though with gendered specializations. Unlike the South Indian Devadasi system where women held primary roles as solo concert performers and trained dancers, Kerala's traditional performance contexts involved more complex gender divisions. The Krishnanattam and Ramanattam traditions from which Kathakali emerged were historically performed by male actors and dancers, often from priestly or royal court families. These hereditary lineages maintained extensive knowledge systems encompassing music, dance, dramatic acting, and textual mastery. Male performers (often titled 'Nair' or from other Kerala communities) underwent years of intensive training beginning in childhood. The training integrated martial arts training (particularly Kalaripayattu, Kerala's ancient martial discipline), physical conditioning for stamina, rhythmic sophistication, gesture vocabulary, and dramatic interpretation. Female performers existed in Kerala performance contexts, but often in differently bounded roles compared to male performers. As Kathakali evolved from its antecedent forms during the 17th-18th centuries, the form became increasingly associated with male performance dominance, particularly in lead roles (pachcha roles for heroes and nobles, kathi or villain roles for antagonists, kari for demons). While female performers existed historically and continue to perform in contemporary times, the historical emphasis fell predominantly on male performers occupying the highest-status dramatic roles. This gendered structure differed significantly from other Indian classical dance forms. The hereditary system (variously called the Sangita Sastra Gurukkula or maintained through family lineages) preserved knowledge across generations, with fathers teaching sons, senior performers mentoring junior disciples, and elaborate apprenticeships involving long-term residence with master teachers. The economic foundation for performers came primarily through royal court patronage during the 17th-19th centuries, when Kerala's ruling families supported elaborate theatrical productions. Unlike South Indian performers who might serve temples on more formalized institutional bases, Kerala performers relied on court sponsorship, which created both opportunities for theatrical innovation and economic vulnerabilities when political systems changed.",
            "modernRevival": "Kathakali's trajectory during the colonial and independence periods differed somewhat from other classical forms, though challenges emerged. The Kerala region, as a densely populated maritime area with established merchant networks, was one of the first Indian regions to experience intensive colonial presence (particularly Portuguese, Dutch, and British traders from the 15th century onward). However, the interior princely states of Kerala (Travancore, Cochin, Malabar) maintained larger degrees of political autonomy compared to many Indian regions, allowing greater continuity of cultural patronage. Revolutionary political currents also flow through Kerala's cultural history—the Kerala region developed significant communist and socialist political movements from the early 20th century onward, which created distinctive ideological contexts for understanding classical arts. The Indian independence movement and post-independence nation-building found enthusiastic support among Kerala intellectuals and cultural workers. During the nationalist period (1920s-1940s), cultural revivalists in Kerala began consciously recovering and valorizing Kathakali as a national artistic heritage. The pioneering work of scholars such as C.J. Thirumuthy and performers like Kunj Kurup helped establish Kathakali's recognition as a major classical form worthy of scholarly study and institutional support. In 1930, the Kunnamkulam temple authorities and associated cultural organizations began documenting and reviving Kathakali performances at the Vadakkunnathan Temple, connecting the form explicitly to its temple heritage. Following Indian independence in 1947, institutional support intensified dramatically. Universities, state cultural organizations, and national cultural agencies designated Kathakali as a major classical form requiring preservation and promotion. The establishment of the Kerala Kalamandalam in 1930 (and its expansion in subsequent decades) provided a crucial institution for systematizing Kathakali pedagogy, recording performances, and training new generations of dancers from non-hereditary backgrounds. The founding of Kalamandalam by Kunj Kurup represented a transformative moment—for the first time, Kathakali knowledge became transmissible to students outside hereditary lineages, democratizing access to what had been hereditary family knowledge. The Sangeet Natak Akademi's formal recognition of Kathakali as a major classical dance form in 1953 provided national institutional validation. Government support enabled extensive documentation, festival programming, international touring, and curricular inclusion in schools and universities. The modern Kerala Kathakali stage emerged with standardized performance conventions: controlled theater lighting replacing traditional firelight, formalized stage dimensions, structured performance duration (typically 2-4 hours rather than all-night performances), and concert-format presentation to paying audiences sitting in fixed seats rather than temple festival contexts with fluid audience movement. These modernizations made Kathakali accessible to broader urban audiences while necessarily transforming the phenomenological experience from immersive ritual-theater to bounded aesthetic performance.",
            "contemporaryEra": "In the contemporary era, Kathakali stands as one of India's most internationally recognized classical art forms, achieving global prominence through tours, performances at international festivals, documentaries, and inclusion in world dance curricula. Modern Kathakali encompasses studio-based training, university programs, and international schools—many established in diaspora communities globally. The Kerala Kalamandalam and related institutions continue systematizing pedagogy while maintaining connections to traditional knowledge. Contemporary Kathakali artists have achieved international stature: performers and choreographers have received prestigious national and international awards, performed at major world art festivals, and been recognized by UNESCO and global cultural organizations. The form's visual spectacle—the brilliant makeup designs, elaborate costumes, powerful physical vocabulary—translates effectively to international audiences unfamiliar with Kathakali's narrative or philosophical contexts, contributing to its global popularity. Modern innovations in Kathakali include thematic compositions addressing contemporary social issues, ensemble arrangements, collaborations with other dance forms and artistic media, and experimental productions exploring Kathakali's aesthetic principles in new contexts. Gender dynamics have evolved significantly: while male performers historically dominated leading roles, contemporary Kathakali increasingly features female performers in major roles, challenging traditional gender conventions. Some women performers have achieved outstanding recognition, though debates about authenticity and tradition continue within the Kathakali community. The question of 'pure' tradition versus creative innovation remains dynamic—some traditionalists emphasize fidelity to documented repertoire and technique, while others view Kathakali as a living form capable of meaningful evolution. Contemporary scholars have extensively documented Kathakali's history, aesthetics, character symbolism, and performance practices. Academic research explores the form's philosophical foundations in the Natyashastra, its connections to Kerala's distinctive cultural ecology, its gendered performance history, and its contemporary global circulation. Notation systems (particularly Laban notation and video documentation) preserve choreography in ways unavailable in earlier periods. The Kathakali diaspora—Indian and non-Indian practitioners worldwide—has established international institutes dedicating themselves to preserving and transmitting the form. Yet contemporary Kathakali also faces challenges: the intensive training required limits the practitioner population; the cultural contexts that historically sustained the form (temple ritual cycles, court patronage, hereditary transmission systems) have largely disappeared; and economic sustainability for performers outside major cities and international touring circuits remains precarious. Nevertheless, Kathakali's artistic power, visual magnificence, and sophisticated philosophical foundations have established it as a living tradition capable of remaining vibrantly relevant in the 21st century while honoring its profound historical heritage."
        },
        "templeTraitions": "While Kathakali is performed both in temples and secular settings, it has strong connections to Kerala's temple festivals. Performances traditionally begin at dusk and continue through the night, creating an immersive ritualistic experience.",
        "philosophy": "Kathakali is built on the Natyashastra's rasa theory, with particular emphasis on the heroic (Vira) and furious (Raudra) sentiments. The elaborate makeup system (Vesham) categorizes characters by their moral nature — green for noble, red for evil, and black for demons.",
        "famousMudras": ["Hamsapaksha", "Samdamsha", "Mushti", "Sikhara"],
        "audioNarration": {
            "english": "/audio/kathakali_english.mp3",
            "hindi": "/audio/kathakali_hindi.mp3"
        }
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

# ========== MUDRA FINGER PATTERN DETECTION ==========
ML_MUDRAS = {
    'Pataka': {'image_file': 'pataka.jpg'},
    'Tripathaka': {'image_file': 'tripataka.jpg'},
    'Ardhapataka': {'image_file': 'ardhpataka.jpg'},
    'Mushti': {'image_file': 'mushti.jpg'},
    'Shikharam': {'image_file': 'Shikharam.jpg'},
    'Chandrakala': {'image_file': 'Chandrakala.jpg'},
    'Padmakosha': {'image_file': 'Padmakosha.jpg'},
    'Sarpashirsha': {'image_file': 'Sarpashirsha.jpg'},
    'Mrigashirsha': {'image_file': 'Mrigashirsha.jpg'},
    'Simhamukha': {'image_file': 'Simhamukha.jpg'},
    'Mayura': {'image_file': 'Mayura.jpg'},
    'Alapadma': {'image_file': 'Alapadma.jpg'},
}


@api_bp.route('/detect-mudra', methods=['POST'])
def detect_mudra_endpoint():
    """Detect mudra with trained ML model using MediaPipe landmark features."""
    if model is None or label_encoder is None or hands_detector is None:
        return jsonify({'error': 'ML mudra model not initialized', 'status': 'error'}), 503

    try:
        data = request.get_json(silent=True) or {}
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode image
        try:
            image_bytes = base64.b64decode(image_data.split(',')[1])
        except:
            image_bytes = base64.b64decode(image_data)
        
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        feature = extract_feature_vector(frame)
        if feature is None or feature.shape[0] != feature_dim:
            prediction_history.clear()
            return jsonify({
                'detected_mudra': None,
                'confidence': 0.0,
                'mudra_info': None,
                'finger_state': None,
                'status': 'no_hand',
                'source': 'mediapipe',
                'message': 'No hand detected. Show your full hand to the camera.'
            }), 200

        # Scale features if scaler is available
        if scaler is not None:
            feature_scaled = scaler.transform([feature])[0]
        else:
            feature_scaled = feature

        probs = model.predict_proba([feature_scaled])[0]
        pred_idx = int(np.argmax(probs))
        raw_label = label_encoder.inverse_transform([pred_idx])[0]
        confidence = float(probs[pred_idx])
        stable_label = smooth_prediction(raw_label)

        if stable_label and confidence >= 0.65:
            mudra_meta = ML_MUDRAS.get(stable_label, {'image_file': ''})
            return jsonify({
                'detected_mudra': stable_label,
                'confidence': confidence,
                'mudra_info': {
                    'name': stable_label,
                    'confidence': confidence,
                    'image_file': mudra_meta.get('image_file', ''),
                    'description': 'ML classification from MediaPipe hand landmarks'
                },
                'finger_state': None,
                'source': 'mediapipe',
                'status': 'detected',
                'message': f'{stable_label} detected',
                'all_scores': {str(label_encoder.inverse_transform([i])[0]): float(prob) for i, prob in enumerate(probs)}
            }), 200

        return jsonify({
            'detected_mudra': None,
            'confidence': confidence,
            'mudra_info': None,
            'finger_state': None,
            'best_match': raw_label,
            'source': 'mediapipe',
            'status': 'hand_present_no_match',
            'message': f'Hand visible (trying {raw_label})',
            'all_scores': {str(label_encoder.inverse_transform([i])[0]): float(prob) for i, prob in enumerate(probs)}
        }), 200
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e), 'status': 'error'}), 500

@api_bp.route('/mudra-database', methods=['GET'])
def get_mudra_database():
    """Get list of ML mudra classes."""
    mudra_list = [{'name': name, 'image_file': info.get('image_file', '')} for name, info in ML_MUDRAS.items()]

    return jsonify({'mudras': mudra_list}), 200

# ========== HEALTH CHECK ==========

@api_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({'message': 'API is working!'}), 200

# ========== TRAINING ENDPOINT ==========

@api_bp.route('/train-model', methods=['POST'])
def train_model():
    """Train 12-mudra model from dataset."""
    try:
        import sys
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import train_test_split
        from sklearn.preprocessing import LabelEncoder
        from sklearn.metrics import accuracy_score
        
        dataset_dir = Path(__file__).resolve().parent.parent / 'ml_pipeline' / 'dataset' / '12-Mudras'
        artifacts_dir = Path(__file__).resolve().parent.parent / 'ml_pipeline' / 'artifacts'
        artifacts_dir.mkdir(parents=True, exist_ok=True)
        
        # Preprocess dataset
        print("Preprocessing 12 mudras...")
        X, y, processed, skipped = [], [], 0, 0
        
        class_dirs = sorted([d for d in dataset_dir.iterdir() if d.is_dir()])
        
        with hands_detector.Hands(
            static_image_mode=True,
            model_complexity=0,
            max_num_hands=1,
            min_detection_confidence=0.6,
        ) as hands:
            for class_dir in class_dirs:
                label = class_dir.name
                
                image_paths = sorted([
                    p for p in class_dir.rglob("*")
                    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
                ])
                
                for image_path in image_paths:
                    processed += 1
                    image = cv2.imread(str(image_path))
                    if image is None:
                        skipped += 1
                        continue
                    
                    feature = extract_feature_vector(image)
                    if feature is None or feature.shape[0] != feature_dim:
                        skipped += 1
                        continue
                    
                    X.append(feature)
                    y.append(label)
        
        X = np.array(X, dtype=np.float32)
        y = np.array(y)
        
        print(f"Processed: {processed}, Skipped: {skipped}, Dataset shape: {X.shape}")
        
        # Train RandomForest
        print("Training RandomForest...")
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Save and update global model
        global model_payload
        payload = {
            "model": model,
            "label_encoder": label_encoder,
            "class_names": label_encoder.classes_.tolist(),
            "feature_dim": int(X.shape[1]),
            "accuracy": float(accuracy),
        }
        
        model_path = artifacts_dir / 'model.pkl'
        joblib.dump(payload, model_path)
        
        # Reload into memory
        model_payload = payload
        
        return jsonify({
            'status': 'success',
            'message': f'12-mudra model trained successfully',
            'accuracy': float(accuracy),
            'classes': label_encoder.classes_.tolist(),
            'model_path': str(model_path),
        }), 200
        
    except Exception as e:
        print(f"❌ Training error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500
