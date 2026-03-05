import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AssignmentStatus = 'pending' | 'submitted' | 'graded'

export interface Assignment {
  id: string
  courseId: string
  title: string
  deadline: string
  description: string
  /** Assignment questions (prompts) for the student to answer */
  questions?: string[]
}

export interface Submission {
  assignmentId: string
  userId: string
  submittedAt: string
  content: string
  status: AssignmentStatus
  grade?: string
  feedback?: string
}

interface AssignmentsState {
  assignments: Assignment[]
  submissions: Submission[]
  setAssignments: (assignments: Assignment[]) => void
  getAssignmentsForUser: (userId: string) => Assignment[]
  getSubmission: (assignmentId: string, userId: string) => Submission | undefined
  submitAssignment: (args: {
    assignmentId: string
    userId: string
    content: string
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
            'What is the difference between int and Integer in Java?',
            'Write a for-loop that prints numbers 1 to 10.',
            'What are the three parts of a typical for-loop?',
          ],
        },
        {
          id: 'python-project-1',
          courseId: 'python-full-course',
          title: 'Python Mini Project',
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Build a small CLI app that manipulates data from a file.',
          questions: [
            'Describe the steps to read a text file line by line in Python.',
            'How would you handle a missing file (FileNotFoundError)?',
            'Submit the link to your GitHub repo or paste the main script code.',
          ],
        },
        {
          id: 'react-hooks-1',
          courseId: 'react-full-course',
          title: 'React Hooks Assignment',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Practice useState and useEffect with a simple component.',
          questions: [
            'When would you use useEffect with an empty dependency array?',
            'Create a small component that fetches and displays a list. Paste the code or link.',
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
      submitAssignment({ assignmentId, userId, content }) {
        const existing = get().submissions.filter(
          (s) => !(s.assignmentId === assignmentId && s.userId === userId),
        )
        const submission: Submission = {
          assignmentId,
          userId,
          submittedAt: new Date().toISOString(),
          content: content.trim(),
          status: 'submitted',
        }
        set({ submissions: [...existing, submission] })
      },
    }),
    {
      name: 'lms-assignments',
    },
  ),
)

