const criticalWords = [
  'fire',
  'smoke',
  'electric shock',
  'danger',
  'unsafe',
  'injury',
  'accident',
  'no water',
  'water supply',
  'power outage',
];

const highWords = [
  'not working',
  'broken',
  'leaking',
  'no wifi',
  'wifi down',
  'projector',
  'flickering',
  'overflowing',
];

export function suggestPriority(title, description, category) {
  const text = `${title} ${description} ${category}`.toLowerCase();

  if (criticalWords.some((word) => text.includes(word))) {
    return {
      priority: 'Critical',
      reason: 'Potential safety risk or essential service failure.',
    };
  }

  if (highWords.some((word) => text.includes(word))) {
    return {
      priority: 'High',
      reason: 'This issue may significantly disrupt campus activities.',
    };
  }

  if (category === 'Electrical' || category === 'Water') {
    return {
      priority: 'Medium',
      reason: 'This affects an important campus facility or service.',
    };
  }

  return {
    priority: 'Low',
    reason: 'This appears to be a lower-impact campus issue.',
  };
}
