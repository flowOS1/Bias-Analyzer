import { ExampleArticle, BiasDefinition } from "./types";

export const EXAMPLE_ARTICLES: ExampleArticle[] = [
  {
    id: "sensational",
    title: "The Silent Health Threat Lurking In Your Kitchen Right Now",
    category: "Sensational",
    description: "A highly sensationalized, emotional clickbait article filled with fear-mongering and loaded language.",
    text: `Unseen killers are lurking in your home, and your family is in imminent danger. Shocking new revelations show that ordinary, everyday non-stick frying pans are silently releasing toxic, cancer-causing fumes into your clean air. 

Corporate fat-cats are greedily covering up this catastrophic health nightmare to protect their billions, while innocent children are breathing in poison every single day. Outraged citizens are rightfully demanding that these death-traps be banned immediately. 

Why hasn't the corrupt government intervened? They are in the pockets of big chemical conglomerates. It's a terrifying conspiracy, and if you don't throw away your kitchenware today, you are playing Russian roulette with your life.`
  },
  {
    id: "political",
    title: "The Mayor's Disastrous Transit Plan: A Catastrophic Failure",
    category: "Political",
    description: "A politically biased editorial attacking local government policy using aggressive framing and ad-hominem.",
    text: `Mayor Jenkins' laughably naive and completely brain-dead transit proposal is a total slap in the face to hard-working taxpayers. This radical, socialist-inspired scheme will funnel millions of hard-earned middle-class dollars directly into the pockets of lazy city consultants and foreign contractors. 

Instead of addressing real roads, Jenkins wants to build expensive, empty light-rail lines that nobody asked for. Of course, his smug, out-of-touch inner circle of urban elitists will never ride it—they prefer chauffeured SUVs. 

This catastrophic failure of leadership is ruining our city, and anyone who supports this bloated waste of money is clearly blind to the obvious economic disaster staring us right in the face.`
  },
  {
    id: "one-sided",
    title: "Clean Energy is Ruining Our Electrical Grid and Costing Billions",
    category: "One-Sided",
    description: "A biased article exhibiting severe cherry-picking (confirmation bias) and ignoring opposing evidence.",
    text: `Wind and solar energy are a complete disaster for our country's economic future. Recent reports from Texas prove that wind turbines freeze in the winter, leaving millions of helpless families in pitch-black freezing darkness. 

These highly unreliable, fragile energy sources are incredibly expensive to manufacture and generate virtually zero power on cloudy or calm days. Furthermore, thousands of birds are being brutally sliced to pieces by rotating blades, destroying our precious wildlife. 

Traditional, reliable coal and clean natural gas are the only logical path forward for any civilized nation. Continuing to subsidize useless green energy projects is an exercise in pure economic suicide.`
  },
  {
    id: "balanced",
    title: "Municipal Transit Council Releases Annual Infrastructure Review",
    category: "Balanced",
    description: "A highly objective, neutral, and balanced news report with no significant bias.",
    text: `The Municipal Transit Council has published its annual infrastructure proposal, outlining plans to expand the city's public transport network over the next five years. The report recommends a $150 million budget split between repairing existing roadways and developing a new light-rail line in the eastern suburbs.

Proponents of the plan argue that light-rail expansion will decrease vehicle emissions and ease congestion in high-traffic corridors. They cite a feasibility study predicting a 12% reduction in travel times for commuters.

However, several local business owners have expressed concern over potential disruptions during the construction phase. Additionally, members of the taxpayer budget committee suggest that funding should focus primarily on repaving roads before initiating new transit projects.`
  }
];

export const BIAS_ENCYCLOPEDIA: BiasDefinition[] = [
  {
    name: "Sensationalism",
    category: "Media Slant",
    description: "The use of shocking, provocative, or exaggerated language and headlines to provoke strong emotional responses (fear, anger, excitement) at the expense of accuracy or context.",
    example: "'Unseen killers are lurking in your home, and your family is in imminent danger!'",
    mitigation: "Check if the claims are backed by scientific consensus or statistics, and rephrase with calm, objective language."
  },
  {
    name: "Loaded Language",
    category: "Rhetorical",
    description: "Words or phrases with strong emotional connotations (positive or negative) used to influence the reader's opinion without logical evidence.",
    example: "Using 'corporate fat-cats' instead of 'business executives' or 'naive scheme' instead of 'proposal'.",
    mitigation: "Replace emotional or judgmental descriptors with descriptive, neutral, and widely accepted terms."
  },
  {
    name: "Framing Bias",
    category: "Cognitive/Media",
    description: "Presenting information in a selective way that pre-determines how the reader should interpret it, often by highlighting certain facts while completely omitting crucial context.",
    example: "Labeling a transit plan as 'a socialist-inspired scheme' to frame it immediately as a partisan issue rather than an urban planning topic.",
    mitigation: "Examine alternative interpretations or viewpoints of the same event or policy."
  },
  {
    name: "Cherry Picking (Omission)",
    category: "Cognitive",
    description: "Selecting and displaying only the data points or stories that support a specific position, while ignoring a significant portion of contradictory evidence.",
    example: "Pointing out that wind turbines froze in one specific winter storm in Texas while ignoring that they operate successfully in freezing temperatures worldwide.",
    mitigation: "Seek out comprehensive data, syntheses, and the overall consensus rather than isolated incidents."
  },
  {
    name: "Ad Hominem (Personal Attack)",
    category: "Logical Fallacy",
    description: "Attacking the character, motives, or attributes of a person making an argument rather than addressing the substance of the argument itself.",
    example: "'Of course, his smug, out-of-touch inner circle of elitists will never ride it.'",
    mitigation: "Focus strictly on the data, logic, and functional pros/cons of the proposal being discussed."
  },
  {
    name: "Confirmation Bias",
    category: "Cognitive",
    description: "The tendency to search for, interpret, favor, and recall information in a way that confirms one's preexisting beliefs or hypotheses.",
    example: "Only reading articles that criticize an opposing political figure and accepting any unsourced rumor as absolute fact.",
    mitigation: "Actively challenge your own beliefs by reading well-sourced reporting from diverse perspectives."
  },
  {
    name: "False Equivalence",
    category: "Logical Fallacy",
    description: "Presenting two opposing arguments as equally valid or supported by equal evidence when one is overwhelmingly supported by facts and the other is not.",
    example: "Giving equal time and scientific weight to a flat-earth theory alongside standard astrophysics.",
    mitigation: "Provide accurate context regarding scientific or factual consensus and standard-of-evidence."
  },
  {
    name: "Bandwagon Effect",
    category: "Cognitive/Rhetorical",
    description: "Arguing that a claim must be true or a policy must be correct simply because 'everyone agrees' or 'outraged citizens demand' it.",
    example: "'Outraged citizens are rightfully demanding that these death-traps be banned immediately.'",
    mitigation: "Analyze the claim on its own merits, rather than appealing to the popularity or emotional intensity of the crowd."
  }
];
