interface Complaint {
  title: string;
  description: string;
  category?: string;
  location?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface ClassificationResult {
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  matchedKeywords: string[];
  alternativeCategories?: string[];
}

const categoryRules = {
  'Electricity': {
    keywords: ['electricity', 'power', 'light', 'voltage', 'transformer', 'blackout', 'outage', 'electric', 'batti', 'bijuli', 'line'],
    weight: 1.0,
    basePriority: 'Medium'
  },
  'Roads': {
    keywords: ['road', 'pothole', 'transport', 'highway', 'street', 'bridge', 'sadak', 'bato'],
    weight: 1.0,
    basePriority: 'Medium'
  },
  'Water': {
    keywords: ['water', 'leak', 'supply', 'pipe', 'drainage', 'tap', 'drinking', 'hydrant', 'pani', 'dhara'],
    weight: 1.0,
    basePriority: 'Medium'
  },
  'Cyber Bureau': {
    keywords: ['cyber', 'online', 'fraud', 'scam', 'hacking', 'phishing', 'website'],
    weight: 1.0,
    basePriority: 'High'
  },
  'Police': {
    keywords: ['police', 'crime', 'theft', 'accident', 'emergency', 'fire', 'prahari', 'chor', 'durghatna'],
    weight: 1.0,
    basePriority: 'High'
  },
  'Transportation': {
    keywords: ['transport', 'bus', 'vehicle', 'yatayat'],
    weight: 1.0,
    basePriority: 'Medium'
  },
  'Other': {
    keywords: ['complaint', 'issue', 'problem', 'request', 'help', 'assistance'],
    weight: 0.5,
    basePriority: 'Low'
  }
};

const priorityKeywords = {
  'High': ['urgent', 'emergency', 'immediate', 'critical', 'important', 'ASAP'],
  'Critical': ['death', 'fire', 'blood', 'life threatening']
};

const durationKeywords = {
  'High': ['days', 'weeks', 'months'],
  'Medium': ['hours']
};

export const classifyComplaint = (complaint: Complaint): ClassificationResult => {
  const combinedText = `${complaint.title} ${complaint.description}`.toLowerCase();
  
  const scores: { [category: string]: number } = {};
  const matchedKeywords: { [category: string]: string[] } = {};
  
  // Calculate scores for each category
  Object.entries(categoryRules).forEach(([category, rule]) => {
    rule.keywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        if (!scores[category]) {
          scores[category] = 0;
          matchedKeywords[category] = [];
        }
        scores[category] += rule.weight;
        matchedKeywords[category].push(keyword);
      }
    });
  });
  
  // Find the category with highest score
  let bestCategory = 'Uncategorized';
  let highestScore = 0;
  let bestMatchedKeywords: string[] = [];
  
  Object.entries(scores).forEach(([category, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
      bestMatchedKeywords = matchedKeywords[category] || [];
    }
  });

  // Determine priority
  let priority: 'Low' | 'Medium' | 'High' | 'Critical' = categoryRules[bestCategory]?.basePriority || 'Low';

  for (const keyword of priorityKeywords['Critical']) {
    if (combinedText.includes(keyword)) {
      priority = 'Critical';
      break;
    }
  }

  if (priority !== 'Critical') {
    for (const keyword of priorityKeywords['High']) {
      if (combinedText.includes(keyword)) {
        priority = 'High';
        break;
      }
    }
  }
  
  if (priority !== 'Critical' && priority !== 'High') {
    for (const keyword of durationKeywords['High']) {
        if (combinedText.includes(keyword)) {
            priority = 'High';
            break;
        }
    }
  }

  if (priority !== 'Critical' && priority !== 'High' && priority !== 'Medium') {
    for (const keyword of durationKeywords['Medium']) {
        if (combinedText.includes(keyword)) {
            priority = 'Medium';
            break;
        }
    }
  }


  // Calculate confidence (0-100)
  const confidence = Math.min(100, Math.round((highestScore / 3) * 100));
  
  // Get alternative categories (other categories with scores > 0)
  const alternativeCategories = Object.entries(scores)
    .filter(([category, score]) => category !== bestCategory && score > 0)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([category]) => category);
  
  return {
    category: bestCategory,
    priority,
    confidence,
    matchedKeywords: bestMatchedKeywords,
    alternativeCategories: alternativeCategories.length > 0 ? alternativeCategories : undefined
  };
};

export const extractLocation = (complaint: Complaint): string | null => {
    // For now, this is a placeholder. We will integrate this with the map and GPS data later.
    const locationRegex = /in\s+([a-zA-Z\s]+)/;
    const match = complaint.description.match(locationRegex);
    return match ? match[1].trim() : null;
};