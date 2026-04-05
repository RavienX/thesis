import { useState, useCallback, useRef, useEffect, useMemo } from "react";

// ─── CHAPTER DATA ─────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 0,
    title: "Introduction to Research",
    tag: "Lesson 1",
    icon: "🔬",
    color: "#2563eb",
    colorLight: "#dbeafe",
    subtitle: "Understand the foundations of academic research and the scientific method.",
    estimatedTime: "20 min",
    objectives: [
      "Define research and identify its key characteristics",
      "Distinguish between qualitative and quantitative research",
      "Understand the steps of the scientific method",
      "Identify primary and secondary sources",
    ],
    sections: [
      {
        heading: "What is Research?",
        body: "Research is a systematic process of collecting, analyzing, and interpreting information to increase understanding of a phenomenon. Academic research follows rigorous standards to ensure validity, reliability, and objectivity. It serves as the backbone of knowledge creation across all disciplines.",
        type: "text",
      },
      {
        heading: "Types of Research",
        type: "tabs",
        tabs: [
          { label: "Quantitative", icon: "📊", content: "Quantitative research deals with numbers and measurable data. It tests hypotheses through statistical analysis and aims to produce generalizable results. Common methods include surveys, experiments, and longitudinal studies." },
          { label: "Qualitative", icon: "💬", content: "Qualitative research explores phenomena through non-numerical data such as interviews, observations, and textual analysis. It seeks to understand meaning, context, and human experience in depth." },
          { label: "Mixed Methods", icon: "🔀", content: "Mixed methods research combines both quantitative and qualitative approaches. This triangulation provides a more comprehensive understanding of a research problem by leveraging the strengths of both paradigms." },
        ],
      },
      {
        heading: "The Scientific Method",
        type: "steps",
        steps: [
          { label: "Observation", desc: "Identify a phenomenon or problem worth investigating.", icon: "👁️" },
          { label: "Research Question", desc: "Formulate a clear, focused, and answerable question.", icon: "❓" },
          { label: "Hypothesis", desc: "Propose a testable prediction based on prior knowledge.", icon: "💡" },
          { label: "Data Collection", desc: "Gather evidence using appropriate instruments and methods.", icon: "📋" },
          { label: "Analysis", desc: "Process and interpret the collected data systematically.", icon: "📈" },
          { label: "Conclusion", desc: "Draw evidence-based conclusions and report findings.", icon: "✅" },
        ],
      },
      {
        heading: "Key Terminology",
        type: "flashcards",
        cards: [
          { term: "Variable", def: "Any characteristic, number, or quantity that can be measured or quantified." },
          { term: "Hypothesis", def: "A testable prediction about the relationship between two or more variables." },
          { term: "Validity", def: "The degree to which a study accurately reflects the concept being measured." },
          { term: "Reliability", def: "The consistency of a measure; the ability to produce stable results over time." },
          { term: "Bias", def: "Systematic error introduced into sampling or testing by selecting non-random data." },
        ],
      },
      {
        heading: "Did You Know?",
        type: "highlight",
        text: "The word 'research' comes from the Middle French word 'recerche', meaning 'to go about seeking'. Modern academic research became formalized in the 19th century with the establishment of graduate programs in European universities.",
      },
    ],
    downloads: [
      { name: "Research Types Overview", type: "TXT", size: "2 KB", icon: "📄", content: "LESSON 1: RESEARCH TYPES OVERVIEW\n\nQUANTITATIVE RESEARCH\n- Numerical data collection\n- Statistical analysis\n- Large sample sizes\n- Generalizable results\n\nQUALITATIVE RESEARCH\n- Non-numerical data\n- In-depth exploration\n- Small sample sizes\n- Contextual understanding\n\nMIXED METHODS\n- Combines both approaches\n- Triangulation of data\n- Comprehensive findings", filename: "Research_Types_Overview.txt" },
      { name: "Scientific Method Worksheet", type: "TXT", size: "1 KB", icon: "📝", content: "SCIENTIFIC METHOD WORKSHEET\n\nName: _________________  Date: ________\n\n1. Observation/Problem:\n   ________________________________\n\n2. Research Question:\n   ________________________________\n\n3. Hypothesis:\n   If ____________, then ____________.\n\n4. Materials/Methods:\n   ________________________________\n\n5. Data Collection Table:\n   Trial | Result\n   ------+-------\n     1   |\n     2   |\n     3   |\n\n6. Conclusion:\n   ________________________________", filename: "Scientific_Method_Worksheet.txt" },
    ],
    quiz: [
      { q: "Which research type primarily uses numerical data and statistical analysis?", opts: ["Qualitative", "Quantitative", "Ethnographic", "Narrative"], ans: 1 },
      { q: "What is the correct first step of the scientific method?", opts: ["Form a hypothesis", "Collect data", "Make an observation", "Draw a conclusion"], ans: 2 },
      { q: "Which term refers to the consistency of a measurement instrument?", opts: ["Validity", "Reliability", "Bias", "Variance"], ans: 1 },
      { q: "Mixed methods research combines which two approaches?", opts: ["Primary and secondary sources", "Quantitative and qualitative", "Experimental and descriptive", "Inductive and deductive"], ans: 1 },
    ],
  },
  {
    id: 1,
    title: "Literature Review",
    tag: "Lesson 2",
    icon: "📚",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    subtitle: "Learn how to locate, evaluate, and synthesize academic sources effectively.",
    estimatedTime: "25 min",
    objectives: [
      "Understand the purpose and structure of a literature review",
      "Apply Boolean operators to academic database searches",
      "Evaluate source credibility using the CRAAP test",
      "Synthesize multiple sources into a coherent review",
    ],
    sections: [
      {
        heading: "Purpose of a Literature Review",
        body: "A literature review maps the existing knowledge landscape around your research topic. It demonstrates your familiarity with the field, identifies research gaps, and situates your study within the broader academic conversation. A strong literature review is not merely a summary — it synthesizes, analyzes, and critiques existing work.",
        type: "text",
      },
      {
        heading: "Search Strategy: Boolean Operators",
        type: "interactive-boolean",
      },
      {
        heading: "Evaluating Sources: The CRAAP Test",
        type: "craap",
      },
      {
        heading: "Synthesis vs. Summary",
        type: "comparison",
        left: {
          label: "Summary ✗",
          color: "#dc2626",
          points: [
            "Describes each source separately",
            "Repeats what each author says",
            "No connection between sources",
            "Reads like an annotated bibliography",
          ],
        },
        right: {
          label: "Synthesis ✓",
          color: "#16a34a",
          points: [
            "Groups sources by theme or argument",
            "Shows agreements and contradictions",
            "Connects ideas across multiple sources",
            "Builds toward your research question",
          ],
        },
      },
    ],
    downloads: [
      { name: "CRAAP Test Checklist", type: "TXT", size: "1 KB", icon: "📄", content: "CRAAP TEST EVALUATION CHECKLIST\n\nSource: _________________________\nAuthor: _________________________\n\nCURRENCY\n[ ] Publication date: __________\n[ ] Information is current for the topic\n\nRELEVANCE\n[ ] Answers your research question\n[ ] Appropriate audience level\n\nAUTHORITY\n[ ] Author credentials: __________\n[ ] Peer-reviewed: Yes / No\n\nACCURACY\n[ ] Sources are cited\n[ ] Data can be verified\n\nPURPOSE\n[ ] Objective / Biased\n[ ] Intended purpose: __________\n\nFINAL RATING: ___ / 25", filename: "CRAAP_Test_Checklist.txt" },
      { name: "Literature Matrix Template", type: "TXT", size: "1 KB", icon: "📝", content: "LITERATURE REVIEW MATRIX\n\nSource | Year | Key Argument | Methodology | Findings | Relevance\n-------+------+--------------+-------------+----------+----------\n       |      |              |             |          |\n       |      |              |             |          |\n\nGAPS IDENTIFIED:\n_________________________________\n\nTHEMES ACROSS LITERATURE:\n1. __________\n2. __________\n3. __________", filename: "Literature_Matrix_Template.txt" },
    ],
    quiz: [
      { q: "What is the primary purpose of a literature review?", opts: ["To list all books on a topic", "To map existing knowledge and identify research gaps", "To prove your hypothesis", "To replace primary research"], ans: 1 },
      { q: "Which Boolean operator narrows a search by requiring both terms?", opts: ["OR", "NOT", "AND", "NEAR"], ans: 2 },
      { q: "In the CRAAP test, 'Authority' refers to:", opts: ["Accuracy of data", "Author credentials and expertise", "Availability of the source", "Academic database"], ans: 1 },
      { q: "How does synthesis differ from summary?", opts: ["It is shorter", "It connects and analyzes ideas across multiple sources", "It focuses on one source deeply", "It avoids citations"], ans: 1 },
    ],
  },
  {
    id: 2,
    title: "Research Methodology",
    tag: "Lesson 3",
    icon: "⚗️",
    color: "#059669",
    colorLight: "#d1fae5",
    subtitle: "Design a rigorous research framework with appropriate methods and instruments.",
    estimatedTime: "30 min",
    objectives: [
      "Distinguish between research design, method, and methodology",
      "Select appropriate data collection instruments",
      "Understand sampling techniques and their trade-offs",
      "Identify ethical considerations in research",
    ],
    sections: [
      {
        heading: "Research Design Framework",
        body: "Research methodology is the overarching strategy that guides how you collect, analyze, and interpret data. It answers the 'why' behind your methodological choices. The research design is the blueprint — it specifies the structure of the investigation and aligns your research questions with your methods.",
        type: "text",
      },
      {
        heading: "Sampling Techniques",
        type: "sampling-explorer",
      },
      {
        heading: "Data Collection Instruments",
        type: "tabs",
        tabs: [
          { label: "Surveys", icon: "📋", content: "Surveys gather self-reported data from a large number of respondents. They are cost-effective and allow for broad generalization. Likert scales, multiple choice, and open-ended formats each have distinct advantages." },
          { label: "Interviews", icon: "🎤", content: "Interviews allow in-depth exploration of participant perspectives. Structured interviews use fixed questions; semi-structured allow flexibility; unstructured are open-ended. Choose based on how much standardization your research requires." },
          { label: "Observation", icon: "👁️", content: "Observational methods study behavior in natural settings. Participant observation involves immersion in the group; non-participant observation maintains distance. Used extensively in ethnographic and sociological research." },
          { label: "Documents", icon: "📂", content: "Document analysis examines existing materials such as official records, reports, and media. It is useful when primary data collection is impractical and can corroborate findings from other methods." },
        ],
      },
      {
        heading: "Research Ethics Checklist",
        type: "checklist",
        items: [
          { label: "Informed Consent", desc: "Participants must be fully informed and voluntarily agree to participate." },
          { label: "Confidentiality", desc: "Personal data must be protected and identities kept anonymous where required." },
          { label: "No Harm Principle", desc: "Research must not cause physical or psychological harm to participants." },
          { label: "Right to Withdraw", desc: "Participants may exit the study at any time without penalty." },
          { label: "Data Integrity", desc: "All data must be collected, stored, and reported accurately and honestly." },
          { label: "IRB/Ethics Approval", desc: "Studies involving human subjects require institutional review board approval." },
        ],
      },
    ],
    downloads: [
      { name: "Survey Design Guide", type: "TXT", size: "2 KB", icon: "📄", content: "SURVEY DESIGN GUIDE\n\nPRINCIPLES OF GOOD SURVEY DESIGN\n1. Clear language — avoid jargon\n2. Single-barreled questions only\n3. Avoid leading questions\n4. Logical flow and grouping\n5. Appropriate response scales\n\nLIKERT SCALE OPTIONS:\n5-point: Strongly Disagree to Strongly Agree\n4-point: Never / Rarely / Sometimes / Always\n\nPRE-TESTING CHECKLIST:\n[ ] Piloted with 5-10 participants\n[ ] Timing recorded\n[ ] Ambiguous items revised", filename: "Survey_Design_Guide.txt" },
      { name: "Ethics Consent Form", type: "TXT", size: "1 KB", icon: "📝", content: "INFORMED CONSENT FORM\n\nStudy Title: ________________________\nResearcher: ________________________\nInstitution: ________________________\n\nPURPOSE:\nYou are invited to participate in a research study. The purpose is to ____________.\n\nPROCEDURES:\nIf you agree, you will be asked to ____________.\n\nCONFIDENTIALITY:\nYour responses will be kept strictly confidential.\n\nVOLUNTARY PARTICIPATION:\nParticipation is entirely voluntary.\n\nSignature: _____________  Date: _______", filename: "Ethics_Consent_Form.txt" },
    ],
    quiz: [
      { q: "What is the difference between methodology and method?", opts: ["They mean the same thing", "Methodology is the 'why'; method is the 'how'", "Method is broader than methodology", "Methodology only applies to quantitative research"], ans: 1 },
      { q: "Which sampling technique gives every member of a population an equal chance of selection?", opts: ["Purposive sampling", "Snowball sampling", "Simple random sampling", "Convenience sampling"], ans: 2 },
      { q: "What does 'informed consent' require?", opts: ["Participants must sign a waiver", "Participants must be fully informed and voluntarily agree", "Participants must be experts in the field", "Participants must complete all tasks"], ans: 1 },
      { q: "Which data collection method is best for in-depth exploration of perspectives?", opts: ["Large-scale survey", "Document analysis", "Semi-structured interview", "Random experiment"], ans: 2 },
    ],
  },
  {
    id: 3,
    title: "Data Analysis",
    tag: "Lesson 4",
    icon: "📊",
    color: "#d97706",
    colorLight: "#fef3c7",
    subtitle: "Master techniques to analyze, interpret, and present your research findings.",
    estimatedTime: "35 min",
    objectives: [
      "Distinguish between descriptive and inferential statistics",
      "Identify appropriate statistical tests for different data types",
      "Apply coding techniques for qualitative analysis",
      "Create effective data visualizations",
    ],
    sections: [
      {
        heading: "Quantitative Analysis Overview",
        body: "Quantitative data analysis transforms raw numbers into meaningful insights. Descriptive statistics summarize what the data shows; inferential statistics allow you to draw conclusions and make predictions about populations from samples. Choosing the right statistical test depends on your research design, the number of variables, and the level of measurement.",
        type: "text",
      },
      {
        heading: "Descriptive Statistics Calculator",
        type: "stats-calculator",
      },
      {
        heading: "Choosing the Right Statistical Test",
        type: "tabs",
        tabs: [
          { label: "Comparing Groups", icon: "📊", content: "T-test: Compare means of two groups. ANOVA: Compare means of three or more groups. Chi-square: Compare categorical data across groups. Mann-Whitney U: Non-parametric alternative to t-test when data is not normally distributed." },
          { label: "Relationships", icon: "🔗", content: "Pearson Correlation: Linear relationship between two continuous variables. Spearman Correlation: Non-parametric correlation for ranked data. Simple Linear Regression: Predict one variable from another. Multiple Regression: Predict from multiple independent variables." },
          { label: "Qualitative Coding", icon: "🏷️", content: "Open Coding: Break data into discrete parts and assign labels. Axial Coding: Identify relationships between categories. Selective Coding: Integrate categories around a core theme. Member Checking: Verify interpretations with participants for credibility." },
        ],
      },
      {
        heading: "Data Visualization Principles",
        type: "highlight",
        text: "Choose chart types purposefully: bar charts for comparisons, line charts for trends over time, scatter plots for correlations, and pie charts (sparingly) for proportions. Always label axes clearly, include units, avoid 3D effects, and ensure color choices are accessible to colorblind readers.",
      },
      {
        heading: "Interactive Chart Builder",
        type: "chart-builder",
      },
    ],
    downloads: [
      { name: "Statistical Test Decision Tree", type: "TXT", size: "2 KB", icon: "📄", content: "STATISTICAL TEST DECISION TREE\n\nSTEP 1: What is your goal?\n- Compare groups → Step 2\n- Find relationships → Step 3\n- Predict outcomes → Use Regression\n\nSTEP 2: How many groups?\n- 2 groups, normal → T-test\n- 2 groups, non-normal → Mann-Whitney U\n- 3+ groups, normal → ANOVA\n- 3+ groups, non-normal → Kruskal-Wallis\n\nSTEP 3: Data type?\n- Continuous → Pearson Correlation\n- Ranked → Spearman Correlation\n- Categorical → Chi-Square\n\nSIGNIFICANCE:\np < 0.05 = Significant\np < 0.01 = Highly significant\np < 0.001 = Very highly significant", filename: "Statistical_Test_Decision_Tree.txt" },
      { name: "Analysis Results Template", type: "TXT", size: "1 KB", icon: "📝", content: "DATA ANALYSIS RESULTS TEMPLATE\n\nCHAPTER 4: RESULTS AND DISCUSSION\n\n4.1 Descriptive Statistics\nTable 1. Descriptive Statistics for [Variable]\nVariable | N | Mean | SD | Min | Max\n\n4.2 Inferential Statistics\nTest Used: _________________________\nTest Statistic: ____________________\np-value: __________________________\nEffect Size: _______________________\n\n4.3 Interpretation\nThe results indicate that ______________.\n\n4.4 Discussion\nThese findings suggest ______________.\nIn relation to prior literature, _______.", filename: "Analysis_Results_Template.txt" },
    ],
    quiz: [
      { q: "Which statistics allows you to make conclusions about a population from a sample?", opts: ["Descriptive statistics", "Inferential statistics", "Summary statistics", "Frequency statistics"], ans: 1 },
      { q: "Which test is appropriate for comparing means across three or more groups?", opts: ["T-test", "Chi-square", "ANOVA", "Pearson correlation"], ans: 2 },
      { q: "In qualitative analysis, what is 'open coding'?", opts: ["Writing code to analyze data", "Breaking data into parts and assigning initial labels", "Selecting a core theme", "Verifying results with participants"], ans: 1 },
      { q: "Which chart type is most appropriate for showing trends over time?", opts: ["Bar chart", "Pie chart", "Line chart", "Scatter plot"], ans: 2 },
    ],
  },
  {
    id: 4,
    title: "Thesis Writing & Defense",
    tag: "Lesson 5",
    icon: "🎓",
    color: "#be185d",
    colorLight: "#fce7f3",
    subtitle: "Structure your thesis professionally and prepare for a successful oral defense.",
    estimatedTime: "30 min",
    objectives: [
      "Understand the standard thesis structure and each chapter's purpose",
      "Apply academic writing conventions and citation styles",
      "Prepare for common defense panel questions",
      "Avoid the most common thesis writing mistakes",
    ],
    sections: [
      {
        heading: "Standard Thesis Structure",
        type: "thesis-structure",
      },
      {
        heading: "Citation Styles",
        type: "tabs",
        tabs: [
          { label: "APA 7th", icon: "📖", content: "APA (American Psychological Association) is common in social sciences. In-text: (Author, Year). Reference: Author, A. A. (Year). Title of work. Publisher. DOI. Use past tense for results: 'The study found...'" },
          { label: "Chicago", icon: "📗", content: "Chicago style is used in history and humanities. Two systems: Notes-Bibliography (footnotes) and Author-Date (similar to APA). Footnote: ¹ Author First Last, Title (City: Publisher, Year), page." },
          { label: "MLA", icon: "📘", content: "MLA (Modern Language Association) is standard in literature and arts. In-text: (Author page) — no comma, no year. Works Cited: Last, First. Title. Publisher, Year. Present tense for texts: 'The author argues...'" },
        ],
      },
      {
        heading: "Oral Defense Preparation",
        type: "defense-prep",
      },
      {
        heading: "Common Thesis Mistakes to Avoid",
        type: "checklist",
        items: [
          { label: "Broad Research Problem", desc: "Ensure your problem statement is specific, focused, and researchable." },
          { label: "Weak Theoretical Framework", desc: "Ground your study in established theory relevant to your discipline." },
          { label: "Misaligned RRL and Methods", desc: "Your methodology must directly address the gaps found in your review." },
          { label: "Small or Unrepresentative Sample", desc: "Justify your sample size with power analysis or saturation criteria." },
          { label: "Unsupported Conclusions", desc: "Every conclusion must trace directly back to your data and analysis." },
          { label: "Inconsistent Citation Format", desc: "Pick one citation style and apply it consistently throughout." },
        ],
      },
    ],
    downloads: [
      { name: "Full Thesis Template", type: "TXT", size: "3 KB", icon: "📝", content: "THESIS TEMPLATE\n\n[TITLE PAGE]\nTitle: _________________________\nAuthor: _______________________\nDegree: _______________________\nInstitution: ____________________\nYear: _________________________\n\n[ABSTRACT] (150-300 words)\n\n[CHAPTER 1: INTRODUCTION]\n1.1 Background of the Study\n1.2 Statement of the Problem\n1.3 Objectives\n1.4 Significance\n1.5 Scope and Delimitation\n1.6 Definition of Terms\n\n[CHAPTER 2: REVIEW OF RELATED LITERATURE]\n2.1 [Theme 1]\n2.2 [Theme 2]\n2.3 Theoretical Framework\n2.4 Conceptual Framework\n2.5 Synthesis\n\n[CHAPTER 3: METHODOLOGY]\n3.1 Research Design\n3.2 Research Locale\n3.3 Respondents/Participants\n3.4 Sampling Procedure\n3.5 Instrumentation\n3.6 Data Gathering Procedure\n3.7 Statistical Treatment\n\n[CHAPTER 4: RESULTS AND DISCUSSION]\n\n[CHAPTER 5: CONCLUSIONS AND RECOMMENDATIONS]\n5.1 Summary\n5.2 Conclusions\n5.3 Recommendations\n\n[REFERENCES]\n[APPENDICES]", filename: "Full_Thesis_Template.txt" },
      { name: "Defense Questions Guide", type: "TXT", size: "2 KB", icon: "📄", content: "ORAL DEFENSE PREPARATION GUIDE\n\nCOMMON PANEL QUESTIONS\n\n1. 'What is the significance of your study?'\n   Focus on the gap it fills and who benefits.\n\n2. 'Why did you choose this methodology?'\n   Explain alignment with your research question.\n\n3. 'What are the limitations?'\n   Be honest; frame as future research directions.\n\n4. 'How did you ensure validity and reliability?'\n   Mention triangulation, member checking, pilot testing.\n\n5. 'What would you do differently?'\n   Show reflective thinking and academic maturity.\n\nDEFENSE DAY TIPS:\n[ ] Know your paper inside out\n[ ] Practice with peers\n[ ] Prepare 10-15 min slides\n[ ] Bring printed copies\n[ ] Stay calm — panelists want you to succeed", filename: "Defense_Questions_Guide.txt" },
    ],
    quiz: [
      { q: "Which thesis chapter presents the research design, sampling, and data collection?", opts: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"], ans: 2 },
      { q: "In APA 7th edition, which in-text citation format is correct?", opts: ["(Author, Year)", "[Author Year]", "(Author: Year)", "Author (Year, p.)"], ans: 0 },
      { q: "What should a thesis abstract contain?", opts: ["Only conclusions", "Background, objectives, methods, findings, and recommendations", "A detailed literature review", "The full methodology"], ans: 1 },
      { q: "Which is a common thesis writing mistake?", opts: ["Using a narrow research focus", "Grounding the study in theory", "Drawing conclusions not supported by data", "Citing sources consistently"], ans: 2 },
    ],
  },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;width:100%;overflow:hidden;font-family:'DM Sans',sans-serif;}
#root{height:100%;width:100%;}
:root{
  --bg:#f4f1ec;--surface:#ffffff;--surface2:#faf8f5;
  --sidebar:#111827;--sidebar2:#1f2937;
  --border:#e5dfd6;--border2:#d1c9bc;
  --text:#1a1614;--muted:#6b7280;--muted2:#9ca3af;
  --accent:#1d4ed8;--accent-light:#eff6ff;
  --success:#059669;--danger:#dc2626;--warning:#d97706;
  --radius:10px;--radius-lg:16px;--radius-xl:20px;
  --shadow:0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:0 4px 20px rgba(0,0,0,0.09);
  --shadow-lg:0 8px 32px rgba(0,0,0,0.12);
  --font-display:'Crimson Pro',Georgia,serif;
  --font-body:'DM Sans',sans-serif;
}
.app{display:flex;flex-direction:column;width:100vw;height:100vh;overflow:hidden;background:var(--bg);}
.app-body{display:flex;flex:1;overflow:hidden;}

/* TOPBAR */
.topbar{width:100%;flex-shrink:0;height:58px;display:flex;align-items:center;gap:16px;padding:0 20px;background:var(--sidebar);border-bottom:1px solid rgba(255,255,255,0.07);z-index:300;}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.logo-icon{width:32px;height:32px;background:#2563eb;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;}
.logo-text{font-family:var(--font-display);font-size:19px;color:#fff;font-weight:600;letter-spacing:-0.3px;}
.logo-text span{color:#93c5fd;}
.topbar-search{flex:1;max-width:400px;position:relative;margin:0 16px;}
.search-input{width:100%;height:36px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0 12px 0 36px;color:#fff;font-size:13px;font-family:var(--font-body);outline:none;transition:all 0.2s;}
.search-input::placeholder{color:rgba(255,255,255,0.3);}
.search-input:focus{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.25);}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.35);font-size:14px;pointer-events:none;}
.search-results{position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);z-index:400;overflow:hidden;max-height:320px;overflow-y:auto;}
.search-result-item{padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);transition:background 0.1s;}
.search-result-item:last-child{border-bottom:none;}
.search-result-item:hover{background:var(--surface2);}
.sri-lesson{font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:2px;}
.sri-title{font-size:13px;font-weight:500;color:var(--text);}
.sri-match{font-size:12px;color:var(--muted);margin-top:1px;}
.search-empty{padding:16px;text-align:center;font-size:13px;color:var(--muted);}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:14px;}
.progress-wrap{display:flex;align-items:center;gap:10px;}
.progress-label{font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.8px;}
.progress-track{width:100px;height:3px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;}
.progress-fill{height:100%;background:#3b82f6;border-radius:4px;transition:width 0.7s cubic-bezier(.4,0,.2,1);}
.progress-pct{font-size:12px;color:#93c5fd;font-weight:600;min-width:30px;}

/* SIDEBAR */
.sidebar{width:260px;flex-shrink:0;background:var(--sidebar);padding:16px 0 32px;overflow-y:auto;height:100%;border-right:1px solid rgba(255,255,255,0.04);}
.sidebar-section-label{padding:6px 18px 8px;font-size:10px;text-transform:uppercase;letter-spacing:1.8px;color:rgba(255,255,255,0.22);font-weight:500;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 18px;cursor:pointer;border-left:2px solid transparent;transition:all 0.15s;}
.nav-item:hover{background:rgba(255,255,255,0.05);}
.nav-item.active{background:rgba(59,130,246,0.15);border-left-color:#3b82f6;}
.nav-item.completed .nav-num{background:var(--success) !important;color:#fff !important;}
.nav-num{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);flex-shrink:0;transition:all 0.2s;}
.nav-texts{flex:1;min-width:0;}
.nav-tag{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.28);}
.nav-title{font-size:12px;font-weight:500;color:rgba(255,255,255,0.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nav-item.active .nav-title{color:#fff;}
.nav-done-icon{color:var(--success);font-size:11px;}
.sidebar-divider{height:1px;background:rgba(255,255,255,0.06);margin:12px 18px;}
.sidebar-progress-label{padding:0 18px;font-size:11px;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
.sidebar-progress-track{height:4px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin:0 18px;}
.sidebar-progress-fill{height:100%;background:#3b82f6;border-radius:4px;transition:width 0.7s;}
.sidebar-progress-text{font-size:12px;color:rgba(255,255,255,0.3);padding:6px 18px 0;}

/* CONTENT AREA */
.content-area{flex:1;overflow-y:auto;height:100%;}
.content-inner{max-width:800px;padding:40px 52px 64px;margin:0 auto;}

/* CHAPTER HEADER */
.ch-header{margin-bottom:30px;}
.ch-breadcrumb{font-size:12px;color:var(--muted2);margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.ch-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-bottom:14px;letter-spacing:0.4px;}
.ch-title{font-family:var(--font-display);font-size:38px;font-weight:600;line-height:1.15;color:var(--text);margin-bottom:10px;letter-spacing:-0.5px;}
.ch-subtitle{font-size:15px;color:var(--muted);line-height:1.7;max-width:560px;margin-bottom:18px;}
.ch-meta-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.ch-meta-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);}
.ch-obj-toggle{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--accent);cursor:pointer;padding:4px 10px;border-radius:6px;border:1px solid rgba(37,99,235,0.2);background:rgba(37,99,235,0.04);transition:all 0.15s;}
.ch-obj-toggle:hover{background:rgba(37,99,235,0.08);}
.objectives-box{background:var(--accent-light);border:1px solid rgba(37,99,235,0.15);border-radius:var(--radius-lg);padding:18px 22px;margin:14px 0;}
.obj-title{font-size:12px;font-weight:600;color:#1e40af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;}
.obj-list{list-style:none;display:flex;flex-direction:column;gap:7px;}
.obj-list li{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#1e3a8a;}
.obj-list li::before{content:'✓';color:#2563eb;font-weight:700;flex-shrink:0;margin-top:1px;}
.divider{height:1px;background:var(--border);margin:28px 0;}

/* SECTIONS */
.section{margin-bottom:28px;}
.section-heading{font-family:var(--font-display);font-size:23px;font-weight:600;color:var(--text);margin-bottom:12px;}
.body-text{font-size:15px;line-height:1.8;color:#374151;}
.highlight-box{background:linear-gradient(135deg,#f0f7ff,#e8f2ff);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:16px 20px;margin:14px 0;font-style:italic;font-size:14px;line-height:1.75;color:#1e3a8a;}

/* TABS */
.tab-bar{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:18px;overflow-x:auto;}
.tab-btn{padding:9px 16px;font-size:13px;font-weight:500;color:var(--muted);border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;transition:all 0.15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--font-body);display:flex;align-items:center;gap:6px;}
.tab-btn:hover{color:var(--text);}
.tab-btn.active{color:var(--accent);border-bottom-color:var(--accent);font-weight:600;}
.tab-content{font-size:14px;line-height:1.75;color:#374151;background:var(--surface2);padding:16px 18px;border-radius:var(--radius);border:1px solid var(--border);}

/* STEPS GRID */
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:14px 0;}
.step-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;text-align:center;box-shadow:var(--shadow);}
.step-icon-wrap{width:44px;height:44px;background:var(--accent-light);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto 10px;}
.step-num-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--muted2);margin-bottom:4px;}
.step-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;}
.step-desc{font-size:12px;color:var(--muted);line-height:1.5;}

/* FLASHCARDS */
.flashcard-container{margin:14px 0;}
.fc-hint{font-size:11px;color:var(--muted2);text-align:center;margin-bottom:8px;}
.flashcard-wrap{perspective:1000px;height:150px;cursor:pointer;margin-bottom:10px;}
.flashcard{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.5s;}
.flashcard.flipped{transform:rotateY(180deg);}
.flashcard-front,.flashcard-back{position:absolute;inset:0;backface-visibility:hidden;border-radius:var(--radius-lg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;padding:20px;text-align:center;}
.flashcard-front{background:var(--surface);box-shadow:var(--shadow);}
.flashcard-back{background:#2563eb;transform:rotateY(180deg);}
.fc-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted2);}
.fc-term{font-size:22px;font-family:var(--font-display);font-weight:600;color:var(--text);}
.fc-def{font-size:13px;color:rgba(255,255,255,0.9);line-height:1.5;}
.fc-label-back{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.5);}
.fc-nav{display:flex;align-items:center;justify-content:center;gap:14px;}
.fc-count{font-size:13px;color:var(--muted);font-weight:500;}

/* BOOLEAN SEARCH */
.boolean-demo{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;box-shadow:var(--shadow);}
.bool-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.bool-input{height:36px;border:1px solid var(--border);border-radius:8px;padding:0 12px;font-size:13px;font-family:var(--font-body);color:var(--text);background:var(--surface2);outline:none;flex:1;min-width:120px;}
.bool-input:focus{border-color:var(--accent);}
.bool-op{padding:6px 12px;border-radius:8px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font-body);transition:all 0.15s;}
.bool-op.AND{background:#dbeafe;color:#1e40af;}
.bool-op.OR{background:#fef3c7;color:#92400e;}
.bool-op.NOT{background:#fee2e2;color:#991b1b;}
.bool-op.active-op{transform:scale(1.08);box-shadow:0 2px 8px rgba(0,0,0,0.15);}
.bool-result{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--text);min-height:44px;}

/* CRAAP */
.craap-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:14px 0;}
.craap-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 10px;text-align:center;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
.craap-card.active-craap{transform:translateY(-3px);box-shadow:var(--shadow-md);}
.craap-letter{font-size:28px;font-family:var(--font-display);font-weight:700;margin-bottom:4px;}
.craap-name{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
.craap-detail{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;margin-top:8px;font-size:13px;line-height:1.65;color:#374151;}
.craap-hint{font-size:12px;color:var(--muted2);text-align:center;margin-top:8px;}

/* COMPARISON */
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0;}
.compare-col{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;box-shadow:var(--shadow);}
.compare-label{font-size:13px;font-weight:700;margin-bottom:12px;padding:6px 12px;border-radius:6px;display:inline-block;}
.compare-list{list-style:none;display:flex;flex-direction:column;gap:8px;}
.compare-list li{display:flex;gap:8px;font-size:13px;color:#374151;line-height:1.45;}
.compare-dot{flex-shrink:0;margin-top:2px;}

/* SAMPLING */
.sampling-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:14px 0;}
.sampling-card{background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:16px;cursor:pointer;transition:all 0.2s;}
.sampling-card:hover,.sampling-card.selected{border-color:var(--accent);background:var(--accent-light);}
.sampling-card-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:3px;}
.sampling-card-type{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted2);margin-bottom:6px;}
.sampling-card-desc{font-size:12px;color:var(--muted);line-height:1.5;}
.sampling-detail{background:var(--accent-light);border:1px solid rgba(37,99,235,0.2);border-radius:var(--radius);padding:14px 18px;margin-top:10px;font-size:13px;color:#1e3a8a;line-height:1.65;}

/* CHECKLIST */
.checklist{display:flex;flex-direction:column;gap:10px;margin:14px 0;}
.check-progress{font-size:12px;color:var(--success);font-weight:600;margin-bottom:6px;}
.check-item{display:flex;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;cursor:pointer;transition:all 0.15s;}
.check-item:hover{border-color:var(--border2);}
.check-item.checked{background:rgba(5,150,105,0.05);border-color:rgba(5,150,105,0.3);}
.check-box{width:22px;height:22px;border:2px solid var(--border2);border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all 0.2s;}
.check-item.checked .check-box{background:var(--success);border-color:var(--success);color:#fff;}
.check-text-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px;}
.check-text-desc{font-size:12px;color:var(--muted);line-height:1.5;}

/* STATS CALCULATOR */
.calc-zone{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;box-shadow:var(--shadow);}
.calc-label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;}
.calc-textarea{width:100%;min-height:52px;border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;font-family:var(--font-body);color:var(--text);background:var(--surface2);resize:vertical;outline:none;}
.calc-textarea:focus{border-color:var(--accent);}
.stats-results{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;}
.stat-box2{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;}
.stat-value2{font-size:22px;font-family:var(--font-display);font-weight:600;color:var(--accent);}
.stat-label2{font-size:11px;color:var(--muted);margin-top:3px;text-transform:uppercase;letter-spacing:0.5px;}

/* CHART BUILDER */
.chart-zone{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;box-shadow:var(--shadow);}
.chart-controls{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:flex-end;}
.chart-select{height:34px;border:1px solid var(--border);border-radius:8px;padding:0 10px;font-size:13px;font-family:var(--font-body);color:var(--text);background:var(--surface2);outline:none;}
.bar-chart{display:flex;align-items:flex-end;gap:8px;height:180px;padding-top:10px;}
.bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;}
.bar{width:100%;border-radius:4px 4px 0 0;transition:height 0.5s cubic-bezier(.4,0,.2,1);min-height:4px;cursor:pointer;opacity:0.85;}
.bar:hover{opacity:1;}
.bar-label{font-size:11px;color:var(--muted);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;}
.bar-val{font-size:11px;font-weight:600;color:var(--text);}
.chart-caption{font-size:12px;color:var(--muted);text-align:center;margin-top:10px;}

/* THESIS STRUCTURE */
.thesis-chapters{display:flex;flex-direction:column;gap:8px;margin:14px 0;}
.thesis-ch{border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}
.thesis-ch-header{display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;background:var(--surface);transition:background 0.15s;}
.thesis-ch-header:hover{background:var(--surface2);}
.thesis-ch-num{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}
.thesis-ch-title{font-size:14px;font-weight:600;color:var(--text);flex:1;}
.thesis-ch-arrow{font-size:12px;color:var(--muted);transition:transform 0.2s;}
.thesis-ch-arrow.open{transform:rotate(90deg);}
.thesis-ch-body{padding:14px 18px 16px 62px;background:var(--surface2);border-top:1px solid var(--border);}
.thesis-ch-body ul{list-style:none;display:flex;flex-direction:column;gap:6px;}
.thesis-ch-body li{font-size:13px;color:#374151;display:flex;gap:8px;line-height:1.5;}
.thesis-ch-body li::before{content:'•';color:var(--muted2);flex-shrink:0;}

/* DEFENSE PREP */
.defense-qa{display:flex;flex-direction:column;gap:10px;margin:14px 0;}
.defense-q{border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}
.defense-q-header{padding:13px 18px;background:var(--surface);cursor:pointer;font-size:14px;font-weight:500;color:var(--text);display:flex;justify-content:space-between;align-items:center;transition:background 0.15s;gap:12px;}
.defense-q-header:hover{background:var(--surface2);}
.defense-q-q{flex:1;}
.defense-q-arr{font-size:12px;color:var(--muted);flex-shrink:0;}
.defense-q-body{padding:13px 18px;background:#f0f7ff;border-top:1px solid var(--border);font-size:13px;color:#1e3a8a;line-height:1.65;}

/* DOWNLOADS */
.downloads-section{margin:28px 0;}
.downloads-title{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;}
.downloads-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;}
.dl-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
.dl-card:hover{border-color:#93c5fd;box-shadow:var(--shadow-md);transform:translateY(-1px);}
.dl-icon{font-size:28px;flex-shrink:0;}
.dl-info{flex:1;min-width:0;}
.dl-name{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.dl-meta{font-size:11px;color:var(--muted);margin-top:2px;}
.dl-btn{font-size:11px;font-weight:600;color:#fff;background:#2563eb;padding:5px 10px;border-radius:6px;flex-shrink:0;white-space:nowrap;}

/* QUIZ */
.quiz-zone{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:28px 32px;margin:24px 0;box-shadow:var(--shadow-md);}
.quiz-hdr{display:flex;align-items:center;gap:14px;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--border);}
.quiz-icon-box{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.quiz-meta-title{font-size:15px;font-weight:600;color:var(--text);}
.quiz-meta-sub{font-size:12px;color:var(--muted);margin-top:2px;}
.quiz-badge{font-size:11px;color:var(--muted);background:var(--surface2);border:1px solid var(--border);padding:4px 10px;border-radius:20px;font-weight:500;margin-left:auto;}
.q-block{margin-bottom:22px;}
.q-text{font-size:15px;font-weight:500;color:var(--text);margin-bottom:12px;line-height:1.5;}
.q-num{font-weight:700;}
.options{display:flex;flex-direction:column;gap:7px;}
.opt{display:flex;align-items:center;gap:10px;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer;font-size:14px;color:var(--text);background:var(--surface);transition:all 0.15s;user-select:none;}
.opt:hover{border-color:#93c5fd;background:#f0f7ff;}
.opt.selected{border-color:#2563eb;background:#eff6ff;font-weight:500;}
.opt.correct{border-color:var(--success);background:rgba(5,150,105,0.07);color:#065f46;}
.opt.wrong{border-color:var(--danger);background:rgba(220,38,38,0.07);color:#7f1d1d;}
.opt.disabled{cursor:default;}
.opt-letter{width:26px;height:26px;border-radius:7px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--muted);flex-shrink:0;transition:all 0.15s;}
.opt.selected .opt-letter{background:#2563eb;color:#fff;}
.opt.correct .opt-letter{background:var(--success);color:#fff;}
.opt.wrong .opt-letter{background:var(--danger);color:#fff;}
.quiz-actions{display:flex;align-items:center;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid var(--border);flex-wrap:wrap;}
.result-banner{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:var(--radius);font-size:13px;font-weight:500;}
.result-banner.pass{background:rgba(5,150,105,0.08);color:#065f46;border:1px solid rgba(5,150,105,0.2);}
.result-banner.partial{background:#fef3c7;color:#92400e;border:1px solid rgba(217,119,6,0.25);}
.result-banner.fail{background:#fee2e2;color:#991b1b;border:1px solid rgba(220,38,38,0.2);}

/* CHAPTER NAV */
.chapter-nav{display:flex;justify-content:space-between;gap:12px;margin-top:40px;padding-top:24px;border-top:1px solid var(--border);}
.cnav-btn{display:flex;align-items:center;gap:10px;padding:12px 18px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--surface);cursor:pointer;font-family:var(--font-body);transition:all 0.15s;box-shadow:var(--shadow);flex:1;max-width:48%;}
.cnav-btn:hover{border-color:#93c5fd;}
.cnav-btn:disabled{opacity:0.3;cursor:not-allowed;}
.cnav-btn:disabled:hover{border-color:var(--border);}
.cnav-dir{font-size:11px;color:var(--muted);}
.cnav-title{font-size:13px;font-weight:600;color:var(--text);}
.cnav-right{text-align:right;justify-content:flex-end;}

/* BUTTONS */
.btn{padding:9px 20px;border-radius:var(--radius);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font-body);border:none;transition:all 0.15s;}
.btn-primary{background:#2563eb;color:#fff;}
.btn-primary:hover{background:#1d4ed8;transform:translateY(-1px);box-shadow:0 4px 12px rgba(37,99,235,0.35);}
.btn-primary:disabled{background:#93c5fd;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border);}
.btn-ghost:hover{background:var(--surface2);color:var(--text);}
.btn-sm{padding:6px 14px;font-size:12px;}

/* SUMMARY */
.summary{text-align:center;padding:48px 20px;}
.summary-trophy{font-size:72px;display:block;margin-bottom:16px;}
.summary-title{font-family:var(--font-display);font-size:38px;font-weight:600;margin-bottom:8px;}
.summary-sub{font-size:15px;color:var(--muted);margin-bottom:36px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.65;}
.summary-stats{display:flex;gap:16px;justify-content:center;margin-bottom:36px;flex-wrap:wrap;}
.sum-stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:24px 36px;box-shadow:var(--shadow-md);}
.sum-val{font-family:var(--font-display);font-size:36px;font-weight:700;color:#2563eb;}
.sum-label{font-size:12px;color:var(--muted);margin-top:4px;}

@media(max-width:768px){
  .sidebar{display:none;}
  .content-inner{padding:24px 18px 48px;}
  .ch-title{font-size:28px;}
  .steps-grid{grid-template-columns:1fr;}
  .craap-grid{grid-template-columns:repeat(3,1fr);}
  .compare-grid{grid-template-columns:1fr;}
  .stats-results{grid-template-columns:repeat(2,1fr);}
  .sampling-grid{grid-template-columns:1fr;}
}
`;

// ─── UTILS ───────────────────────────────────────────────────────────────────
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── INTERACTIVE COMPONENTS ──────────────────────────────────────────────────

function Flashcards({ cards }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const go = (dir) => {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + dir + cards.length) % cards.length), 160);
  };
  return (
    <div className="flashcard-container">
      <p className="fc-hint">Click the card to reveal its definition · {cards.length} cards total</p>
      <div className="flashcard-wrap" onClick={() => setFlipped(f => !f)}>
        <div className={`flashcard${flipped ? " flipped" : ""}`}>
          <div className="flashcard-front">
            <span className="fc-label">Term</span>
            <span className="fc-term">{cards[idx].term}</span>
          </div>
          <div className="flashcard-back">
            <span className="fc-label-back">Definition</span>
            <span className="fc-def">{cards[idx].def}</span>
          </div>
        </div>
      </div>
      <div className="fc-nav">
        <button className="btn btn-ghost btn-sm" onClick={() => go(-1)}>← Prev</button>
        <span className="fc-count">{idx + 1} / {cards.length}</span>
        <button className="btn btn-ghost btn-sm" onClick={() => go(1)}>Next →</button>
      </div>
    </div>
  );
}

function BooleanDemo() {
  const [t1, setT1] = useState("climate change");
  const [t2, setT2] = useState("Philippines");
  const [op, setOp] = useState("AND");
  const opInfo = {
    AND: "Narrows your search — returns results that contain BOTH terms.",
    OR: "Broadens your search — returns results with EITHER term.",
    NOT: `Excludes a term — returns "${t1}" results that do NOT mention "${t2}".`,
  };
  return (
    <div className="boolean-demo">
      <div className="bool-row">
        <input className="bool-input" value={t1} onChange={e => setT1(e.target.value)} placeholder="Term 1" />
        {["AND", "OR", "NOT"].map(o => (
          <button key={o} className={`bool-op ${o}${op === o ? " active-op" : ""}`} onClick={() => setOp(o)}>{o}</button>
        ))}
        <input className="bool-input" value={t2} onChange={e => setT2(e.target.value)} placeholder="Term 2" />
      </div>
      <div className="calc-label">Generated Query</div>
      <div className="bool-result" style={{ marginBottom: 12 }}>
        <strong style={{ color: "#2563eb" }}>"{t1} {op} {t2}"</strong>
      </div>
      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
        <strong style={{ color: op === "AND" ? "#1e40af" : op === "OR" ? "#92400e" : "#991b1b" }}>{op}: </strong>
        {opInfo[op]}
      </p>
    </div>
  );
}

const CRAAP_DATA = [
  { key: "C", letter: "C", name: "Currency", color: "#2563eb", desc: "When was it published or updated? Is it current enough? Scientific fields need sources within 5 years; historical topics may accept older works." },
  { key: "R", letter: "R", name: "Relevance", color: "#7c3aed", desc: "Does it relate to your topic? Is it aimed at an appropriate academic level? Would you be comfortable citing it in your thesis?" },
  { key: "A1", letter: "A", name: "Authority", color: "#059669", desc: "Who wrote it? What are their credentials? Is the source peer-reviewed or published by a reputable institution or journal?" },
  { key: "A2", letter: "A", name: "Accuracy", color: "#d97706", desc: "Is it supported by evidence? Are citations included? Can you verify the facts from other independent sources?" },
  { key: "P", letter: "P", name: "Purpose", color: "#dc2626", desc: "Why does this exist? Is it objective, or does it reflect bias? Does it present multiple perspectives, or push a particular agenda?" },
];

function CRAAPTest() {
  const [active, setActive] = useState(null);
  return (
    <div>
      <div className="craap-grid">
        {CRAAP_DATA.map(d => (
          <div key={d.key}
            className={`craap-card${active === d.key ? " active-craap" : ""}`}
            style={{ borderColor: active === d.key ? d.color : "", borderWidth: active === d.key ? 2 : 1 }}
            onClick={() => setActive(active === d.key ? null : d.key)}>
            <div className="craap-letter" style={{ color: d.color }}>{d.letter}</div>
            <div className="craap-name">{d.name}</div>
          </div>
        ))}
      </div>
      {active
        ? (() => {
          const d = CRAAP_DATA.find(x => x.key === active);
          return <div className="craap-detail" style={{ borderLeft: `3px solid ${d.color}` }}><strong style={{ color: d.color }}>{d.name}: </strong>{d.desc}</div>;
        })()
        : <p className="craap-hint">Click any letter to learn what each criterion means</p>}
    </div>
  );
}

const SAMPLING_DATA = [
  { name: "Simple Random", type: "Probability", desc: "Every member has equal chance via random selection.", detail: "Best for large, accessible populations with a sampling frame. Example: Using student ID numbers to randomly select 100 respondents from 2,000 enrolled students." },
  { name: "Stratified", type: "Probability", desc: "Divide into subgroups; sample from each stratum.", detail: "Ensures representation of subgroups. Example: Sampling equal numbers of male and female students to compare academic performance by gender." },
  { name: "Cluster", type: "Probability", desc: "Select groups (clusters) then sample within them.", detail: "For dispersed populations. Example: Randomly selecting 5 barangays from a province, then surveying all households in those barangays." },
  { name: "Purposive", type: "Non-Probability", desc: "Researcher selects specific participants intentionally.", detail: "For qualitative research needing expertise. Example: Selecting teachers with 10+ years experience for a study on veteran teaching practices." },
  { name: "Snowball", type: "Non-Probability", desc: "Participants recruit future participants from networks.", detail: "For hard-to-reach populations. Example: Studying migrant workers — one participant refers others from their community network." },
  { name: "Convenience", type: "Non-Probability", desc: "Select whoever is most accessible.", detail: "Lowest generalizability; best for pilot testing only. Example: Surveying classmates. Avoid for a main thesis study if possible." },
];

function SamplingExplorer() {
  const [sel, setSel] = useState(null);
  return (
    <div>
      <div className="sampling-grid">
        {SAMPLING_DATA.map((s, i) => (
          <div key={i} className={`sampling-card${sel === i ? " selected" : ""}`} onClick={() => setSel(sel === i ? null : i)}>
            <div className="sampling-card-type">{s.type}</div>
            <div className="sampling-card-name">{s.name} Sampling</div>
            <div className="sampling-card-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      {sel !== null && (
        <div className="sampling-detail">
          <strong>When to use {SAMPLING_DATA[sel].name} Sampling: </strong>{SAMPLING_DATA[sel].detail}
        </div>
      )}
    </div>
  );
}

function StatsCalculator() {
  const [input, setInput] = useState("85, 90, 78, 92, 88, 76, 95, 83, 89, 91");
  const stats = useMemo(() => {
    const nums = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n !== 0);
    if (nums.length < 2) return null;
    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const sorted = [...nums].sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const sd = Math.sqrt(nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
    return { n, mean: mean.toFixed(2), median: median.toFixed(2), sd: sd.toFixed(2), min: sorted[0], max: sorted[n - 1] };
  }, [input]);
  return (
    <div className="calc-zone">
      <div className="calc-label">Enter numbers separated by commas</div>
      <textarea className="calc-textarea" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 85, 90, 78, 92" />
      {stats ? (
        <div className="stats-results">
          {[["N", stats.n, "Count"], ["Mean", stats.mean, "Average"], ["Median", stats.median, "Middle"], ["Std Dev", stats.sd, "Spread"]].map(([k, v, l]) => (
            <div key={k} className="stat-box2"><div className="stat-value2">{v}</div><div className="stat-label2">{l}</div></div>
          ))}
        </div>
      ) : <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Enter at least 2 numbers to calculate statistics.</p>}
    </div>
  );
}

const CHART_DATASETS = {
  "Survey Responses": [{ l: "Strongly Agree", v: 42 }, { l: "Agree", v: 35 }, { l: "Neutral", v: 13 }, { l: "Disagree", v: 7 }, { l: "Str. Disagree", v: 3 }],
  "Academic Performance": [{ l: "Excellent", v: 28 }, { l: "Very Good", v: 45 }, { l: "Good", v: 18 }, { l: "Fair", v: 7 }, { l: "Poor", v: 2 }],
  "Sample by Grade": [{ l: "Grade 7", v: 30 }, { l: "Grade 8", v: 25 }, { l: "Grade 9", v: 22 }, { l: "Grade 10", v: 23 }],
  "Research Methods Used": [{ l: "Survey", v: 55 }, { l: "Interview", v: 25 }, { l: "Observation", v: 12 }, { l: "Mixed", v: 8 }],
};
const CHART_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];

function ChartBuilder() {
  const [dataset, setDataset] = useState("Survey Responses");
  const data = CHART_DATASETS[dataset];
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="chart-zone">
      <div className="chart-controls">
        <div>
          <div className="calc-label">Select Dataset</div>
          <select className="chart-select" value={dataset} onChange={e => setDataset(e.target.value)}>
            {Object.keys(CHART_DATASETS).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)", paddingBottom: 2 }}>
          n = {data.reduce((a, b) => a + b.v, 0)} total
        </span>
      </div>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div key={i} className="bar-wrap">
            <div className="bar-val">{d.v}%</div>
            <div className="bar" style={{ height: `${(d.v / max) * 140}px`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <div className="bar-label" title={d.l}>{d.l}</div>
          </div>
        ))}
      </div>
      <div className="chart-caption">Figure 1. {dataset} — Bar Chart (n={data.reduce((a, b) => a + b.v, 0)})</div>
    </div>
  );
}

const THESIS_CH_DATA = [
  { num: 1, title: "Introduction", color: "#2563eb", items: ["Background of the Study", "Statement of the Problem", "Research Objectives", "Significance of the Study", "Scope and Delimitation", "Definition of Terms"] },
  { num: 2, title: "Review of Related Literature", color: "#7c3aed", items: ["Thematically organized RRL", "Theoretical Framework", "Conceptual Framework", "Synthesis of Literature"] },
  { num: 3, title: "Methodology", color: "#059669", items: ["Research Design", "Research Locale", "Respondents / Participants", "Sampling Procedure", "Research Instrument", "Data Gathering Procedure", "Statistical Treatment"] },
  { num: 4, title: "Results and Discussion", color: "#d97706", items: ["Findings per research question", "Statistical tables and figures", "Discussion in relation to RRL", "Interpretation of results"] },
  { num: 5, title: "Conclusions & Recommendations", color: "#dc2626", items: ["Summary of Findings", "Conclusions", "Recommendations", "References", "Appendices"] },
];

function ThesisStructure() {
  const [open, setOpen] = useState(null);
  return (
    <div className="thesis-chapters">
      {THESIS_CH_DATA.map(ch => (
        <div key={ch.num} className="thesis-ch">
          <div className="thesis-ch-header" onClick={() => setOpen(open === ch.num ? null : ch.num)}>
            <div className="thesis-ch-num" style={{ background: ch.color }}>Ch.{ch.num}</div>
            <div className="thesis-ch-title">{ch.title}</div>
            <span className={`thesis-ch-arrow${open === ch.num ? " open" : ""}`}>▶</span>
          </div>
          {open === ch.num && (
            <div className="thesis-ch-body">
              <ul>{ch.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const DEFENSE_QA = [
  { q: "What is the significance of your study?", a: "Focus on: (1) the gap in literature your study fills, (2) who benefits from your findings, and (3) how results apply in practice. Be specific and confident." },
  { q: "Why did you choose this research design/methodology?", a: "Explain alignment between your research question and chosen design. For quantitative: why numerical measurement fits. For qualitative: why depth of understanding matters more than breadth." },
  { q: "What are the limitations of your study?", a: "Be honest and frame constructively. Common limitations: sample size, scope, time, self-reported data. After each, suggest what future research could address." },
  { q: "How did you ensure validity and reliability?", a: "Mention: pilot testing, expert validation, Cronbach's alpha, member checking for qualitative credibility, triangulation across multiple data sources." },
  { q: "What would you do differently?", a: "Show reflective thinking: 'I would increase the sample size,' or 'I would add a qualitative component to explain the quantitative findings more deeply.'" },
  { q: "How does your study contribute to the field?", a: "Connect findings to gaps in your RRL: 'This study confirms...', 'This study contradicts...', or 'This extends [Author, Year] by...'" },
];

function DefensePrep() {
  const [open, setOpen] = useState(null);
  return (
    <div className="defense-qa">
      {DEFENSE_QA.map((qa, i) => (
        <div key={i} className="defense-q">
          <div className="defense-q-header" onClick={() => setOpen(open === i ? null : i)}>
            <span className="defense-q-q">❓ {qa.q}</span>
            <span className="defense-q-arr">{open === i ? "▲" : "▼"}</span>
          </div>
          {open === i && <div className="defense-q-body">💡 {qa.a}</div>}
        </div>
      ))}
    </div>
  );
}

function TabbedContent({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="tab-bar">
        {tabs.map((t, i) => (
          <button key={i} className={`tab-btn${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[active].content}</div>
    </div>
  );
}

function ChecklistInteractive({ items }) {
  const [checked, setChecked] = useState({});
  const count = Object.values(checked).filter(Boolean).length;
  return (
    <div>
      {count > 0 && <div className="check-progress">✓ {count}/{items.length} items acknowledged</div>}
      <div className="checklist">
        {items.map((item, i) => (
          <div key={i} className={`check-item${checked[i] ? " checked" : ""}`} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}>
            <div className="check-box">{checked[i] ? "✓" : ""}</div>
            <div>
              <div className="check-text-title">{item.label}</div>
              <div className="check-text-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ sec }) {
  switch (sec.type) {
    case "text": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><p className="body-text">{sec.body}</p></div>;
    case "highlight": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><div className="highlight-box">{sec.text}</div></div>;
    case "tabs": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><TabbedContent tabs={sec.tabs} /></div>;
    case "flashcards": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><Flashcards cards={sec.cards} /></div>;
    case "steps": return (
      <div className="section">
        <h2 className="section-heading">{sec.heading}</h2>
        <div className="steps-grid">
          {sec.steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-icon-wrap">{s.icon}</div>
              <div className="step-num-label">Step {i + 1}</div>
              <div className="step-name">{s.label}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
    case "interactive-boolean": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><BooleanDemo /></div>;
    case "craap": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><CRAAPTest /></div>;
    case "comparison": return (
      <div className="section">
        <h2 className="section-heading">{sec.heading}</h2>
        <div className="compare-grid">
          {[sec.left, sec.right].map((col, ci) => (
            <div key={ci} className="compare-col">
              <div className="compare-label" style={{ color: col.color, background: col.color + "18" }}>{col.label}</div>
              <ul className="compare-list">
                {col.points.map((p, pi) => (
                  <li key={pi}><span className="compare-dot" style={{ color: col.color }}>●</span>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
    case "sampling-explorer": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><SamplingExplorer /></div>;
    case "checklist": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><ChecklistInteractive items={sec.items} /></div>;
    case "stats-calculator": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><StatsCalculator /></div>;
    case "chart-builder": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><ChartBuilder /></div>;
    case "thesis-structure": return <div className="section"><h2 className="section-heading">Standard Thesis Structure</h2><ThesisStructure /></div>;
    case "defense-prep": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><DefensePrep /></div>;
    default: return null;
  }
}

// ─── QUIZ ────────────────────────────────────────────────────────────────────
function Quiz({ chapter, answers, submitted, chColor, onSelect, onSubmit, onReset }) {
  const total = chapter.quiz.length;
  const answered = Object.keys(answers).length;
  const LETTERS = ["A", "B", "C", "D"];
  let banner = null;
  if (submitted) {
    const correct = chapter.quiz.filter((q, i) => answers[i] === q.ans).length;
    const pct = Math.round((correct / total) * 100);
    const cls = pct >= 75 ? "pass" : pct >= 50 ? "partial" : "fail";
    banner = (
      <div className={`result-banner ${cls}`}>
        {pct >= 75 ? "🏆" : pct >= 50 ? "📊" : "🔄"}&nbsp;
        Score: {correct}/{total} ({pct}%){pct >= 75 ? " — Lesson complete!" : pct >= 50 ? " — Almost there! Try again." : " — Review the lesson and retry."}
      </div>
    );
  }
  return (
    <div className="quiz-zone">
      <div className="quiz-hdr">
        <div className="quiz-icon-box" style={{ background: chColor + "22" }}>✏️</div>
        <div>
          <div className="quiz-meta-title">Lesson Quiz</div>
          <div className="quiz-meta-sub">{submitted ? "Submitted — review your results below" : "Answer all questions, then click Submit"}</div>
        </div>
        <div className="quiz-badge">{total} Questions</div>
      </div>
      {chapter.quiz.map((q, qi) => {
        const sel = answers[qi];
        return (
          <div key={qi} className="q-block">
            <div className="q-text"><span className="q-num" style={{ color: chColor }}>Q{qi + 1}. </span>{q.q}</div>
            <div className="options">
              {q.opts.map((opt, oi) => {
                let cls = "opt";
                if (submitted) { cls += " disabled"; if (oi === q.ans) cls += " correct"; else if (oi === sel && sel !== q.ans) cls += " wrong"; }
                else if (sel === oi) cls += " selected";
                return (
                  <div key={oi} className={cls} onClick={() => !submitted && onSelect(qi, oi)}>
                    <div className="opt-letter">{LETTERS[oi]}</div>{opt}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="quiz-actions">
        {!submitted
          ? <>
            <button className="btn btn-primary" disabled={answered < total} onClick={onSubmit}>Submit Quiz</button>
            <button className="btn btn-ghost" onClick={onReset}>Reset</button>
            {answered < total && <span style={{ fontSize: 12, color: "var(--muted)" }}>{answered}/{total} answered</span>}
          </>
          : <button className="btn btn-ghost" onClick={onReset}>Retake Quiz</button>}
        {banner}
      </div>
    </div>
  );
}

// ─── SEARCH ──────────────────────────────────────────────────────────────────
function buildIndex() {
  const idx = [];
  CHAPTERS.forEach(ch => {
    ch.sections.forEach(sec => {
      const text = [sec.heading, sec.body, sec.text,
      sec.tabs?.map(t => t.content).join(" "),
      sec.steps?.map(s => `${s.label} ${s.desc}`).join(" "),
      sec.cards?.map(c => `${c.term} ${c.def}`).join(" "),
      sec.items?.map(i => `${i.label} ${i.desc}`).join(" "),
      ].filter(Boolean).join(" ");
      if (text.trim()) idx.push({ chId: ch.id, chTitle: ch.title, tag: ch.tag, heading: sec.heading || "", text });
    });
    ch.quiz.forEach(q => idx.push({ chId: ch.id, chTitle: ch.title, tag: ch.tag, heading: "Quiz", text: `${q.q} ${q.opts.join(" ")}` }));
    ch.downloads.forEach(d => idx.push({ chId: ch.id, chTitle: ch.title, tag: ch.tag, heading: "Downloads", text: d.name }));
  });
  return idx;
}
const SEARCH_INDEX = buildIndex();

function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(item => item.text.toLowerCase().includes(q)).slice(0, 7);
  }, [query]);

  return (
    <div className="topbar-search" ref={ref}>
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        placeholder="Search lessons, topics, terms…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && query.length >= 2 && (
        <div className="search-results">
          {results.length === 0
            ? <div className="search-empty">No results for "{query}"</div>
            : results.map((r, i) => (
              <div key={i} className="search-result-item" onClick={() => { onNavigate(r.chId); setQuery(""); setOpen(false); }}>
                <div className="sri-lesson">{r.tag} — {r.chTitle}</div>
                <div className="sri-title">{r.heading}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── CHAPTER VIEW ─────────────────────────────────────────────────────────────
function ChapterView({ chapter, answers, submitted, onSelect, onSubmit, onReset, onNavigate, chapters }) {
  const [showObj, setShowObj] = useState(false);
  return (
    <div className="content-inner">
      <div className="ch-header">
        <div className="ch-breadcrumb">
          <span>📘 Research Manual</span><span>›</span><span>{chapter.tag}</span>
        </div>
        <div className="ch-tag" style={{ color: chapter.color, background: chapter.colorLight, border: `1px solid ${chapter.color}33` }}>
          {chapter.icon} {chapter.tag}
        </div>
        <h1 className="ch-title">{chapter.title}</h1>
        <p className="ch-subtitle">{chapter.subtitle}</p>
        <div className="ch-meta-bar">
          <span className="ch-meta-item">⏱ {chapter.estimatedTime}</span>
          <span className="ch-meta-item">✏️ {chapter.quiz.length} quiz questions</span>
          <span className="ch-meta-item">📥 {chapter.downloads.length} downloads</span>
          <span className="ch-obj-toggle" onClick={() => setShowObj(o => !o)}>
            🎯 Learning Objectives {showObj ? "▲" : "▼"}
          </span>
        </div>
        {showObj && (
          <div className="objectives-box">
            <div className="obj-title">By the end of this lesson, you will be able to:</div>
            <ul className="obj-list">{chapter.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
          </div>
        )}
      </div>

      <div className="divider" />

      {chapter.sections.map((sec, i) => <Section key={i} sec={sec} />)}

      <div className="divider" />

      <div className="downloads-section">
        <div className="downloads-title">📥 Downloadable Resources</div>
        <div className="downloads-grid">
          {chapter.downloads.map((dl, i) => (
            <div key={i} className="dl-card" onClick={() => downloadFile(dl.content, dl.filename)}>
              <div className="dl-icon">{dl.icon}</div>
              <div className="dl-info">
                <div className="dl-name">{dl.name}</div>
                <div className="dl-meta">{dl.type} · {dl.size}</div>
              </div>
              <div className="dl-btn">↓ Save</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <Quiz chapter={chapter} answers={answers} submitted={submitted} chColor={chapter.color}
        onSelect={onSelect} onSubmit={onSubmit} onReset={onReset} />

      <div className="chapter-nav">
        {chapter.id > 0
          ? <button className="cnav-btn" onClick={() => onNavigate(chapter.id - 1)}>
            <div><div className="cnav-dir">← Previous</div><div className="cnav-title">{chapters[chapter.id - 1].title}</div></div>
          </button>
          : <div />}
        {chapter.id < chapters.length - 1
          ? <button className="cnav-btn cnav-right" onClick={() => onNavigate(chapter.id + 1)}>
            <div><div className="cnav-dir">Next →</div><div className="cnav-title">{chapters[chapter.id + 1].title}</div></div>
          </button>
          : <div />}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function WebManual() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const ch = CHAPTERS[current];
  const chAns = answers[current] || {};
  const chSub = !!submitted[current];
  const pct = Math.round((completed.size / CHAPTERS.length) * 100);

  const navigate = useCallback((id) => {
    setCurrent(id);
    setShowSummary(false);
    document.querySelector(".content-area")?.scrollTo(0, 0);
  }, []);

  const handleSelect = useCallback((qi, oi) => {
    setAnswers(prev => ({ ...prev, [current]: { ...(prev[current] || {}), [qi]: oi } }));
  }, [current]);

  const handleSubmit = useCallback(() => {
    const quiz = CHAPTERS[current].quiz;
    const ans = answers[current] || {};
    const correct = quiz.filter((q, i) => ans[i] === q.ans).length;
    setSubmitted(prev => ({ ...prev, [current]: true }));
    if (Math.round((correct / quiz.length) * 100) >= 75) {
      setCompleted(prev => {
        const n = new Set(prev);
        n.add(current);
        if (n.size === CHAPTERS.length) setTimeout(() => setShowSummary(true), 300);
        return n;
      });
    }
  }, [current, answers]);

  const handleReset = useCallback(() => {
    setAnswers(prev => { const n = { ...prev }; delete n[current]; return n; });
    setSubmitted(prev => { const n = { ...prev }; delete n[current]; return n; });
    setCompleted(prev => { const n = new Set(prev); n.delete(current); return n; });
    setShowSummary(false);
  }, [current]);

  return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="topbar">
          <div className="logo">
            <div className="logo-icon">📘</div>
            <span className="logo-text">Research<span>Manual</span></span>
          </div>
          <SearchBar onNavigate={navigate} />
          <div className="topbar-right">
            <div className="progress-wrap">
              <span className="progress-label">Progress</span>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <span className="progress-pct">{pct}%</span>
            </div>
          </div>
        </div>

        <div className="app-body">
          <nav className="sidebar">
            <div className="sidebar-section-label">Lessons</div>
            {CHAPTERS.map(c => (
              <div key={c.id}
                className={`nav-item${current === c.id ? " active" : ""}${completed.has(c.id) ? " completed" : ""}`}
                onClick={() => navigate(c.id)}>
                <div className="nav-num" style={current === c.id ? { background: c.color } : {}}>
                  {completed.has(c.id) ? "✓" : c.id + 1}
                </div>
                <div className="nav-texts">
                  <div className="nav-tag">{c.tag}</div>
                  <div className="nav-title">{c.title}</div>
                </div>
                {completed.has(c.id) && <span className="nav-done-icon">✔</span>}
              </div>
            ))}
            <div className="sidebar-divider" />
            <div className="sidebar-progress-label">Your Progress</div>
            <div className="sidebar-progress-track">
              <div className="sidebar-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="sidebar-progress-text">{completed.size} of {CHAPTERS.length} lessons complete</div>
          </nav>

          <div className="content-area">
            {showSummary ? (
              <div className="content-inner">
                <div className="summary">
                  <span className="summary-trophy">🎓</span>
                  <h1 className="summary-title">Congratulations!</h1>
                  <p className="summary-sub">You have successfully completed all 5 lessons of the Research Manual. You are now equipped to tackle your thesis with confidence.</p>
                  <div className="summary-stats">
                    <div className="sum-stat"><div className="sum-val">5</div><div className="sum-label">Lessons Done</div></div>
                    <div className="sum-stat"><div className="sum-val">100%</div><div className="sum-label">Complete</div></div>
                    <div className="sum-stat"><div className="sum-val">20</div><div className="sum-label">Quiz Questions</div></div>
                  </div>
                  <button className="btn btn-primary" onClick={() => { setCompleted(new Set()); setAnswers({}); setSubmitted({}); setCurrent(0); setShowSummary(false); }}>
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <ChapterView chapter={ch} answers={chAns} submitted={chSub}
                onSelect={handleSelect} onSubmit={handleSubmit} onReset={handleReset}
                onNavigate={navigate} chapters={CHAPTERS} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}