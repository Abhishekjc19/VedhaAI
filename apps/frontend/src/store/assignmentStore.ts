import { create } from 'zustand';
import { Assignment, QuestionPaper, GenerationProgress } from '../types/index';

interface AssignmentStore {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  currentPaper: QuestionPaper | null;
  generationProgress: GenerationProgress | null;
  isGenerating: boolean;
  
  // Actions
  setAssignments: (assignments: Assignment[]) => void;
  setCurrentAssignment: (assignment: Assignment | null) => void;
  setCurrentPaper: (paper: QuestionPaper | null) => void;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  currentAssignment: null,
  currentPaper: null,
  generationProgress: null,
  isGenerating: false,
  
  setAssignments: (assignments) => set({ assignments }),
  setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),
  setCurrentPaper: (paper) => set({ currentPaper: paper }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  updateAssignmentStatus: (id, status) => set((state) => ({
    assignments: state.assignments.map((a) =>
      a.id === id ? { ...a, status } : a
    ),
  })),
}));
