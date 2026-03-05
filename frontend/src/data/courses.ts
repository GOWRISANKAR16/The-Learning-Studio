export type CourseCategory =
  | 'Programming'
  | 'Web Development'
  | 'Data Science & AI'
  | 'DevOps & Cloud'
  | 'Mobile Development'
  | 'Cybersecurity'
  | 'Computer Science'
  | 'Software Engineering'
  | 'Other'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Lesson {
  id: string
  title: string
  order: number
  youtubeUrl: string
  durationMinutes?: number
}

export interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  slug: string
  category: CourseCategory
  difficulty: Difficulty
  description: string
  instructor: string
  thumbnailUrl: string
  totalMinutes?: number
  sections: Section[]
}

function getYoutubeId(youtubeUrl: string): string {
  try {
    const url = new URL(youtubeUrl)
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1)
    }
    const id = url.searchParams.get('v')
    return id ?? ''
  } catch {
    return ''
  }
}

// Helper to create a simple single-section course from a YouTube URL.
function singleLessonCourse(args: {
  id: string
  title: string
  category: CourseCategory
  difficulty: Difficulty
  instructor: string
  youtubeUrl: string
  thumbnailUrl?: string
}): Course {
  const { id, title, category, difficulty, instructor, youtubeUrl } = args
  const ytId = getYoutubeId(youtubeUrl)
  const autoThumbnail = ytId
    ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    : 'https://img.youtube.com/vi/00000000000/maxresdefault.jpg'
  const thumbnailUrl = args.thumbnailUrl ?? autoThumbnail

  return {
    id,
    title,
    slug: id,
    category,
    difficulty,
    description: `${title} full video course hosted on YouTube.`,
    instructor,
    thumbnailUrl,
    sections: [
      {
        id: `${id}-s1`,
        title: 'Main course',
        order: 1,
        lessons: [
          {
            id: `${id}-l1`,
            title,
            order: 1,
            youtubeUrl,
          },
        ],
      },
    ],
  }
}

export const courses: Course[] = [
  // Programming
  singleLessonCourse({
    id: 'java-full-course',
    title: 'Java Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
  }),
  singleLessonCourse({
    id: 'javascript-full-course',
    title: 'JavaScript Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
  }),
  singleLessonCourse({
    id: 'python-full-course',
    title: 'Python Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
  }),
  singleLessonCourse({
    id: 'c-programming',
    title: 'C Programming Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=KJgsSFOSQv0',
  }),
  singleLessonCourse({
    id: 'cpp-programming',
    title: 'C++ Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
  }),
  singleLessonCourse({
    id: 'go-programming-course',
    title: 'Go Programming Course',
    category: 'Programming',
    difficulty: 'Intermediate',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=YS4e4q9oBaU',
  }),
  singleLessonCourse({
    id: 'rust-programming-course',
    title: 'Rust Programming Course',
    category: 'Programming',
    difficulty: 'Intermediate',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=zF34dRivLOw',
  }),
  singleLessonCourse({
    id: 'kotlin-full-course',
    title: 'Kotlin Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=F9UC9DY-vIU',
  }),
  singleLessonCourse({
    id: 'swift-programming-course',
    title: 'Swift Programming Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=comQ1-x2a1Q',
  }),
  singleLessonCourse({
    id: 'typescript-full-course',
    title: 'TypeScript Full Course',
    category: 'Programming',
    difficulty: 'Intermediate',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=30LWjhZzg50',
  }),

  // Web Development
  singleLessonCourse({
    id: 'html-full-course',
    title: 'HTML Full Course',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'Web Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
  }),
  singleLessonCourse({
    id: 'css-full-course',
    title: 'CSS Full Course',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'Web Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
  }),
  singleLessonCourse({
    id: 'responsive-web-design',
    title: 'Responsive Web Design',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'Web Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=srvUrASNj0s',
  }),
  singleLessonCourse({
    id: 'react-full-course',
    title: 'React JS Full Course',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructor: 'React Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
  }),
  singleLessonCourse({
    id: 'nextjs-full-course',
    title: 'Next.js Full Course',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructor: 'React Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
  }),
  singleLessonCourse({
    id: 'nodejs-full-course',
    title: 'Node.js Full Course',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructor: 'Backend Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=RLtyhwFtXQA',
  }),
  singleLessonCourse({
    id: 'expressjs-crash-course',
    title: 'Express.js Crash Course',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'Backend Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
  }),
  singleLessonCourse({
    id: 'mongodb-full-course',
    title: 'MongoDB Full Course',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'DB Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
  }),
  singleLessonCourse({
    id: 'mysql-full-course',
    title: 'MySQL Full Course',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'DB Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
  }),
  singleLessonCourse({
    id: 'fullstack-web-development',
    title: 'Full Stack Web Development',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructor: 'Full Stack Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
  }),

  // Data Science / AI
  singleLessonCourse({
    id: 'machine-learning',
    title: 'Machine Learning Full Course',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ',
  }),
  singleLessonCourse({
    id: 'deep-learning-full-course',
    title: 'Deep Learning Full Course',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
  }),
  singleLessonCourse({
    id: 'data-science-course',
    title: 'Data Science Course',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
  }),
  singleLessonCourse({
    id: 'python-for-data-science',
    title: 'Python for Data Science',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
  }),
  singleLessonCourse({
    id: 'tensorflow-full-course',
    title: 'TensorFlow Full Course',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
  }),
  singleLessonCourse({
    id: 'pandas-tutorial',
    title: 'Pandas Tutorial',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
  }),
  singleLessonCourse({
    id: 'numpy-tutorial',
    title: 'NumPy Tutorial',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
  }),
  singleLessonCourse({
    id: 'ai-for-beginners',
    title: 'AI for Beginners',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'Data Science Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
  }),

  // Applied AI & LLMs (OpenAI / Claude etc.)
  singleLessonCourse({
    id: 'openai-developer-full-course',
    title: 'OpenAI Developer Full Course – Master API & Function Calling',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=mnJJPltybBM',
  }),
  singleLessonCourse({
    id: 'openai-api-tutorial-beginners',
    title: 'OpenAI API Tutorial for Beginners – Use GPT Models',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=EtLl7n2FVU0',
  }),
  singleLessonCourse({
    id: 'first-openai-api-app',
    title: 'Your First OpenAI API App – Step-by-Step Guide',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=0z-MGzu3EjA',
  }),
  singleLessonCourse({
    id: 'openai-assistants-api-course',
    title: 'OpenAI Assistants API – Course for Beginners',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=qHPonmSX4Ms',
  }),
  singleLessonCourse({
    id: 'openai-api-python-chatgpt-app',
    title: 'OpenAI API Tutorial in Python – Build ChatGPT App',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=yq803m5ESXI',
  }),
  singleLessonCourse({
    id: 'claude-code-intro-setup',
    title: 'Claude Code Tutorial – Introduction & Setup',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=SUysp3sJHbA',
  }),
  singleLessonCourse({
    id: 'claude-code-full-app-course',
    title: 'Full Claude Code App Building Course (2+ Hours)',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=2JEzjfs6Kew',
  }),
  singleLessonCourse({
    id: 'claude-api-js-developer-guide',
    title: 'Build Apps with Claude API (JavaScript Developer Guide)',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=LLTUWZO8D0g',
  }),
  singleLessonCourse({
    id: 'claude-code-ai-marketing-agent',
    title: 'Claude Code Full Course – Build AI Marketing Agent',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=fYX6hHC9FhQ',
  }),
  singleLessonCourse({
    id: 'building-ai-agents-python',
    title: 'Building AI Agents in Python – Beginner Course',
    category: 'Data Science & AI',
    difficulty: 'Beginner',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=bZzyPscbtI8',
  }),
  singleLessonCourse({
    id: 'generative-ai-full-course-multi-model',
    title: 'Generative AI Full Course – Gemini, OpenAI, Llama',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=mEsleV16qdo',
  }),
  singleLessonCourse({
    id: 'ai-coding-crash-course-gpt-claude',
    title: 'AI Coding Crash Course – Build Apps with GPT & Claude',
    category: 'Data Science & AI',
    difficulty: 'Intermediate',
    instructor: 'AI Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=HQaVFUV2Ag',
  }),

  // DevOps / Cloud
  singleLessonCourse({
    id: 'docker-full-course',
    title: 'Docker Full Course',
    category: 'DevOps & Cloud',
    difficulty: 'Intermediate',
    instructor: 'DevOps Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
  }),
  singleLessonCourse({
    id: 'kubernetes-full-course',
    title: 'Kubernetes Full Course',
    category: 'DevOps & Cloud',
    difficulty: 'Intermediate',
    instructor: 'DevOps Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
  }),
  singleLessonCourse({
    id: 'aws-full-course',
    title: 'AWS Full Course',
    category: 'DevOps & Cloud',
    difficulty: 'Beginner',
    instructor: 'Cloud Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s',
  }),
  singleLessonCourse({
    id: 'devops-full-course',
    title: 'DevOps Full Course',
    category: 'DevOps & Cloud',
    difficulty: 'Intermediate',
    instructor: 'DevOps Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=0yWAtQ6wYNM',
  }),
  singleLessonCourse({
    id: 'git-github-course',
    title: 'Git and GitHub Course',
    category: 'DevOps & Cloud',
    difficulty: 'Beginner',
    instructor: 'DevOps Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
  }),
  singleLessonCourse({
    id: 'linux-full-course',
    title: 'Linux Full Course',
    category: 'DevOps & Cloud',
    difficulty: 'Beginner',
    instructor: 'DevOps Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=iv8rSLsi1xo',
  }),

  // Mobile
  singleLessonCourse({
    id: 'android-development',
    title: 'Android Development Course',
    category: 'Mobile Development',
    difficulty: 'Beginner',
    instructor: 'Mobile Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=fis26HvvDII',
  }),
  singleLessonCourse({
    id: 'flutter-full-course',
    title: 'Flutter Full Course',
    category: 'Mobile Development',
    difficulty: 'Beginner',
    instructor: 'Mobile Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=VPvVD8t02U8',
  }),
  singleLessonCourse({
    id: 'react-native-full-course',
    title: 'React Native Full Course',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    instructor: 'Mobile Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
  }),

  // Cybersecurity
  singleLessonCourse({
    id: 'cybersecurity-full-course',
    title: 'Cybersecurity Full Course',
    category: 'Cybersecurity',
    difficulty: 'Beginner',
    instructor: 'Security Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=U_P23SqJaDc',
  }),
  singleLessonCourse({
    id: 'ethical-hacking-course',
    title: 'Ethical Hacking Course',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    instructor: 'Security Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
  }),
  singleLessonCourse({
    id: 'network-security-course',
    title: 'Network Security Course',
    category: 'Cybersecurity',
    difficulty: 'Beginner',
    instructor: 'Security Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
  }),

  // Computer Science
  singleLessonCourse({
    id: 'dsa-course',
    title: 'Data Structures and Algorithms',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    instructor: 'CS Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
  }),
  singleLessonCourse({
    id: 'operating-systems-course',
    title: 'Operating Systems Course',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    instructor: 'CS Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=26QPDBe-NB8',
  }),
  singleLessonCourse({
    id: 'database-management-systems',
    title: 'Database Management Systems',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    instructor: 'CS Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=dl00fOOYLOM',
  }),
  singleLessonCourse({
    id: 'computer-networks-course',
    title: 'Computer Networks Course',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    instructor: 'CS Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
  }),

  // Software Engineering
  singleLessonCourse({
    id: 'system-design-course',
    title: 'System Design Course',
    category: 'Software Engineering',
    difficulty: 'Advanced',
    instructor: 'Senior Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=UzLMhqg3_Wc',
  }),
  singleLessonCourse({
    id: 'microservices-architecture',
    title: 'Microservices Architecture',
    category: 'Software Engineering',
    difficulty: 'Advanced',
    instructor: 'Senior Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=rv4LlmLmVWk',
  }),
  singleLessonCourse({
    id: 'rest-api-design-course',
    title: 'REST API Design Course',
    category: 'Software Engineering',
    difficulty: 'Intermediate',
    instructor: 'Senior Engineer',
    youtubeUrl: 'https://www.youtube.com/watch?v=Q-BpqyOT3a8',
  }),

  // Extra
  singleLessonCourse({
    id: 'graphql-full-course',
    title: 'GraphQL Full Course',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructor: 'API Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=eIQh02xuVw4',
  }),
  singleLessonCourse({
    id: 'tailwind-css-full-course',
    title: 'Tailwind CSS Full Course',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'CSS Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=dFgzHOX84xQ',
  }),
  singleLessonCourse({
    id: 'threejs-course',
    title: 'Three.js Course',
    category: 'Web Development',
    difficulty: 'Intermediate',
    instructor: '3D Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=Q7AOvWpIVHU',
  }),
  singleLessonCourse({
    id: 'web3-development-course',
    title: 'Web3 Development Course',
    category: 'Other',
    difficulty: 'Intermediate',
    instructor: 'Blockchain Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=gyMwXuJrbJQ',
  }),
  singleLessonCourse({
    id: 'blockchain-full-course',
    title: 'Blockchain Full Course',
    category: 'Other',
    difficulty: 'Intermediate',
    instructor: 'Blockchain Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
  }),
]

export function getCourseById(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId)
}

