export function getScoreColor(score) {
  if (score >= 80) return '#16A34A'; // green
  if (score >= 60) return '#1E40AF'; // blue
  if (score >= 40) return '#D97706'; // amber
  return '#DC2626'; // red
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export function getScoreGradient(score) {
  if (score >= 80) return ['#16A34A', '#22C55E'];
  if (score >= 60) return ['#1E40AF', '#3B82F6'];
  if (score >= 40) return ['#D97706', '#F59E0B'];
  return ['#DC2626', '#EF4444'];
}

export function getLoanEligibility(score) {
  if (score >= 60) {
    return {
      eligible: true,
      limit: score >= 80 ? 10000 : score >= 70 ? 7500 : 5000,
      message: 'Eligible for emergency loan',
    };
  }
  return {
    eligible: false,
    limit: 0,
    message: 'Improve your score to unlock loans',
  };
}
