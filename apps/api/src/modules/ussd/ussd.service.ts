type UssdInput = {
  sessionId: string;
  phoneNumber: string;
  text: string;
};

const CATEGORIES: Record<string, string> = {
  '1': 'POLICE',
  '2': 'EMPLOYMENT',
  '3': 'HOUSING',
  '4': 'FAMILY',
  '5': 'CONSUMER',
  '6': 'OTHER',
};

export async function handleUssdSession({ phoneNumber, text }: UssdInput): Promise<string> {
  const steps = text.split('*').filter(Boolean);

  if (steps.length === 0) {
    return (
      'CON WELCOME TO MSAADA\n' +
      '1. Police/Arrest\n' +
      '2. Employment\n' +
      '3. Housing/Land\n' +
      '4. Family\n' +
      '5. Consumer\n' +
      '6. Other'
    );
  }

  if (steps.length === 1) {
    const category = CATEGORIES[steps[0]];
    if (!category) {
      return 'END Invalid selection. Please dial again.';
    }
    return (
      `CON YOUR ISSUE MAY INVOLVE\n${category}\n\n` +
      '1. Next steps\n' +
      '2. Find help\n' +
      '3. End'
    );
  }

  if (steps.length === 2) {
    const category = CATEGORIES[steps[0]];
    const choice = steps[1];

    if (choice === '1') {
      return `END Next steps for ${category}:\n1. Preserve records\n2. Document the issue\n3. Seek legal assistance.`;
    }
    if (choice === '2') {
      return `END We are finding verified legal help for ${category} near you. You will receive an SMS shortly.`;
    }
    return 'END Thank you for using Msaada.';
  }

  return 'END Session ended.';
}
