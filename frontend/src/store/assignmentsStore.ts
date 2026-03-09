import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AssignmentStatus = 'pending' | 'submitted' | 'graded'

export interface MCQQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  marks: number
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  deadline: string
  description: string
  /** MCQ questions for the quiz */
  questions: MCQQuestion[]
}

export interface Submission {
  assignmentId: string
  userId: string
  submittedAt: string
  status: AssignmentStatus
  answers: { questionId: string; selectedIndex: number }[]
  score: number
  maxScore: number
}

interface AssignmentsState {
  assignments: Assignment[]
  submissions: Submission[]
  setAssignments: (assignments: Assignment[]) => void
  getAssignmentsForUser: (userId: string) => Assignment[]
  getSubmission: (assignmentId: string, userId: string) => Submission | undefined
  saveMcqSubmission: (args: {
    assignmentId: string
    userId: string
    answers: { questionId: string; selectedIndex: number }[]
    score: number
    maxScore: number
  }) => void
}

export const useAssignmentsStore = create<AssignmentsState>()(
  persist(
    (set, get) => ({
      assignments: [
        {
          id: 'java-quiz-1',
          courseId: 'java-full-course',
          title: 'Java Basics Quiz',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Short quiz on variables, types, and control flow in Java.',
          questions: [
            {
              id: 'java-q1',
              text: 'Which keyword is used to define a class in Java?',
              options: ['class', 'struct', 'object', 'def'],
              correctIndex: 0,
              marks: 1,
            },
            {
              id: 'java-q2',
              text: 'What is the default value of an uninitialised int field in a class?',
              options: ['0', 'null', 'undefined', '1'],
              correctIndex: 0,
              marks: 1,
            },
            {
              id: 'java-q3',
              text: 'Which loop will execute at least once?',
              options: ['for', 'while', 'do-while', 'enhanced for'],
              correctIndex: 2,
              marks: 1,
            },
          ],
        },
        {
          id: 'python-project-1',
          courseId: 'python-full-course',
          title: 'Python Mini Project',
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Build a small CLI app that manipulates data from a file.',
          questions: [
            {
              id: 'python-q1',
              text: 'Which keyword is used to define a function in Python?',
              options: ['func', 'def', 'function', 'lambda'],
              correctIndex: 1,
              marks: 1,
            },
            {
              id: 'python-q2',
              text: 'Which data structure is an ordered, mutable collection?',
              options: ['tuple', 'set', 'list', 'dict'],
              correctIndex: 2,
              marks: 1,
            },
            {
              id: 'python-q3',
              text: 'Which exception is raised when a file is not found?',
              options: [
                'IOError',
                'FileNotFoundError',
                'ValueError',
                'KeyError',
              ],
              correctIndex: 1,
              marks: 1,
            },
          ],
        },
        {
          id: 'react-hooks-1',
          courseId: 'react-full-course',
          title: 'React Hooks Assignment',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Practice useState and useEffect with a simple component.',
          questions: [
            {
              id: 'react-q1',
              text: 'Which hook is used to add state to a function component?',
              options: ['useState', 'useEffect', 'useContext', 'useRef'],
              correctIndex: 0,
              marks: 1,
            },
            {
              id: 'react-q2',
              text: 'When is an effect with an empty dependency array [] run?',
              options: [
                'On every render',
                'Only once after initial render',
                'Only on unmount',
                'Never',
              ],
              correctIndex: 1,
              marks: 1,
            },
            {
              id: 'react-q3',
              text: 'Which hook is best for persisting a mutable value across renders without causing re-renders?',
              options: ['useState', 'useEffect', 'useRef', 'useMemo'],
              correctIndex: 2,
              marks: 1,
            },
          ],
        },
      ],
      submissions: [],
      setAssignments(assignments) {
        set({ assignments })
      },
      getAssignmentsForUser() {
        return get().assignments
      },
      getSubmission(assignmentId, userId) {
        return get().submissions.find(
          (s) => s.assignmentId === assignmentId && s.userId === userId,
        )
      },
      saveMcqSubmission({ assignmentId, userId, answers, score, maxScore }) {
        const existing = get().submissions.filter(
          (s) => !(s.assignmentId === assignmentId && s.userId === userId),
        )
        const submission: Submission = {
          assignmentId,
          userId,
          submittedAt: new Date().toISOString(),
          status: 'graded',
          answers,
          score,
          maxScore,
        }
        set({ submissions: [...existing, submission] })
      },
    }),
    {
      name: 'lms-assignments',
    },
  ),
)

