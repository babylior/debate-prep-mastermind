
// Types for the debate roles and stages
export type DebateRole = 
  'PM' | 'DPM' | 'LO' | 'DLO' | 'MG' | 'GW' | 'MO' | 'OW';

export type DebateStage = 'prep' | 'listening' | 'speech';

export type TeamPosition = 'OG' | 'OO' | 'CG' | 'CO';

export interface RoleData {
  id: DebateRole;
  name: string;
  fullName: string;
  teamPosition: TeamPosition;
  description: string;
  order: number;
  teamColor: string;
}

export interface StageContent {
  title: string;
  description: string;
  instructions: string[];
  questions: string[];
  tips: string[];
  templateSections?: {
    name: string;
    duration: string;
    description: string;
  }[];
}

export interface RoleStageContent {
  prep: StageContent;
  listening: StageContent;
  speech: StageContent;
}

// Define roles data
export const debateRoles: RoleData[] = [
  {
    id: 'PM',
    name: 'PM',
    fullName: 'Prime Minister',
    teamPosition: 'OG',
    description: 'Opening Government speaker who introduces the case and establishes the main arguments.',
    order: 1,
    teamColor: 'bg-debate-og'
  },
  {
    id: 'DPM',
    name: 'DPM',
    fullName: 'Deputy Prime Minister',
    teamPosition: 'OG',
    description: 'Second Opening Government speaker who reinforces the case and adds depth.',
    order: 3,
    teamColor: 'bg-debate-og'
  },
  {
    id: 'LO',
    name: 'LO',
    fullName: 'Leader of Opposition',
    teamPosition: 'OO',
    description: 'First Opening Opposition speaker who establishes counter-arguments.',
    order: 2,
    teamColor: 'bg-debate-oo'
  },
  {
    id: 'DLO',
    name: 'DLO',
    fullName: 'Deputy Leader of Opposition',
    teamPosition: 'OO',
    description: 'Second Opening Opposition speaker who deepens counter-arguments.',
    order: 4,
    teamColor: 'bg-debate-oo'
  },
  {
    id: 'MG',
    name: 'MG',
    fullName: 'Member of Government',
    teamPosition: 'CG',
    description: 'First Closing Government speaker who brings a new perspective.',
    order: 5,
    teamColor: 'bg-debate-cg'
  },
  {
    id: 'GW',
    name: 'GW',
    fullName: 'Government Whip',
    teamPosition: 'CG',
    description: 'Final Government speaker who summarizes the case.',
    order: 7,
    teamColor: 'bg-debate-cg'
  },
  {
    id: 'MO',
    name: 'MO',
    fullName: 'Member of Opposition',
    teamPosition: 'CO',
    description: 'First Closing Opposition speaker who brings new opposition angles.',
    order: 6,
    teamColor: 'bg-debate-co'
  },
  {
    id: 'OW',
    name: 'OW',
    fullName: 'Opposition Whip',
    teamPosition: 'CO',
    description: 'Final Opposition speaker who concludes the debate.',
    order: 8,
    teamColor: 'bg-debate-co'
  }
];

// Group roles by team position
export const teamPositions: Record<TeamPosition, string> = {
  'OG': 'Opening Government',
  'OO': 'Opening Opposition',
  'CG': 'Closing Government',
  'CO': 'Closing Opposition'
};

// Define content for each role and stage
export const roleContent: Record<DebateRole, RoleStageContent> = {
  // Prime Minister Content
  'PM': {
    prep: {
      title: 'Preparation',
      description: 'As Prime Minister, you are responsible for setting up the entire debate. Use these 15 minutes to build your case.',
      instructions: [
        'Define the problem clearly',
        'Build a logical mechanism to solve it',
        'Identify values that support your proposal',
        'Set a clear frame and define key terms'
      ],
      questions: [
        'What is the current problem with the status quo?',
        'What specific action does your proposal involve?',
        'Who will be responsible for implementation?',
        'Why is this solution better than alternatives?',
        'What key terms need definition in this debate?'
      ],
      tips: [
        'Be very clear about your mechanism - who does what, when, and how',
        'Anticipate opposition arguments',
        'Prepare strong examples to illustrate your points',
        'Make sure your arguments align with your team values'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'You will be the first speaker, but pay close attention to the opposition responses to help your Deputy.',
      instructions: [
        'Note how the opposition frames their case',
        'Identify their main objections to your mechanism',
        'Listen for mischaracterizations of your arguments',
        'Look for logical flaws in their counterarguments'
      ],
      questions: [
        'How is the opposition trying to reframe the debate?',
        'What aspects of your mechanism are they attacking?',
        'Are they misrepresenting any part of your case?',
        'What new arguments are they introducing?'
      ],
      tips: [
        'Pass notes to your deputy about important opposition points',
        'Identify the strongest opposition arguments for rebuttal',
        'Look for areas where your case needs reinforcement',
        'Note any opportunities for your team to clarify'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your 7-minute speech sets the foundation for the entire debate.',
      instructions: [
        'Start with a strong introduction',
        'Present your framing and definitions clearly',
        'Explain your mechanism in detail',
        'Present 2-3 main arguments supporting your case'
      ],
      questions: [
        'How will you hook the audience in the first 30 seconds?',
        'What exact policy or change are you proposing?',
        'What are your strongest arguments in favor?',
        'How will you conclude effectively?'
      ],
      tips: [
        'Speak clearly and confidently',
        'Use signposting ("First, Second, Finally")',
        'Make eye contact with adjudicators',
        'Use examples to illustrate abstract points'
      ],
      templateSections: [
        {
          name: 'Introduction',
          duration: '30 sec',
          description: 'Hook the audience, state the motion, and preview your approach.'
        },
        {
          name: 'Framing and Definitions',
          duration: '1 min',
          description: 'Define key terms and establish the debate framework.'
        },
        {
          name: 'Proposal and Mechanism',
          duration: '1 min',
          description: 'Explain your solution clearly, including implementation details.'
        },
        {
          name: 'Argument 1',
          duration: '1.5 min',
          description: 'Present your strongest supporting argument with examples.'
        },
        {
          name: 'Argument 2',
          duration: '1.5 min',
          description: 'Present your second main argument with evidence.'
        },
        {
          name: 'Optional Argument 3',
          duration: '1 min',
          description: 'Include a third argument if time allows.'
        },
        {
          name: 'Conclusion',
          duration: '30 sec',
          description: 'Summarize your case and emphasize key benefits.'
        }
      ]
    }
  },
  
  // Deputy Prime Minister Content
  'DPM': {
    prep: {
      title: 'Preparation',
      description: 'As Deputy Prime Minister, you extend and strengthen the Opening Government case.',
      instructions: [
        'Review the PM\'s plan and identify potential weaknesses',
        'Develop 2-3 extensions or deeper analysis',
        'Prepare rebuttals to anticipated opposition arguments',
        'Plan examples that strengthen your overall case'
      ],
      questions: [
        'What aspects of our case need deeper explanation?',
        'What additional stakeholder perspectives should we address?',
        'Which likely opposition arguments need preemptive rebuttals?',
        'What examples will best illustrate our arguments?'
      ],
      tips: [
        'Coordinate closely with your PM',
        'Don\'t completely duplicate the PM\'s arguments',
        'Focus on depth rather than introducing too many new ideas',
        'Prepare strong rebuttals to anticipated opposition points'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Pay close attention to both the PM and LO speeches to prepare effective responses.',
      instructions: [
        'Note all attacks from LO',
        'Identify any framing changes or new assumptions',
        'Look for areas where the PM\'s case needs defense',
        'Listen for opportunities to clarify misunderstandings'
      ],
      questions: [
        'What are the main criticisms of our mechanism?',
        'Is the opposition trying to reframe key terms?',
        'What logical fallacies appear in the opposition arguments?',
        'Which of our arguments did they fail to address?'
      ],
      tips: [
        'Take organized notes by argument type',
        'Focus on substance over style',
        'Identify the strongest opposition points to address',
        'Look for inconsistencies in their arguments'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech should rebut opposition attacks while extending the government case.',
      instructions: [
        'Respond to key opposition arguments',
        'Reinforce the PM\'s framing and mechanism',
        'Introduce your extensions and deeper analysis',
        'Summarize the government case so far'
      ],
      questions: [
        'Which opposition points most threaten your case?',
        'What aspects of your mechanism need clarification?',
        'What new examples or analysis can you provide?',
        'How will you show consistency with the PM\'s case?'
      ],
      tips: [
        'Start with strong rebuttals',
        'Use clear signposting',
        'Don\'t spend too much time repeating the PM\'s arguments',
        'Build upon, don\'t contradict the PM'
      ],
      templateSections: [
        {
          name: 'Rebuttals to LO',
          duration: '1.5 min',
          description: 'Address the strongest opposition arguments.'
        },
        {
          name: 'Reinforce PM\'s Frame',
          duration: '1 min',
          description: 'Reestablish key definitions and framing.'
        },
        {
          name: 'Extensions & Examples',
          duration: '2.5 min',
          description: 'Provide deeper analysis and additional supporting evidence.'
        },
        {
          name: 'Summary',
          duration: '1 min',
          description: 'Consolidate the government case and preview what\'s next.'
        }
      ]
    }
  },
  
  // Leader of Opposition Content
  'LO': {
    prep: {
      title: 'Preparation',
      description: 'As Leader of Opposition, you establish the foundation of the opposition case.',
      instructions: [
        'List likely assumptions made by the Government',
        'Construct a counter-framing or alternative worldview',
        'Prepare direct attacks on likely government arguments',
        'Develop your own alternative arguments'
      ],
      questions: [
        'What problematic assumptions might the Government make?',
        'How can you reframe key terms or the debate scope?',
        'What are the strongest arguments against the likely government position?',
        'What values or principles support your opposition?'
      ],
      tips: [
        'Prepare multiple possible frames depending on the PM\'s approach',
        'Think beyond obvious objections',
        'Consider stakeholder perspectives the Government might ignore',
        'Develop a coherent counter-narrative, not just criticisms'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Listen carefully to the PM\'s speech to identify weaknesses and opportunities.',
      instructions: [
        'Find logical gaps in the Government case',
        'Note oversimplifications or exaggerations',
        'Identify stakeholders or perspectives they\'ve ignored',
        'Look for unclear mechanisms or implementation details'
      ],
      questions: [
        'What key assumptions is the Government making?',
        'Where is their mechanism vague or problematic?',
        'What negative consequences have they overlooked?',
        'What stakeholders would be harmed by their proposal?'
      ],
      tips: [
        'Don\'t just react to everything - focus on key weaknesses',
        'Be ready to adjust your prepared approach',
        'Note both content flaws and framing opportunities',
        'Look for contradictions within their arguments'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech establishes the Opposition\'s position and challenges the Government case.',
      instructions: [
        'Introduce your counter-framing',
        'Directly attack Government arguments',
        'Present your alternative arguments',
        'Compare the Government and Opposition approaches'
      ],
      questions: [
        'How will you reframe the debate more favorably?',
        'Which Government arguments are most vulnerable?',
        'What alternative perspective will you introduce?',
        'How will you structure your critique?'
      ],
      tips: [
        'Don\'t spend too much time on recap',
        'Attack the strongest Government arguments, not just the weak ones',
        'Use clear signposting',
        'Present a coherent alternative, not just criticisms'
      ],
      templateSections: [
        {
          name: 'Introduction & Frame',
          duration: '1.5 min',
          description: 'Introduce your opposition stance and reframe the debate.'
        },
        {
          name: 'Attack on Government',
          duration: '2 min',
          description: 'Directly challenge the mechanism and arguments presented.'
        },
        {
          name: 'Alternative Arguments',
          duration: '2 min',
          description: 'Present your counter-case and supporting evidence.'
        },
        {
          name: 'Summary Comparison',
          duration: '1.5 min',
          description: 'Compare approaches and explain why yours is superior.'
        }
      ]
    }
  },
  
  // Deputy Leader of Opposition Content
  'DLO': {
    prep: {
      title: 'Preparation',
      description: 'As Deputy Leader of Opposition, you deepen the opposition case with new analysis.',
      instructions: [
        'Collaborate with LO to identify areas needing deeper analysis',
        'Prepare institutional analysis and stakeholder impacts',
        'Develop strong rebuttals to likely government extensions',
        'Plan examples that strengthen your opposition case'
      ],
      questions: [
        'What aspects of the opposition case need reinforcement?',
        'What institutional factors undermine the government proposal?',
        'Which stakeholders deserve more detailed consideration?',
        'What incentive problems might arise in the government\'s plan?'
      ],
      tips: [
        'Coordinate with your LO to avoid redundancy',
        'Focus on depth rather than breadth',
        'Develop examples to illustrate abstract points',
        'Prepare to address the strongest government arguments'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Pay close attention to both government speakers to identify new angles and inconsistencies.',
      instructions: [
        'Note new points raised by the DPM',
        'Identify inconsistencies between PM and DPM',
        'Look for areas where the LO\'s arguments need reinforcement',
        'Listen for new government claims requiring rebuttal'
      ],
      questions: [
        'What new arguments has the DPM introduced?',
        'Are there contradictions in the government case?',
        'Which opposition arguments were inadequately addressed?',
        'What new examples or evidence did the government present?'
      ],
      tips: [
        'Focus on substance over style',
        'Note both content and strategic opportunities',
        'Organize notes by argument type',
        'Look for shifts in the government\'s position'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech should rebut the DPM while extending the opposition case with deeper analysis.',
      instructions: [
        'Respond to the DPM\'s arguments and extensions',
        'Extend the LO\'s arguments with deeper analysis',
        'Introduce new insights or examples',
        'Reframe the debate in the opposition\'s favor'
      ],
      questions: [
        'Which DPM points most require rebuttal?',
        'What deeper institutional or stakeholder analysis can you provide?',
        'What new examples would strengthen your case?',
        'How will you maintain consistency with the LO?'
      ],
      tips: [
        'Start with effective rebuttals to the DPM',
        'Use clear signposting',
        'Don\'t just repeat the LO\'s points - deepen them',
        'Make sure your examples illustrate clear principles'
      ],
      templateSections: [
        {
          name: 'Rebuttal to DPM',
          duration: '1.5 min',
          description: 'Address the DPM\'s extensions and defenses.'
        },
        {
          name: 'Extension of LO Arguments',
          duration: '2 min',
          description: 'Deepen your team\'s case with more analysis.'
        },
        {
          name: 'New Insights & Examples',
          duration: '2 min',
          description: 'Introduce additional perspectives and evidence.'
        },
        {
          name: 'Case Framing',
          duration: '1.5 min',
          description: 'Reframe the entire debate in your team\'s favor.'
        }
      ]
    }
  },
  
  // Member of Government Content
  'MG': {
    prep: {
      title: 'Preparation',
      description: 'As Member of Government, you must introduce a new angle (extension) to the debate.',
      instructions: [
        'Identify what hasn\'t been said yet by Opening Government',
        'Create a significant new angle or extension',
        'Consider moral, emotional, or psychological perspectives',
        'Prepare to establish your place in the debate'
      ],
      questions: [
        'What important aspect of the issue remains unexplored?',
        'What stakeholders haven\'t been properly considered?',
        'What longer-term impacts deserve analysis?',
        'How can you extend the debate without contradicting OG?'
      ],
      tips: [
        'Your extension should be substantial, not just a new argument',
        'Consider power dynamics, cultural impacts, or moral dimensions',
        'Plan a clear explanation of how your extension relates to OG\'s case',
        'Prepare responses to OO\'s likely objections to your extension'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Listen to all four opening half speakers to identify unaddressed arguments and opportunities.',
      instructions: [
        'Assess which arguments are not yet addressed',
        'Note how the debate has evolved from the original framing',
        'Identify gaps in analysis that your extension could fill',
        'Look for opportunities to strengthen the government case'
      ],
      questions: [
        'What important perspectives are missing from the debate?',
        'How has the opposition framed their case, and what does it miss?',
        'What aspects of the government case need reinforcement?',
        'How can your extension address opposition criticisms?'
      ],
      tips: [
        'Focus on finding the extension opportunity, not just rebuttal points',
        'Note both substantive arguments and strategic opportunities',
        'Identify patterns in the debate that reveal gaps',
        'Consider how your extension relates to the core clash'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech introduces a significant new angle while supporting the government case.',
      instructions: [
        'Briefly summarize the debate so far',
        'Introduce your new extension clearly',
        'Develop it with examples and analysis',
        'Connect it back to the overall government case'
      ],
      questions: [
        'How will you frame your extension as crucial to the debate?',
        'What examples best illustrate your new perspective?',
        'How does your extension strengthen the government case?',
        'Which opposition arguments does your extension help counter?'
      ],
      tips: [
        'Be clear about what\'s new in your extension',
        'Don\'t spend too much time on recap or rebuttal',
        'Use clear signposting and structure',
        'Explain why your extension matters to the debate'
      ],
      templateSections: [
        {
          name: 'Debate Summary',
          duration: '30 sec',
          description: 'Briefly outline the debate progression so far.'
        },
        {
          name: 'Extension Introduction',
          duration: '1.5 min',
          description: 'Present your new angle and its importance.'
        },
        {
          name: 'Extension Development',
          duration: '2 min',
          description: 'Provide detailed analysis and examples for your extension.'
        },
        {
          name: 'Opposition Rebuttals',
          duration: '2 min',
          description: 'Address key opposition arguments, especially against OO.'
        },
        {
          name: 'Final Impact',
          duration: '1 min',
          description: 'Connect your extension to the broader government case.'
        }
      ]
    }
  },
  
  // Government Whip Content
  'GW': {
    prep: {
      title: 'Preparation',
      description: 'As Government Whip, you\'ll close the government case and provide the final summary.',
      instructions: [
        'Align with MG on your extension strategy',
        'Prepare templates for debate-wide comparison',
        'Develop a cohesive narrative connecting both government teams',
        'Plan effective rebuttals to opposition arguments'
      ],
      questions: [
        'How will you create a unified government narrative?',
        'What themes connect all government speeches?',
        'Which opposition arguments most need rebuttal?',
        'How will you weigh the comparative impact of all teams?'
      ],
      tips: [
        'Focus on summarizing and comparing, not introducing new material',
        'Develop a framework for evaluating the debate',
        'Prepare to highlight contradictions within opposition teams',
        'Plan how to emphasize the government\'s strongest points'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Listen to all speakers to identify contradictions and build a cohesive government narrative.',
      instructions: [
        'Identify contradictions across all teams',
        'Note how the MG extension is received',
        'Watch for new arguments from MO',
        'Look for opportunities to create a unified government story'
      ],
      questions: [
        'What are the key clashes across all four teams?',
        'How can you characterize the opposition\'s approach?',
        'What principles have emerged as central to the debate?',
        'What contradictions exist within the opposition teams?'
      ],
      tips: [
        'Take notes organized by theme rather than by speaker',
        'Focus on substantive clashes, not just individual arguments',
        'Look for patterns that help frame the government\'s advantage',
        'Note examples that can illustrate broader principles'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech provides the final summary and comparative analysis of the debate.',
      instructions: [
        'Reframe the debate\'s key issues',
        'Refute Opposition teams\' arguments',
        'Reinforce the MG\'s extension',
        'Compare all teams\' contributions',
        'Provide a compelling final summary'
      ],
      questions: [
        'What framework best evaluates the teams\' contributions?',
        'How will you characterize the clash of principles?',
        'Which opposition arguments most need final rebuttal?',
        'How does the government team provide a superior approach?'
      ],
      tips: [
        'Don\'t introduce new arguments',
        'Use clear comparative analysis',
        'Be fair but strategic in your characterizations',
        'End with a strong, value-based conclusion'
      ],
      templateSections: [
        {
          name: 'Debate Reframing',
          duration: '1 min',
          description: 'Present a framework for evaluating the debate.'
        },
        {
          name: 'Opposition Refutation',
          duration: '2 min',
          description: 'Address key arguments from both opposition teams.'
        },
        {
          name: 'MG Extension Support',
          duration: '1.5 min',
          description: 'Reinforce and develop your teammate\'s extension.'
        },
        {
          name: 'Team Comparison',
          duration: '2 min',
          description: 'Compare all teams\' contributions and approaches.'
        },
        {
          name: 'Final Summary',
          duration: '30 sec',
          description: 'Provide a compelling conclusion to the government case.'
        }
      ]
    }
  },
  
  // Member of Opposition Content
  'MO': {
    prep: {
      title: 'Preparation',
      description: 'As Member of Opposition, you introduce a new extension to strengthen the opposition case.',
      instructions: [
        'Identify what Opening Opposition didn\'t address',
        'Build a radically different perspective',
        'Consider cultural, emotional, or moral dimensions',
        'Prepare responses to the Closing Government extension'
      ],
      questions: [
        'What crucial dimension of the debate has been overlooked?',
        'What stakeholders or impacts haven\'t been properly analyzed?',
        'How can you create a substantial extension that doesn\'t contradict OO?',
        'What principles support your extension?'
      ],
      tips: [
        'Your extension should be significant, not just a new argument',
        'Link your extension to the broader opposition case',
        'Prepare to explain why your extension matters',
        'Consider unintended consequences or implementation problems'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Listen to all previous speakers, focusing on the Closing Government extension.',
      instructions: [
        'Watch for repetition or weak arguments from Closing Government',
        'Note how the MG extension relates to Opening Government',
        'Identify gaps or contradictions in the government case',
        'Look for opportunities to create your own distinctive extension'
      ],
      questions: [
        'How substantial is the Closing Government extension?',
        'What aspects of the debate remain unexplored?',
        'How has the clash evolved throughout the debate?',
        'What weaknesses in the government case need highlighting?'
      ],
      tips: [
        'Focus on the substantive clash, not just individual arguments',
        'Look for patterns across all speeches',
        'Identify the principles at stake in the debate',
        'Note opportunities to introduce a new perspective'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech introduces a new opposition extension while responding to Closing Government.',
      instructions: [
        'Introduce your distinctive extension',
        'Develop it with analysis and examples',
        'Refute the Closing Government extension',
        'Frame the debate in the opposition\'s favor'
      ],
      questions: [
        'How will you position your extension as crucial?',
        'What examples best illustrate your new angle?',
        'How does your extension undermine the government\'s case?',
        'What flaws in the Closing Government extension will you highlight?'
      ],
      tips: [
        'Be clear about what\'s new in your extension',
        'Don\'t spend too much time on recap',
        'Use clear signposting',
        'Balance extending and rebutting'
      ],
      templateSections: [
        {
          name: 'Extension Introduction',
          duration: '1.5 min',
          description: 'Present your new angle and its importance.'
        },
        {
          name: 'Extension Development',
          duration: '2 min',
          description: 'Provide detailed analysis and examples for your extension.'
        },
        {
          name: 'CG Refutation',
          duration: '1.5 min',
          description: 'Address the Closing Government\'s extension and arguments.'
        },
        {
          name: 'Debate Framing',
          duration: '2 min',
          description: 'Reframe the debate in the opposition\'s favor.'
        }
      ]
    }
  },
  
  // Opposition Whip Content
  'OW': {
    prep: {
      title: 'Preparation',
      description: 'As Opposition Whip, you\'ll create the final narrative of the debate from the opposition perspective.',
      instructions: [
        'Collaborate with MO on extension strategy',
        'Craft a final narrative or "indictment" of the government case',
        'Prepare templates for comparative analysis',
        'Plan how to unify the opposition case'
      ],
      questions: [
        'What key themes unify the opposition case?',
        'How will you summarize the debate\'s progression?',
        'What framework best evaluates the teams\' contributions?',
        'Which government arguments are most vulnerable to final critique?'
      ],
      tips: [
        'Focus on summarizing and weighing, not new material',
        'Develop a framework for judging the debate',
        'Prepare to highlight contradictions within government teams',
        'Plan how to emphasize the opposition\'s strongest points'
      ]
    },
    listening: {
      title: 'Listening',
      description: 'Listen to all speakers and note key arguments to build a final hierarchy of importance.',
      instructions: [
        'Identify the strongest arguments across all teams',
        'Note how the MO extension is received',
        'Look for contradictions within government teams',
        'Track the evolution of the debate\'s central clash'
      ],
      questions: [
        'What frameworks have been proposed for evaluating the motion?',
        'How have principles evolved throughout the debate?',
        'What patterns emerge across all speeches?',
        'Which clashes have been most central to the debate?'
      ],
      tips: [
        'Organize notes thematically rather than by speaker',
        'Focus on substantive clashes',
        'Look for opportunities to characterize the debate favorably',
        'Note examples that illustrate broader principles'
      ]
    },
    speech: {
      title: 'Speech',
      description: 'Your speech provides the final summary of the debate from the opposition perspective.',
      instructions: [
        'Reframe the debate\'s central issues',
        'Highlight your team\'s unique contribution',
        'Refute Closing Government\'s case',
        'Weigh all teams\' arguments',
        'Close with a compelling value-based conclusion'
      ],
      questions: [
        'What framework best evaluates the teams\' contributions?',
        'How will you characterize the government\'s failure?',
        'Which principles should prevail in judging the debate?',
        'How does the opposition offer a superior approach?'
      ],
      tips: [
        'Don\'t introduce new arguments',
        'Use clear comparative analysis',
        'Be fair but strategic in your characterizations',
        'End with a strong, value-based conclusion'
      ],
      templateSections: [
        {
          name: 'Debate Reframing',
          duration: '1 min',
          description: 'Present a framework for evaluating the debate.'
        },
        {
          name: 'CO Contribution',
          duration: '2 min',
          description: 'Highlight your team\'s unique extension and approach.'
        },
        {
          name: 'CG Refutation',
          duration: '1.5 min',
          description: 'Address key arguments from Closing Government.'
        },
        {
          name: 'Team Comparison',
          duration: '2 min',
          description: 'Compare all teams\' contributions and approaches.'
        },
        {
          name: 'Value Conclusion',
          duration: '30 sec',
          description: 'Provide a compelling conclusion based on principles.'
        }
      ]
    }
  }
};
