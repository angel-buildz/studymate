// StudyMate Practice Quiz Database and Generator Service

const quizDatabase = {
  chemistry: {
    easy: [
      {
        question: "What is the chemical symbol for the element Gold?",
        options: ["Ag", "Au", "Gd", "Fe"],
        correct: 1,
        explanation: "Au comes from the Latin word 'aurum', meaning shining dawn, which designates Gold on the periodic table. Ag is Silver, Fe is Iron."
      },
      {
        question: "Which state of matter has a definite volume but takes the shape of its container?",
        options: ["Gas", "Solid", "Liquid", "Plasma"],
        correct: 2,
        explanation: "Liquids have fixed volumes but adapt their shape to whatever container they occupy. Solids have definite shape/volume, while gases fill the container entirely."
      },
      {
        question: "What is the center of an atom called?",
        options: ["Electron", "Proton", "Neutron", "Nucleus"],
        correct: 3,
        explanation: "The nucleus is the small, dense region consisting of protons and neutrons at the center of an atom."
      },
      {
        question: "Which of the following has a neutral electrical charge?",
        options: ["Electron", "Neutron", "Proton", "Ion"],
        correct: 1,
        explanation: "Neutrons carry a neutral (zero) charge. Protons are positive, electrons are negative, and ions have net electric charges."
      },
      {
        question: "What is the pH level of pure water at room temperature?",
        options: ["1", "5", "7", "14"],
        correct: 2,
        explanation: "Pure water is neutral and has a pH of 7. Values below 7 are acidic, and values above 7 are basic."
      }
    ],
    medium: [
      {
        question: "Boyle's Law describes the relationship between which two properties of a gas?",
        options: ["Temperature and Volume", "Pressure and Volume", "Pressure and Temperature", "Mass and Volume"],
        correct: 1,
        explanation: "Boyle's Law states that at constant temperature, the pressure (P) and volume (V) of an ideal gas are inversely proportional (P1V1 = P2V2)."
      },
      {
        question: "What is the name of the reaction that releases heat energy into its surroundings?",
        options: ["Endothermic", "Exothermic", "Isothermal", "Adiabatic"],
        correct: 1,
        explanation: "Exothermic reactions release energy (usually heat or light) into the surroundings, whereas endothermic reactions absorb heat."
      },
      {
        question: "Which type of chemical bond involves the sharing of electron pairs between atoms?",
        options: ["Ionic Bond", "Covalent Bond", "Hydrogen Bond", "Metallic Bond"],
        correct: 1,
        explanation: "Covalent bonding involves the sharing of electrons to stabilize outer electron shells, while ionic bonds involve the complete transfer of electrons."
      },
      {
        question: "What is the molecular weight of carbon dioxide (CO2)? (C = 12g/mol, O = 16g/mol)",
        options: ["28 g/mol", "32 g/mol", "44 g/mol", "56 g/mol"],
        correct: 2,
        explanation: "Molecular weight = Carbon (12) + 2 * Oxygen (16) = 12 + 32 = 44 g/mol."
      },
      {
        question: "Which element is considered the 'universal backbone' of organic molecules?",
        options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"],
        correct: 3,
        explanation: "Carbon's ability to form four stable covalent bonds allows it to build complex, stable chains and rings, forming the basis of organic chemistry."
      }
    ],
    hard: [
      {
        question: "Which thermodynamic law states that the entropy of a perfect crystal at absolute zero is exactly equal to zero?",
        options: ["Zeroth Law", "First Law", "Second Law", "Third Law"],
        correct: 3,
        explanation: "The Third Law of Thermodynamics establishes that the entropy of a system approaches a constant value (zero) as its temperature approaches absolute zero."
      },
      {
        question: "What is the hybridization state of the carbon atoms in a molecule of benzene (C6H6)?",
        options: ["sp", "sp2", "sp3", "dsp2"],
        correct: 1,
        explanation: "Each carbon in benzene forms three sigma bonds and shares one pi bond in a delocalized ring, which results in sp2 planar trigonal hybridization."
      },
      {
        question: "In a buffer solution consisting of a weak acid (HA) and its conjugate base (A-), what is the Henderson-Hasselbalch equation?",
        options: ["pH = pKa + log([HA]/[A-])", "pH = pKa - log([HA]/[A-])", "pH = pKa + log([A-]/[HA])", "pH = pKa - log([A-]/[HA])"],
        correct: 2,
        explanation: "The Henderson-Hasselbalch equation is pH = pKa + log([conjugate base]/[acid]), which is pH = pKa + log([A-]/[HA])."
      },
      {
        question: "Which of the following represents a zero-order reaction rate law?",
        options: ["Rate = k", "Rate = k[A]", "Rate = k[A]^2", "Rate = k[A][B]"],
        correct: 0,
        explanation: "For zero-order reactions, the reaction rate is completely independent of the concentration of reactants, yielding: Rate = k."
      },
      {
        question: "Which d-orbital shape differs significantly from the other four by having a doughnut-shaped ring (torus) around its center?",
        options: ["dxy", "dx2-y2", "dz2", "dxz"],
        correct: 2,
        explanation: "The dz2 orbital consists of a dumbbell along the z-axis and a doughnut-shaped collar (torus) in the xy plane."
      }
    ]
  },
  history: {
    easy: [
      {
        question: "In which year did the French Revolution begin?",
        options: ["1776", "1789", "1804", "1815"],
        correct: 1,
        explanation: "The French Revolution began in 1789 with the storming of the Bastille and the assembly of the Estates-General."
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "Abraham Lincoln", "Benjamin Franklin", "George Washington"],
        correct: 3,
        explanation: "George Washington served as the first president of the United States from 1789 to 1797 after leading the Continental Army."
      },
      {
        question: "Which ancient civilization constructed the Great Pyramids of Giza?",
        options: ["Ancient Greeks", "Ancient Romans", "Ancient Egyptians", "Mesopotamians"],
        correct: 2,
        explanation: "The Great Pyramids were built as tombs for Old Kingdom pharaohs in ancient Egypt around 2500 BC."
      },
      {
        question: "What event triggered the official entry of the United States into World War II?",
        options: ["The sinking of the Lusitania", "The bombing of Pearl Harbor", "The invasion of Poland", "The Battle of Britain"],
        correct: 1,
        explanation: "The Japanese surprise attack on Pearl Harbor naval base in Hawaii on December 7, 1941, prompted the US to declare war the following day."
      },
      {
        question: "Which system of governance was famously invented and practiced in ancient Athens?",
        options: ["Monarchy", "Democracy", "Oligarchy", "Feudalism"],
        correct: 1,
        explanation: "Cleisthenes established the democratic system of direct public vote in Athens in 508 BC, forming the foundation of modern democracies."
      }
    ],
    medium: [
      {
        question: "The signing of the Magna Carta in 1215 primary accomplished what political outcome?",
        options: ["Abolished the English monarchy", "Limited the absolute power of the King", "Granted freedom to all serfs", "Created the Church of England"],
        correct: 1,
        explanation: "King John signed the Magna Carta to appease rebellious barons. It established the principle that everyone, including the monarch, is subject to the law."
      },
      {
        question: "Who is widely credited with inventing the modern steam engine, catalyzing the Industrial Revolution?",
        options: ["James Watt", "Robert Fulton", "George Stephenson", "Eli Whitney"],
        correct: 0,
        explanation: "James Watt patented improvements to the Newcomen steam engine in 1769, producing a rotary motion engine that powered factories and trains."
      },
      {
        question: "Which document, written in 1780, is the world's oldest written constitution still in active use?",
        options: ["United States Constitution", "Constitution of Massachusetts", "Magna Carta", "French Constitution of 1791"],
        correct: 1,
        explanation: "The Massachusetts State Constitution, drafted by John Adams, was ratified in 1780 and remains in active use, predating the US Constitution (1789)."
      },
      {
        question: "Which major war was fought between the Russian Empire and an alliance of Britain, France, and the Ottoman Empire in the 1850s?",
        options: ["Napoleonic Wars", "Crimean War", "Balkan War", "Franco-Prussian War"],
        correct: 1,
        explanation: "The Crimean War (1853-1856) was fought mainly on the Crimean Peninsula and is famous for the Charge of the Light Brigade and Florence Nightingale's nursing work."
      },
      {
        question: "Who was the primary author of the Declaration of Independence in 1776?",
        options: ["John Adams", "Benjamin Franklin", "Thomas Jefferson", "Alexander Hamilton"],
        correct: 2,
        explanation: "Thomas Jefferson was chosen by the Committee of Five to draft the document, articulating individual rights and national independence."
      }
    ],
    hard: [
      {
        question: "Which treaty, signed in 1919, officially concluded World War I and imposed strict economic reparations on Germany?",
        options: ["Treaty of Ghent", "Treaty of Utrecht", "Treaty of Versailles", "Treaty of Westphalia"],
        correct: 2,
        explanation: "The Treaty of Versailles placed full moral and financial blame for WWI on Germany (Article 231, 'War Guilt Clause'), setting the stage for future conflict."
      },
      {
        question: "During the 1962 Cuban Missile Crisis, who was the Premier of the Soviet Union?",
        options: ["Joseph Stalin", "Nikita Khrushchev", "Leonid Brezhnev", "Mikhail Gorbachev"],
        correct: 1,
        explanation: "Nikita Khrushchev was the leader of the USSR who agreed with President John F. Kennedy to dismantle Soviet launch sites in Cuba in exchange for US missile removal in Turkey."
      },
      {
        question: "What was the name of the 1648 treaties that ended the Thirty Years' War and established the framework for modern sovereign nation-states?",
        options: ["Peace of Westphalia", "Treaty of Utrecht", "Peace of Augsburg", "Edict of Nantes"],
        correct: 0,
        explanation: "The Peace of Westphalia established 'Westphalian sovereignty', the principle of international law that each state has exclusive sovereignty over its territory."
      },
      {
        question: "Which Roman Emperor famously divided the administration of the Roman Empire into Western and Eastern halves in 285 AD?",
        options: ["Constantine", "Marcus Aurelius", "Diocletian", "Augustus"],
        correct: 2,
        explanation: "Diocletian established the Tetrarchy (rule of four) to stabilize the massive empire, dividing it into Western and Eastern administrative districts."
      },
      {
        question: "In what year did the Fall of Constantinople take place, ending the Byzantine Empire?",
        options: ["1066 AD", "1204 AD", "1453 AD", "1517 AD"],
        correct: 2,
        explanation: "Constantinople was captured by the Ottoman army under Sultan Mehmed II in 1453 AD, signaling the end of the Middle Ages and the Roman Empire lineage."
      }
    ]
  },
  math: {
    easy: [
      {
        question: "What is the derivative of the function f(x) = x^3 with respect to x?",
        options: ["3x", "x^2", "3x^2", "3x^3"],
        correct: 2,
        explanation: "By the Power Rule of calculus, the derivative of x^n is n * x^(n-1). Therefore, the derivative of x^3 is 3 * x^(3-1) = 3x^2."
      },
      {
        question: "What is the slope of a line that is parallel to the line y = 4x - 5?",
        options: ["-5", "-1/4", "4", "5"],
        correct: 2,
        explanation: "Parallel lines have identical slopes. The slope of y = 4x - 5 is 4, so any parallel line also has a slope of 4."
      },
      {
        question: "If a triangle has a base of 8 cm and a height of 5 cm, what is its area?",
        options: ["13 cm²", "20 cm²", "40 cm²", "80 cm²"],
        correct: 1,
        explanation: "Area of a triangle = (base * height) / 2 = (8 * 5) / 2 = 40 / 2 = 20 cm²."
      },
      {
        question: "Which of the following numbers is prime?",
        options: ["1", "4", "9", "17"],
        correct: 3,
        explanation: "A prime number is a whole number greater than 1 whose only divisors are 1 and itself. 17 has no other divisors; 4 (2*2) and 9 (3*3) are composite."
      },
      {
        question: "What is the value of log10(1000)?",
        options: ["1", "2", "3", "10"],
        correct: 2,
        explanation: "log10(1000) represents the exponent to which 10 must be raised to equal 1000. Since 10^3 = 1000, the answer is 3."
      }
    ],
    medium: [
      {
        question: "What is the derivative of f(x) = ln(x^2 + 1)?",
        options: ["1 / (x^2 + 1)", "2x / (x^2 + 1)", "x / (x^2 + 1)", "2x(x^2 + 1)"],
        correct: 1,
        explanation: "By the Chain Rule, the derivative of ln(u) is u' / u. The derivative of u = (x^2 + 1) is 2x. Thus, f'(x) = 2x / (x^2 + 1)."
      },
      {
        question: "What is the indefinite integral ∫ (3x^2 - 4x) dx?",
        options: ["x^3 - 2x^2 + C", "3x^3 - 4x^2 + C", "x^3 - 4x^2 + C", "6x - 4 + C"],
        correct: 0,
        explanation: "Integrating term-by-term: ∫ 3x^2 dx = x^3 and ∫ -4x dx = -2x^2. Adding the constant of integration yields x^3 - 2x^2 + C."
      },
      {
        question: "Which rule is used to find the derivative of the product of two functions u(x) and v(x)?",
        options: ["Chain Rule", "Quotient Rule", "Product Rule", "L'Hopital's Rule"],
        correct: 2,
        explanation: "The Product Rule states that d/dx[u * v] = u'v + uv'."
      },
      {
        question: "If a fair six-sided die is rolled twice, what is the probability of rolling a '6' both times?",
        options: ["1/6", "1/12", "1/36", "1/64"],
        correct: 2,
        explanation: "The probability of rolling a 6 on one roll is 1/6. Since the rolls are independent events, the combined probability is (1/6) * (1/6) = 1/36."
      },
      {
        question: "What is the value of cot(π/4)?",
        options: ["0", "1/2", "1", "√2"],
        correct: 2,
        explanation: "cot(x) = cos(x) / sin(x). At x = π/4 (45 degrees), cos(π/4) and sin(π/4) are both equal to √2/2, so their ratio is 1."
      }
    ],
    hard: [
      {
        question: "Which integration method is derived directly from the Product Rule of differentiation?",
        options: ["Integration by Substitution", "Integration by Parts", "Partial Fraction Decomposition", "Trigonometric Substitution"],
        correct: 1,
        explanation: "Integration by parts is derived by integrating the Product Rule formula, yielding: ∫ u dv = uv - ∫ v du."
      },
      {
        question: "For what values of x does the Taylor series of f(x) = e^x converge?",
        options: ["Only x = 0", "For -1 < x < 1", "For all real x", "For all positive x"],
        correct: 2,
        explanation: "The Taylor series for e^x has an infinite radius of convergence, meaning it converges for all real numbers x (-∞ < x < ∞)."
      },
      {
        question: "In matrix algebra, what is the determinant of a 2x2 matrix with rows [3, 4] and [1, 2]?",
        options: ["2", "5", "6", "10"],
        correct: 0,
        explanation: "Determinant of [a, b; c, d] = ad - bc. For this matrix, det = (3 * 2) - (4 * 1) = 6 - 4 = 2."
      },
      {
        question: "What is the limit as x approaches 0 of sin(x) / x?",
        options: ["0", "1/2", "1", "Does not exist"],
        correct: 2,
        explanation: "This is a fundamental trigonometric limit. Using L'Hopital's Rule, lim (sin(x)/x) = lim (cos(x)/1) = cos(0) = 1."
      },
      {
        question: "Which theorem states that if a function f is continuous on [a,b] and differentiable on (a,b), there exists a point c in (a,b) where f'(c) = (f(b)-f(a))/(b-a)?",
        options: ["Rolle's Theorem", "Intermediate Value Theorem", "Mean Value Theorem", "Extreme Value Theorem"],
        correct: 2,
        explanation: "The Mean Value Theorem states that the instantaneous rate of change (derivative) at some point c equals the average rate of change over the closed interval."
      }
    ]
  }
};

// Fallback Custom Topic Generator
const generateCustomQuestions = (topic) => {
  const t = topic.trim() || 'General Study';
  return [
    {
      question: `Which of the following is considered the primary core concept of ${t}?`,
      options: [`Key foundational structures of ${t}`, `Secondary supporting ideas`, `Unrelated theories`, `Historical anomalies`],
      correct: 0,
      explanation: `Understanding the primary foundation is the vital first step in master-level reviews of ${t}.`
    },
    {
      question: `In professional study circles, how is ${t} typically classified?`,
      options: ["A purely theoretical branch", "A dynamic applied discipline", "An obsolete methodology", "A subset of linguistic arts"],
      correct: 1,
      explanation: `${t} merges structural principles with practical observations, making it an applied study.`
    },
    {
      question: `Which factor is most likely to accelerate progress when researching ${t}?`,
      options: ["Isolating research variables", "Ignoring empirical findings", "Skipping fundamental reviews", "Decreasing study streaks"],
      correct: 0,
      explanation: "Logical variable isolation guarantees consistent results and reduces analytical errors in research."
    },
    {
      question: `What is a common misconception about the study of ${t}?`,
      options: ["That it requires active, consistent recall", "That it can be mastered instantly with zero practice", "That it holds relevance across disciplines", "That it triggers neural learning pathways"],
      correct: 1,
      explanation: `Mastering ${t} requires structured practice, streaks, and active review over time; there are no instant shortcuts.`
    },
    {
      question: `Which StudyMate tool is best combined with ${t} quizzes for comprehensive prep?`,
      options: ["AI Tutor chats for explanation reviews", "Leaving assignments unchecked", "Decreasing HSL color settings", "Clearing all history daily"],
      correct: 0,
      explanation: "Paring quizzes with the AI Tutor personalities helps clarify difficult concepts and locks in the memory."
    }
  ];
};

export const generateQuiz = (subject, difficulty, customTopic) => {
  const sub = subject.toLowerCase();
  const diff = difficulty.toLowerCase();
  
  if (sub === 'custom') {
    return generateCustomQuestions(customTopic || 'Your Topic');
  }
  
  // Return database items or fallback
  if (quizDatabase[sub] && quizDatabase[sub][diff]) {
    return quizDatabase[sub][diff];
  }
  
  return quizDatabase.chemistry.easy; // Final fallback
};
