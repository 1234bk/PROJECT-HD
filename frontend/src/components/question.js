export const questions = [
  // --- Step 1: The Basics ---
  {
    id: 'age',
    type: 'dropdown',
    text: 'To start, what is your age range?',
    subtext: 'This helps us understand your skin\'s current stage.',
    options: [
      { value: 'under-18', label: 'Under 18' },
      { value: '18-24', label: '18 - 24' },
      { value: '25-34', label: '25 - 34' },
      { value: '35-44', label: '35 - 44' },
      { value: '45-54', label: '45 - 54' },
      { value: '55-plus', label: '55+' },
    ],
  },
  {
    id: 'gender',
    type: 'mcq',
    text: 'What is your gender?',
    subtext: 'Gender can affect skin type, concerns, and product recommendations.',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other / Prefer not to say' },
    ],
  },
  // --- Step 2: Skin Type & Condition ---
  {
    id: 'skinType',
    type: 'mcq',
    text: 'How would you describe your skin on a typical day?',
    subtext: 'Select the one that sounds most like you.',
    options: [
      { value: 'oily', label: 'Shiny and greasy all over.' },
      { value: 'dry', label: 'Tight, flaky, or rough.' },
      { value: 'combination', label: 'Oily in the T-zone, dry elsewhere.' },
      { value: 'normal', label: 'Comfortable, not too oily or dry.' },
    ],
  },
  {
    id: 'postCleanseFeel',
    type: 'mcq',
    text: 'Immediately after washing with a gentle cleanser, how does your skin feel?',
    subtext: 'This reveals your skin\'s hydration and barrier health.',
    options: [
      { value: 'tight-dry', label: 'Very tight and dry, like it\'s too small for my face.' },
      { value: 'comfortable', label: 'Soft, smooth, and comfortable.' },
      { value: 'still-oily', label: 'Still a bit oily or unclean in some areas.' },
      { value: 'blotchy-irritated', label: 'Slightly red, blotchy, or irritated.' },
    ],
  },
  {
    id: 'sensitivityLevel',
    type: 'mcq',
    text: 'How reactive or sensitive is your skin?',
    subtext: 'Consider how it reacts to new products, fragrance, or sun.',
    options: [
      { value: 'very-resilient', label: 'Not at all. My skin can handle almost anything.' },
      { value: 'mildly-sensitive', label: 'Sometimes gets red or stings with strong products.' },
      { value: 'quite-sensitive', label: 'Often reacts to new products or fragrance.' },
      { value: 'very-sensitive', label: 'Very reactive. I have to be extremely careful.' },
    ],
  },
  // --- Step 3: Primary Goals ---
  {
    id: 'concerns',
    type: 'multiselect',
    text: 'What are your primary skin concerns?',
    subtext: 'Select up to 3 that are most important to you.',
    options: [
      { value: 'acne', label: 'Acne & Breakouts' },
      { value: 'aging', label: 'Fine Lines & Wrinkles' },
      { value: 'hyperpigmentation', label: 'Dark Spots & Hyperpigmentation' },
      { value: 'redness', label: 'Redness & Rosacea' },
      { value: 'dullness', label: 'Dullness & Uneven Tone' },
      { value: 'pores', label: 'Large or Clogged Pores' },
      { value: 'dryness', label: 'Dryness & Dehydration' },
    ],
  },
  // --- Step 4: Deeper Concern Analysis ---
  {
    id: 'acneType',
    type: 'multiselect',
    text: 'If you experience acne, what kind is it?',
    subtext: 'Select all that apply. If you don\'t get acne, you can skip this.',
    options: [
      { value: 'blackheads-whiteheads', label: 'Blackheads and whiteheads (clogged pores).' },
      { value: 'pimples', label: 'Red, inflamed pimples.' },
      { value: 'hormonal', label: 'Painful, deep cysts, often on the chin/jawline.' },
      { value: 'not-applicable', label: 'I don\'t really get acne.' },
    ],
  },
  // --- Step 5: Routine & History ---
  {
    id: 'currentActives',
    type: 'multiselect',
    text: 'Are you currently using any of these "active" ingredients?',
    subtext: 'Select any you use at least once a week.',
    options: [
      { value: 'retinoids', label: 'Retinol / Retinoids / Tretinoin' },
      { value: 'vitamin-c', label: 'Vitamin C serum' },
      { value: 'aha', label: 'Glycolic or Lactic Acid (AHAs)' },
      { value: 'bha', label: 'Salicylic Acid (BHA)' },
      { value: 'none', label: 'I\'m not sure / I don\'t use any of these.' },
    ],
  },
  {
    id: 'pastProductsHated',
    type: 'text',
    text: 'Have any specific products or ingredients irritated your skin in the past?',
    subtext: 'Type "None" if unsure.',
  },
  // --- Step 6: Lifestyle & Environment ---
  {
    id: 'climate',
    type: 'mcq',
    text: 'What is the climate like where you live?',
    subtext: 'Humidity levels greatly affect skin needs.',
    options: [
      { value: 'humid', label: 'Humid (air feels moist, coastal).' },
      { value: 'dry', label: 'Dry / Arid (air feels dry, low humidity).' },
      { value: 'temperate', label: 'Temperate (balanced, with distinct seasons).' },
      { value: 'cold', label: 'Mostly cold and windy.' },
    ],
  },
  {
    id: 'sleep',
    type: 'mcq',
    text: 'On average, how many hours of sleep do you get per night?',
    subtext: 'Sleep is critical for skin repair and regeneration.',
    options: [
      { value: 'less-than-5', label: 'Less than 5 hours' },
      { value: '5-6', label: '5 - 6 hours' },
      { value: '7-8', label: '7 - 8 hours' },
      { value: 'more-than-8', label: 'More than 8 hours' },
    ],
  },
  // --- Step 7: Final Preferences ---
  {
    id: 'budget',
    type: 'mcq',
    text: 'What is your approximate monthly budget for skincare?',
    subtext: 'This helps us recommend products in your price range.',
    options: [
      { value: 'budget-friendly', label: 'Budget-Friendly (< ₹2000)' },
      { value: 'mid-range', label: 'Mid-Range (₹2000 - ₹5000)' },
      { value: 'premium', label: 'Premium (> ₹5000)' },
      { value: 'no-budget', label: 'No budget, I want the best results.' },
    ],
  },
];
