export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateAverageMarksPerQuestion(
  totalMarks: number,
  numberOfQuestions: number
): number {
  return Math.round((totalMarks / numberOfQuestions) * 10) / 10;
}

export function getStatusBadgeColor(
  status: string
): 'bg-blue-100 text-blue-800' | 'bg-yellow-100 text-yellow-800' | 'bg-green-100 text-green-800' | 'bg-red-100 text-red-800' {
  switch (status) {
    case 'draft':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
