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
  /** Optional price from API; when missing, a stable display price is derived from course id */
  price?: number
}

/** Stable display price for a course. Uses course.price when set, otherwise derived from course id. Value is in INR (rupees). */
export function getCourseDisplayPrice(course: Course): number {
  if (course.price != null && course.price >= 0) return course.price
  let hash = 0
  for (let i = 0; i < course.id.length; i += 1) {
    hash = (hash + course.id.charCodeAt(i)) % 1000
  }
  const pricesInr = [499, 799, 999, 1299, 1499]
  return pricesInr[hash % pricesInr.length]
}

/** Format price in Indian Rupees for display. */
export function formatPriceInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
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

// Helper to create a multi-section course from a single YouTube URL.
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

  const baseTitle =
    title.replace(/full course|course|crash course/gi, '').trim() || title

  const makeLesson = (
    lessonId: string,
    lessonTitle: string,
    order: number,
    durationMinutes: number,
  ) => ({
    id: lessonId,
    title: lessonTitle,
    order,
    youtubeUrl,
    durationMinutes,
  })

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
        id: `${id}-intro`,
        title: 'Course introduction',
        order: 1,
        lessons: [
          makeLesson(
            `${id}-welcome`,
            `Welcome to the ${baseTitle || title} course`,
            1,
            3,
          ),
          makeLesson(
            `${id}-setup`,
            'Setting up your tools and environment',
            2,
            12,
          ),
          makeLesson(
            `${id}-first-steps`,
            `First steps with ${baseTitle || title}`,
            3,
            10,
          ),
        ],
      },
      {
        id: `${id}-fundamentals`,
        title: `${baseTitle || title} fundamentals`,
        order: 2,
        lessons: [
          makeLesson(
            `${id}-basics-1`,
            'Core concepts and basic syntax',
            1,
            18,
          ),
          makeLesson(
            `${id}-basics-2`,
            'Working with data and structures',
            2,
            20,
          ),
          makeLesson(
            `${id}-basics-3`,
            'Control flow and decision making',
            3,
            19,
          ),
        ],
      },
      {
        id: `${id}-advanced`,
        title: 'Intermediate and advanced topics',
        order: 3,
        lessons: [
          makeLesson(
            `${id}-advanced-1`,
            'Intermediate patterns and best practices',
            1,
            21,
          ),
          makeLesson(
            `${id}-advanced-2`,
            'Error handling and troubleshooting',
            2,
            17,
          ),
          makeLesson(
            `${id}-advanced-3`,
            'Performance and optimisation tips',
            3,
            16,
          ),
        ],
      },
      {
        id: `${id}-project`,
        title: 'Project and next steps',
        order: 4,
        lessons: [
          makeLesson(
            `${id}-project-plan`,
            'Planning the final project',
            1,
            14,
          ),
          makeLesson(
            `${id}-project-build`,
            'Building the project step by step',
            2,
            28,
          ),
          makeLesson(
            `${id}-project-wrap`,
            'Wrap-up and where to go next',
            3,
            9,
          ),
        ],
      },
    ],
  }
}

export const courses: Course[] = [
  // Programming
  {
    id: 'java-full-course',
    title: 'Java Full Course',
    slug: 'java-full-course',
    category: 'Programming',
    difficulty: 'Beginner',
    description:
      'Learn Java from zero to hero. Cover the Java language, OOP, collections, and real-world projects.',
    instructor: 'Online Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/BGTx91t8q50/maxresdefault.jpg',
    sections: [
      {
        id: 'java-intro',
        title: 'Course introduction',
        order: 1,
        lessons: [
          {
            id: 'java-welcome',
            title: 'Welcome to the Java bootcamp',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 3,
          },
          {
            id: 'java-setup',
            title: 'Installing JDK and IntelliJ IDEA',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 12,
          },
          {
            id: 'java-first-program',
            title: 'Your first Java program: Hello World',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 10,
          },
        ],
      },
      {
        id: 'java-basics',
        title: 'Java fundamentals',
        order: 2,
        lessons: [
          {
            id: 'java-variables',
            title: 'Variables, types and operators',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 18,
          },
          {
            id: 'java-control-flow',
            title: 'Control flow: if, switch, loops',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 22,
          },
          {
            id: 'java-methods',
            title: 'Methods and parameter passing',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 17,
          },
        ],
      },
      {
        id: 'java-oop',
        title: 'Object‑oriented Java',
        order: 3,
        lessons: [
          {
            id: 'java-classes-objects',
            title: 'Classes, objects and constructors',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 24,
          },
          {
            id: 'java-inheritance',
            title: 'Inheritance and polymorphism',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 26,
          },
          {
            id: 'java-interfaces',
            title: 'Interfaces and abstract classes',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 20,
          },
        ],
      },
      {
        id: 'java-advanced',
        title: 'Advanced topics & project',
        order: 4,
        lessons: [
          {
            id: 'java-collections',
            title: 'Collections framework: List, Set, Map',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 28,
          },
          {
            id: 'java-exceptions',
            title: 'Exceptions and error handling',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 18,
          },
          {
            id: 'java-mini-project',
            title: 'Mini project: Student management console app',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=BGTx91t8q50',
            durationMinutes: 35,
          },
        ],
      },
    ],
  },
  singleLessonCourse({
    id: 'javascript-full-course',
    title: 'JavaScript Full Course',
    category: 'Programming',
    difficulty: 'Beginner',
    instructor: 'Online Instructor',
    youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
  }),
  {
    id: 'python-full-course',
    title: 'Python Full Course',
    slug: 'python-full-course',
    category: 'Programming',
    difficulty: 'Beginner',
    description:
      'Learn Python step by step: syntax, data structures, functions, OOP and real‑world projects.',
    instructor: 'Online Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
    sections: [
      {
        id: 'python-intro',
        title: 'Getting started with Python',
        order: 1,
        lessons: [
          {
            id: 'python-welcome',
            title: 'Welcome and course structure',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 4,
          },
          {
            id: 'python-install',
            title: 'Installing Python and VS Code',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 14,
          },
        ],
      },
      {
        id: 'python-basics',
        title: 'Python basics',
        order: 2,
        lessons: [
          {
            id: 'python-syntax',
            title: 'Syntax, variables and numbers',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 20,
          },
          {
            id: 'python-strings',
            title: 'Strings, lists and dictionaries',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 24,
          },
          {
            id: 'python-control-flow',
            title: 'Conditionals and loops',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 22,
          },
        ],
      },
      {
        id: 'python-functions',
        title: 'Functions and modules',
        order: 3,
        lessons: [
          {
            id: 'python-functions-def',
            title: 'Defining and calling functions',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 18,
          },
          {
            id: 'python-args',
            title: '*args, **kwargs and default arguments',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 16,
          },
          {
            id: 'python-modules',
            title: 'Organising code into modules and packages',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 15,
          },
        ],
      },
      {
        id: 'python-project',
        title: 'Final project: CLI app',
        order: 4,
        lessons: [
          {
            id: 'python-project-planning',
            title: 'Planning the project',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 10,
          },
          {
            id: 'python-project-implementation',
            title: 'Implementing the CLI application',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            durationMinutes: 30,
          },
        ],
      },
    ],
  },
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
  {
    id: 'react-full-course',
    title: 'React JS Full Course',
    slug: 'react-full-course',
    category: 'Web Development',
    difficulty: 'Intermediate',
    description:
      'Build modern React applications with components, hooks, state management and real‑world UI patterns.',
    instructor: 'React Instructor',
    thumbnailUrl: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
    sections: [
      {
        id: 'react-intro',
        title: 'Introduction & setup',
        order: 1,
        lessons: [
          {
            id: 'react-welcome',
            title: 'Welcome to the React course',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 5,
          },
          {
            id: 'react-tooling',
            title: 'Tooling: Node, npm and Vite',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 15,
          },
        ],
      },
      {
        id: 'react-fundamentals',
        title: 'React fundamentals',
        order: 2,
        lessons: [
          {
            id: 'react-components',
            title: 'Components, props and JSX',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 22,
          },
          {
            id: 'react-state',
            title: 'State and events with useState',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 24,
          },
          {
            id: 'react-effects',
            title: 'Side effects with useEffect',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 21,
          },
        ],
      },
      {
        id: 'react-advanced',
        title: 'Advanced hooks and patterns',
        order: 3,
        lessons: [
          {
            id: 'react-context',
            title: 'Context API for global state',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 18,
          },
          {
            id: 'react-performance',
            title: 'Memoization and performance',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 19,
          },
          {
            id: 'react-routing',
            title: 'Routing with React Router',
            order: 3,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 20,
          },
        ],
      },
      {
        id: 'react-project',
        title: 'Capstone project',
        order: 4,
        lessons: [
          {
            id: 'react-project-design',
            title: 'Designing the Learning Studio UI',
            order: 1,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 16,
          },
          {
            id: 'react-project-implementation',
            title: 'Building the project step by step',
            order: 2,
            youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            durationMinutes: 34,
          },
        ],
      },
    ],
  },
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

