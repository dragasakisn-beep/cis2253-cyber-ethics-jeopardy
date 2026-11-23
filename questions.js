/* CIS2253 instructor question bank: 6 categories x 5 values */
const QUESTION_BANK = [
  {
    "name": "ETHICAL FOUNDATIONS",
    "qa": [
      [
        "Which ethical approach evaluates outcomes and overall welfare?",
        "Utilitarianism assesses actions primarily by their consequences for overall welfare."
      ],
      [
        "Which approach emphasizes moral duties instead of outcomes?",
        "Deontology emphasizes duties, rules, and respect for rights."
      ],
      [
        "What does virtue ethics emphasize?",
        "The moral character, practical wisdom, and virtues of the person acting."
      ],
      [
        "A company can monitor employees without warning. Analyze using deontology.",
        "Consider duties of honesty, privacy, fairness, and respect for employee autonomy, not merely efficiency."
      ],
      [
        "A patch protects thousands but disrupts critical services. Compare utilitarian and duty-based reasoning.",
        "Utilitarianism weighs net harm and benefit; deontology examines duties to notify and protect affected users."
      ]
    ]
  },
  {
    "name": "PRIVACY & SURVEILLANCE",
    "qa": [
      [
        "What is meaningful informed consent?",
        "A voluntary and sufficiently informed choice about how information will be used."
      ],
      [
        "What is data minimization?",
        "Collecting and retaining only the personal data necessary for a defined purpose."
      ],
      [
        "Why can employee monitoring be ethically problematic?",
        "Power imbalance, privacy, proportionality, transparency, and legitimate purposes."
      ],
      [
        "A school proposes tracking every student's location all day. Identify ethical risks.",
        "Disproportionate surveillance, consent limitations, poor security, retention, and chilling effects."
      ],
      [
        "A hospital wants to retain biometric records forever. Propose safeguards.",
        "Defined purposes, limited retention, access controls, oversight, necessity analysis, and less intrusive alternatives."
      ]
    ]
  },
  {
    "name": "HACKING & RESPONSIBILITY",
    "qa": [
      [
        "What must exist before an authorized penetration test?",
        "Explicit permission and a clearly defined scope."
      ],
      [
        "What is responsible vulnerability disclosure?",
        "Reporting security weaknesses through an appropriate process while minimizing avoidable harm."
      ],
      [
        "You discover exposed patient records. What must you avoid?",
        "Unnecessary access, copying records, public exposure, or exceeding authorization."
      ],
      [
        "Why do good intentions not justify unauthorized hacking?",
        "They do not eliminate privacy, consent, legal, or collateral-harm concerns."
      ],
      [
        "A vendor ignores a serious flaw. What guides disclosure timing?",
        "User risk, exploitability, coordination opportunities, vendor response, and harm minimization."
      ]
    ]
  },
  {
    "name": "AI & DIGITAL ETHICS",
    "qa": [
      [
        "What is algorithmic bias?",
        "Systematically unfair outcomes caused by data, design, deployment, or institutional conditions."
      ],
      [
        "What is accountability in AI decision-making?",
        "Identifiable individuals and organizations take responsibility for oversight and remedies."
      ],
      [
        "Why does high-stakes AI require meaningful human oversight?",
        "To enable contextual judgment, review, appeals, and correction of mistakes."
      ],
      [
        "An AI hiring model rejects candidates from a specific neighborhood. What must be assessed?",
        "Proxy discrimination, outcome disparities, data, validation, and appeals."
      ],
      [
        "A security AI inaccurately labels employees as malicious. Propose an ethical response.",
        "Assess false positives, prevent automatic punishment, provide human review and appeal, and monitor disparate impacts."
      ]
    ]
  },
  {
    "name": "LAW VS. ETHICS",
    "qa": [
      [
        "Does legal always mean ethical?",
        "No. Legal rules are not a complete account of fairness, rights, and harm."
      ],
      [
        "What is a cybersecurity conflict of interest?",
        "An interest that could compromise impartial professional judgment."
      ],
      [
        "Why is regulatory compliance insufficient by itself?",
        "A compliant action may still be deceptive, disproportionate, unfair, or harmful."
      ],
      [
        "A service uses a confusing opt-out button to keep collecting data. Identify the ethical problem.",
        "Manipulative choice architecture compromises meaningful consent and autonomy."
      ],
      [
        "Executives want to conceal a major breach. What must the security officer consider?",
        "Reporting duties, user protection, evidence preservation, truthful communication, and avoiding foreseeable harm."
      ]
    ]
  },
  {
    "name": "ETHICAL DILEMMAS",
    "qa": [
      [
        "A coworker offers their password to finish urgent work. What do you do?",
        "Decline credential sharing and use approved access or escalation."
      ],
      [
        "You find an unprotected customer file. What is your initial response?",
        "Avoid unnecessary access, minimize exposure, and report via authorized channels."
      ],
      [
        "Your manager wants an audit finding hidden. What should you do?",
        "Do not falsify findings; document and escalate appropriately."
      ],
      [
        "A ransomware victim considers paying. Identify two ethical concerns.",
        "Potential recovery for victims versus financing criminals and uncertain restoration."
      ],
      [
        "A hospital must choose between shutting down insecure systems and keeping them operating. Describe a defensible process.",
        "Prioritize patient safety, compare clinical and technical risks, involve clinical leadership, apply downtime plans, document decisions, and reassess."
      ]
    ]
  }
];
