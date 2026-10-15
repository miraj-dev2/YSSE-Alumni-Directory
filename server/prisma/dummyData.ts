export interface DummyAlumni {
  name: string;
  email: string;
  batch: number;
  wingName: string;
  role: string;
  org: string;
  location: string;
  bio: string;
  story?: string;
  linkedinUrl: string;
  photoUrl: string;
  status: 'APPROVED' | 'PENDING';
  isContactPublic: boolean;
  offerTopic?: string;
  offerMode?: 'ONLINE' | 'OFFLINE' | 'BOTH';
}

export const DUMMY_ALUMNI: DummyAlumni[] = [
  {
    name: 'Tahmid Khan',
    email: 'tahmid.khan@example.com',
    batch: 17,
    wingName: 'IT: Wing 1 — Web Development & CMS',
    role: 'Lead Full-Stack Engineer',
    org: 'Brain Station 23',
    location: 'Dhaka, Bangladesh',
    bio: 'Passionate software architect building high-throughput enterprise systems with Next.js, Node, and AWS.',
    story: 'From building community sites during my YSSE days to leading cross-border teams at Brain Station 23, the journey taught me resilient engineering.',
    linkedinUrl: 'https://linkedin.com/in/tahmid-khan',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: true,
    offerTopic: 'Full-Stack Web Architecture & Clean Code',
    offerMode: 'ONLINE'
  },
  {
    name: 'Sabrina Islam',
    email: 'sabrina.islam@example.com',
    batch: 16,
    wingName: 'Marketing & PR Department',
    role: 'Senior Digital Strategist',
    org: 'Grameenphone',
    location: 'Dhaka, Bangladesh',
    bio: 'Driving multi-channel growth campaigns and brand narrative strategy for national telco ecosystems.',
    story: 'Leading YSSE public campaigns shaped my perspective on user psychology and organic audience acquisition.',
    linkedinUrl: 'https://linkedin.com/in/sabrina-islam',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: true,
    offerTopic: 'Digital Brand Strategy & Campaign Growth',
    offerMode: 'BOTH'
  },
  {
    name: 'Arifur Rahman',
    email: 'arifur.rahman@example.com',
    batch: 15,
    wingName: 'IT: Wing 3 — Systems Automation & DataOps',
    role: 'Cloud DevOps Architect',
    org: 'Amazon Web Services',
    location: 'Singapore',
    bio: 'Automating multi-region Kubernetes pipelines, Terraform modules, and self-healing cloud infrastructure.',
    linkedinUrl: 'https://linkedin.com/in/arifur-devops',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: true,
    offerTopic: 'Cloud Infrastructure & DevOps Career Paths',
    offerMode: 'ONLINE'
  },
  {
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@example.com',
    batch: 14,
    wingName: 'Admin & HR Department',
    role: 'People Operations Lead',
    org: 'Unilever Bangladesh',
    location: 'Dhaka, Bangladesh',
    bio: 'Specializing in talent acquisition, performance systems, and empathetic organizational cultures.',
    linkedinUrl: 'https://linkedin.com/in/nusrat-hr',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: false,
    offerTopic: 'HR Insights, CV Crafting & Interview Prep',
    offerMode: 'ONLINE'
  },
  {
    name: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@example.com',
    batch: 16,
    wingName: 'IT: Wing 4 — AI Integration & Cybersecurity',
    role: 'Machine Learning Specialist',
    org: 'Optimizely',
    location: 'Dhaka, Bangladesh',
    bio: 'Researching LLM integration, adversarial robustness, and real-time inference optimization.',
    story: 'At YSSE, tech innovation was about impact. Today I build generative AI solutions that simplify workflows.',
    linkedinUrl: 'https://linkedin.com/in/tanvir-ml',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: true,
    offerTopic: 'Demystifying Applied AI & Modern Machine Learning',
    offerMode: 'ONLINE'
  },
  {
    name: 'Shahriar Kabir',
    email: 'shahriar.kabir@example.com',
    batch: 17,
    wingName: 'Graphic Design Department',
    role: 'Lead UI/UX Designer',
    org: 'bKash Limited',
    location: 'Dhaka, Bangladesh',
    bio: 'Crafting accessible, human-centered fintech interfaces and scalable design systems.',
    linkedinUrl: 'https://linkedin.com/in/shahriar-ux',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: true,
    offerTopic: 'Product Design, Figma Systems & Portfolio Reviews',
    offerMode: 'BOTH'
  },
  {
    name: 'Zubair Al Mahmud',
    email: 'zubair.mahmud@example.com',
    batch: 13,
    wingName: 'Business Development Department',
    role: 'Partnerships Director',
    org: 'BRAC Enterprises',
    location: 'Dhaka, Bangladesh',
    bio: 'Structuring high-impact public-private partnerships across South Asia.',
    linkedinUrl: 'https://linkedin.com/in/zubair-bizdev',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    isContactPublic: true,
    offerTopic: 'Business Development & Strategic Partnerships',
    offerMode: 'ONLINE'
  },
  {
    name: 'Raihan Hossain',
    email: 'raihan.hossain@example.com',
    batch: 17,
    wingName: 'IT: Wing 2 — Software & App Engineering',
    role: 'Mobile Software Engineer',
    org: 'SELISE Digital Platforms',
    location: 'Dhaka, Bangladesh',
    bio: 'Building cross-platform Flutter and native iOS apps with reactive state management.',
    linkedinUrl: 'https://linkedin.com/in/raihan-mobile',
    photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&auto=format&fit=crop&q=80',
    status: 'PENDING',
    isContactPublic: false
  }
];
