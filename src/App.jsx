// ─── APP.JSX ──────────────────────────────────────────────────────────────────
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoginPage from "./Loginpage";
import RegisterPage from "./Registerpage";
import TeacherDashboard from "./Teacherdashboard";
import {
  onAuthChange,
  logoutUser,
  getProgress,
  saveProgress,
  resetProgress,
  getUserProfile,
  joinClass,
} from "./firebase";


// ─── CHAPTER DATA ─────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 0,
    title: "Introduction to Research",
    tag: "Lesson 1",
    icon: "🔬",
    color: "#16a34a",
    colorLight: "#dcfce7",
    subtitle: "Understand the foundations of academic research and the scientific method.",
    estimatedTime: "20 min",
    objectives: [
      "Define research and identify its key characteristics",
      "Distinguish between qualitative and quantitative research",
      "Understand the steps of the scientific method",
      "Identify primary and secondary sources",
    ],
    sections: [
      { heading: "What is Research?", body: "Research is a systematic process of collecting, analyzing, and interpreting information to increase understanding of a phenomenon. Academic research follows rigorous standards to ensure validity, reliability, and objectivity. It serves as the backbone of knowledge creation across all disciplines.", type: "text" },
      { heading: "Types of Research", type: "tabs", tabs: [{ label: "Quantitative", icon: "📊", content: "Quantitative research deals with numbers and measurable data. It tests hypotheses through statistical analysis and aims to produce generalizable results. Common methods include surveys, experiments, and longitudinal studies." }, { label: "Qualitative", icon: "💬", content: "Qualitative research explores phenomena through non-numerical data such as interviews, observations, and textual analysis. It seeks to understand meaning, context, and human experience in depth." }, { label: "Mixed Methods", icon: "🔀", content: "Mixed methods research combines both quantitative and qualitative approaches. This triangulation provides a more comprehensive understanding of a research problem by leveraging the strengths of both paradigms." }] },
      { heading: "The Scientific Method", type: "steps", steps: [{ label: "Observation", desc: "Identify a phenomenon or problem worth investigating.", icon: "👁️" }, { label: "Research Question", desc: "Formulate a clear, focused, and answerable question.", icon: "❓" }, { label: "Hypothesis", desc: "Propose a testable prediction based on prior knowledge.", icon: "💡" }, { label: "Data Collection", desc: "Gather evidence using appropriate instruments and methods.", icon: "📋" }, { label: "Analysis", desc: "Process and interpret the collected data systematically.", icon: "📈" }, { label: "Conclusion", desc: "Draw evidence-based conclusions and report findings.", icon: "✅" }] },
      { heading: "Key Terminology", type: "flashcards", cards: [{ term: "Variable", def: "Any characteristic, number, or quantity that can be measured or quantified." }, { term: "Hypothesis", def: "A testable prediction about the relationship between two or more variables." }, { term: "Validity", def: "The degree to which a study accurately reflects the concept being measured." }, { term: "Reliability", def: "The consistency of a measure; the ability to produce stable results over time." }, { term: "Bias", def: "Systematic error introduced into sampling or testing by selecting non-random data." }] },
      { heading: "Did You Know?", type: "highlight", text: "The word 'research' comes from the Middle French word 'recerche', meaning 'to go about seeking'. Modern academic research became formalized in the 19th century with the establishment of graduate programs in European universities." },
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
    color: "#0d9488",
    colorLight: "#ccfbf1",
    subtitle: "Learn how to locate, evaluate, and synthesize academic sources effectively.",
    estimatedTime: "25 min",
    objectives: [
      "Understand the purpose and structure of a literature review",
      "Apply Boolean operators to academic database searches",
      "Evaluate source credibility using the CRAAP test",
      "Synthesize multiple sources into a coherent review",
    ],
    sections: [
      { heading: "Purpose of a Literature Review", body: "A literature review maps the existing knowledge landscape around your research topic. It demonstrates your familiarity with the field, identifies research gaps, and situates your study within the broader academic conversation. A strong literature review is not merely a summary — it synthesizes, analyzes, and critiques existing work.", type: "text" },
      { heading: "Search Strategy: Boolean Operators", type: "interactive-boolean" },
      { heading: "Evaluating Sources: The CRAAP Test", type: "craap" },
      { heading: "Synthesis vs. Summary", type: "comparison", left: { label: "Summary ✗", color: "#dc2626", points: ["Describes each source separately", "Repeats what each author says", "No connection between sources", "Reads like an annotated bibliography"] }, right: { label: "Synthesis ✓", color: "#16a34a", points: ["Groups sources by theme or argument", "Shows agreements and contradictions", "Connects ideas across multiple sources", "Builds toward your research question"] } },
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
    color: "#2563eb",
    colorLight: "#dbeafe",
    subtitle: "Design a rigorous research framework with appropriate methods and instruments.",
    estimatedTime: "30 min",
    objectives: [
      "Distinguish between research design, method, and methodology",
      "Select appropriate data collection instruments",
      "Understand sampling techniques and their trade-offs",
      "Identify ethical considerations in research",
    ],
    sections: [
      { heading: "Research Design Framework", body: "Research methodology is the overarching strategy that guides how you collect, analyze, and interpret data. It answers the 'why' behind your methodological choices. The research design is the blueprint — it specifies the structure of the investigation and aligns your research questions with your methods.", type: "text" },
      { heading: "Sampling Techniques", type: "sampling-explorer" },
      { heading: "Data Collection Instruments", type: "tabs", tabs: [{ label: "Surveys", icon: "📋", content: "Surveys gather self-reported data from a large number of respondents. They are cost-effective and allow for broad generalization. Likert scales, multiple choice, and open-ended formats each have distinct advantages." }, { label: "Interviews", icon: "🎤", content: "Interviews allow in-depth exploration of participant perspectives. Structured interviews use fixed questions; semi-structured allow flexibility; unstructured are open-ended. Choose based on how much standardization your research requires." }, { label: "Observation", icon: "👁️", content: "Observational methods study behavior in natural settings. Participant observation involves immersion in the group; non-participant observation maintains distance. Used extensively in ethnographic and sociological research." }, { label: "Documents", icon: "📂", content: "Document analysis examines existing materials such as official records, reports, and media. It is useful when primary data collection is impractical and can corroborate findings from other methods." }] },
      { heading: "Research Ethics Checklist", type: "checklist", items: [{ label: "Informed Consent", desc: "Participants must be fully informed and voluntarily agree to participate." }, { label: "Confidentiality", desc: "Personal data must be protected and identities kept anonymous where required." }, { label: "No Harm Principle", desc: "Research must not cause physical or psychological harm to participants." }, { label: "Right to Withdraw", desc: "Participants may exit the study at any time without penalty." }, { label: "Data Integrity", desc: "All data must be collected, stored, and reported accurately and honestly." }, { label: "IRB/Ethics Approval", desc: "Studies involving human subjects require institutional review board approval." }] },
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
    color: "#7c3aed",
    colorLight: "#ede9fe",
    subtitle: "Master techniques to analyze, interpret, and present your research findings.",
    estimatedTime: "35 min",
    objectives: [
      "Distinguish between descriptive and inferential statistics",
      "Identify appropriate statistical tests for different data types",
      "Apply coding techniques for qualitative analysis",
      "Create effective data visualizations",
    ],
    sections: [
      { heading: "Quantitative Analysis Overview", body: "Quantitative data analysis transforms raw numbers into meaningful insights. Descriptive statistics summarize what the data shows; inferential statistics allow you to draw conclusions and make predictions about populations from samples. Choosing the right statistical test depends on your research design, the number of variables, and the level of measurement.", type: "text" },
      { heading: "Descriptive Statistics Calculator", type: "stats-calculator" },
      { heading: "Choosing the Right Statistical Test", type: "tabs", tabs: [{ label: "Comparing Groups", icon: "📊", content: "T-test: Compare means of two groups. ANOVA: Compare means of three or more groups. Chi-square: Compare categorical data across groups. Mann-Whitney U: Non-parametric alternative to t-test when data is not normally distributed." }, { label: "Relationships", icon: "🔗", content: "Pearson Correlation: Linear relationship between two continuous variables. Spearman Correlation: Non-parametric correlation for ranked data. Simple Linear Regression: Predict one variable from another. Multiple Regression: Predict from multiple independent variables." }, { label: "Qualitative Coding", icon: "🏷️", content: "Open Coding: Break data into discrete parts and assign labels. Axial Coding: Identify relationships between categories. Selective Coding: Integrate categories around a core theme. Member Checking: Verify interpretations with participants for credibility." }] },
      { heading: "Chart Builder", type: "chart-builder" },
    ],
    downloads: [
      { name: "Statistical Test Guide", type: "TXT", size: "2 KB", icon: "📄", content: "STATISTICAL TEST SELECTION GUIDE\n\nCOMPARING TWO GROUPS:\n- Independent t-test: Different participants, normal distribution\n- Paired t-test: Same participants measured twice\n- Mann-Whitney U: Non-parametric, not normally distributed\n\nCOMPARING 3+ GROUPS:\n- One-way ANOVA: One independent variable\n- Two-way ANOVA: Two independent variables\n- Kruskal-Wallis: Non-parametric ANOVA\n\nRELATIONSHIPS:\n- Pearson r: Both variables continuous, linear\n- Spearman rho: Ordinal data or non-linear\n- Chi-square: Both variables categorical", filename: "Statistical_Test_Guide.txt" },
      { name: "Data Analysis Checklist", type: "TXT", size: "1 KB", icon: "📝", content: "DATA ANALYSIS CHECKLIST\n\nBEFORE ANALYSIS:\n[ ] Data cleaned and checked for errors\n[ ] Outliers identified and addressed\n[ ] Missing data handled\n[ ] Assumptions of chosen test verified\n\nDURING ANALYSIS:\n[ ] Correct statistical test applied\n[ ] Significance level set (p < 0.05)\n[ ] Effect size calculated\n[ ] Results recorded accurately\n\nAFTER ANALYSIS:\n[ ] Results interpreted in context\n[ ] Tables and figures labeled\n[ ] Findings linked to research questions", filename: "Data_Analysis_Checklist.txt" },
    ],
    quiz: [
      { q: "Which statistic measures the spread of data around the mean?", opts: ["Median", "Mode", "Standard Deviation", "Range only"], ans: 2 },
      { q: "When should you use a Chi-square test?", opts: ["Comparing means of two groups", "Comparing categorical data across groups", "Measuring correlation between continuous variables", "Predicting outcomes from multiple variables"], ans: 1 },
      { q: "What is 'open coding' in qualitative analysis?", opts: ["Keeping data confidential", "Breaking data into parts and assigning labels", "Using statistical software", "Selecting a random sample"], ans: 1 },
      { q: "Which chart type is best for showing proportions of a whole?", opts: ["Line chart", "Bar chart", "Pie chart", "Scatter plot"], ans: 2 },
    ],
  },
  {
    id: 4,
    title: "Writing & Defense",
    tag: "Lesson 5",
    icon: "✍️",
    color: "#b45309",
    colorLight: "#fef3c7",
    subtitle: "Write a compelling thesis and confidently defend your research before a panel.",
    estimatedTime: "40 min",
    objectives: [
      "Understand the standard structure of a research thesis",
      "Apply academic writing conventions and citation styles",
      "Prepare for common panel defense questions",
      "Develop a clear and compelling oral defense presentation",
    ],
    sections: [
      { heading: "Academic Writing Principles", body: "Academic writing is characterized by clarity, precision, objectivity, and evidence-based argumentation. Every claim must be supported by data or citations. Use formal language, avoid contractions, and maintain a consistent tense throughout each chapter. Your thesis should tell a coherent story from problem to conclusion.", type: "text" },
      { heading: "Standard Thesis Structure", type: "thesis-structure" },
      { heading: "Preparing for Your Defense", type: "defense-prep" },
      { heading: "Writing Tips", type: "highlight", text: "Start writing early — even rough drafts help. Write your methodology chapter first (it's the most concrete), then introduction last. Each paragraph should have one main idea: topic sentence → evidence → analysis → link to next idea." },
    ],
    downloads: [
      { name: "Thesis Writing Checklist", type: "TXT", size: "2 KB", icon: "📄", content: "THESIS WRITING CHECKLIST\n\nCHAPTER 1 - INTRODUCTION:\n[ ] Background clearly establishes the problem\n[ ] Research questions are specific and measurable\n[ ] Significance is argued convincingly\n[ ] Scope and limitations defined\n\nCHAPTER 2 - REVIEW OF LITERATURE:\n[ ] Sources are recent (within 10 years preferred)\n[ ] Synthesis, not just summary\n[ ] Theoretical/Conceptual framework present\n[ ] Gaps clearly identified\n\nCHAPTER 3 - METHODOLOGY:\n[ ] Research design justified\n[ ] Sampling procedure described\n[ ] Instrument validity established\n[ ] Ethical considerations addressed\n\nCHAPTER 4 - RESULTS:\n[ ] Tables and figures properly labeled\n[ ] Data answers each research question\n[ ] No interpretation yet — just findings\n\nCHAPTER 5 - CONCLUSIONS:\n[ ] Findings summarized clearly\n[ ] Conclusions drawn from evidence\n[ ] Recommendations are actionable", filename: "Thesis_Writing_Checklist.txt" },
      { name: "Defense Preparation Guide", type: "TXT", size: "1 KB", icon: "📝", content: "ORAL DEFENSE PREPARATION GUIDE\n\nBEFORE THE DEFENSE:\n[ ] Know your thesis inside-out\n[ ] Prepare a 10-15 minute overview presentation\n[ ] Anticipate panel questions\n[ ] Practice with peers or a mirror\n[ ] Prepare your materials and room setup\n\nDURING THE DEFENSE:\n- Speak clearly and at a moderate pace\n- It's okay to say 'That's a great question, let me think'\n- Refer to your data when challenged\n- Stay calm — you know this research best\n\nCOMMON PANEL QUESTIONS:\n1. Why is this study significant?\n2. Why did you choose this methodology?\n3. What are the limitations?\n4. How does this contribute to the field?\n5. What would you do differently?", filename: "Defense_Preparation_Guide.txt" },
    ],
    quiz: [
      { q: "In which chapter do you present raw findings WITHOUT interpretation?", opts: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"], ans: 3 },
      { q: "What should every body paragraph in academic writing contain?", opts: ["A personal opinion", "A topic sentence, evidence, and analysis", "Only direct quotes", "At least three citations"], ans: 1 },
      { q: "When a panel asks about your study's limitations, you should:", opts: ["Avoid answering", "Deny any limitations", "Be honest and frame them constructively", "Blame the methodology"], ans: 2 },
      { q: "The theoretical framework in Chapter 2 serves to:", opts: ["Replace the literature review", "Provide the conceptual basis for your study", "List all the books you read", "Summarize your findings"], ans: 1 },
    ],
  },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --accent:#16a34a; --accent2:#15803d; --accent-light:#dcfce7;
  --success:#16a34a; --danger:#dc2626;
  --bg:#f8faf8; --surface:#fff; --surface2:#f5fbf5;
  --border:#e2ede2; --text:#0d1f12; --muted:#6b9e72; --muted2:#aac4ab;
  --font-display:'Lora',Georgia,serif; --font-body:'Plus Jakarta Sans',sans-serif;
  --radius:10px; --radius-lg:14px; --radius-xl:18px;
  --shadow:0 1px 4px rgba(0,0,0,0.06); --shadow-md:0 4px 16px rgba(0,0,0,0.1);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;font-family:var(--font-body);background:var(--bg);color:var(--text);}
#root{height:100%;}

.app{display:flex;flex-direction:column;height:100vh;overflow:hidden;}

/* TOPBAR */
.topbar{
  height:58px;background:#0f2417;display:flex;align-items:center;
  padding:0 20px;gap:14px;flex-shrink:0;position:relative;z-index:100;
  box-shadow:0 2px 12px rgba(0,0,0,0.25);
}
.hamburger{display:none;}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.logo-icon{width:32px;height:32px;background:#16a34a;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(22,163,74,0.4);}
.logo-text{font-family:var(--font-display);font-size:18px;color:#fff;font-weight:700;}
.logo-text span{color:#86efac;}
.topbar-search{position:relative;flex:1;max-width:320px;margin:0 12px;}
.search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none;}
.search-input{width:100%;height:36px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:9px;padding:0 12px 0 34px;font-size:13px;color:#fff;outline:none;font-family:var(--font-body);}
.search-input::placeholder{color:rgba(255,255,255,0.4);}
.search-input:focus{background:rgba(255,255,255,0.15);border-color:rgba(134,239,172,0.4);}
.search-results{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.18);overflow:hidden;z-index:500;border:1px solid var(--border);}
.search-empty{padding:14px 16px;font-size:13px;color:var(--muted);text-align:center;}
.search-result-item{padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background 0.15s;}
.search-result-item:last-child{border-bottom:none;}
.search-result-item:hover{background:var(--surface2);}
.sri-lesson{font-size:11px;color:var(--muted);margin-bottom:2px;}
.sri-title{font-size:13px;font-weight:600;color:var(--text);}
.topbar-right{display:flex;align-items:center;gap:12px;margin-left:auto;}
.progress-wrap{display:flex;align-items:center;gap:8px;}
.progress-label{font-size:11px;color:rgba(255,255,255,0.5);}
.progress-track{width:80px;height:5px;background:rgba(255,255,255,0.15);border-radius:99px;overflow:hidden;}
.progress-fill{height:100%;background:#86efac;border-radius:99px;transition:width 0.4s;}
.progress-pct{font-size:11px;color:#86efac;font-weight:600;min-width:28px;}
.profile-wrap{position:relative;}
.user-pill{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:99px;padding:5px 12px 5px 5px;cursor:pointer;transition:all 0.15s;}
.user-pill:hover{background:rgba(255,255,255,0.16);}
.user-avatar{width:28px;height:28px;border-radius:50%;background:#16a34a;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.user-name{font-size:13px;color:#fff;font-weight:500;}
.user-chevron{font-size:10px;color:rgba(255,255,255,0.5);}
.profile-backdrop{position:fixed;inset:0;z-index:300;}
.profile-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,0.18);min-width:200px;z-index:400;overflow:hidden;border:1px solid var(--border);}
.profile-dropdown-header{display:flex;align-items:center;gap:12px;padding:16px;}
.profile-dropdown-avatar{width:40px;height:40px;border-radius:50%;background:#16a34a;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.profile-dropdown-name{font-size:14px;font-weight:600;color:var(--text);}
.profile-dropdown-role{font-size:12px;color:var(--muted);}
.profile-dropdown-divider{height:1px;background:var(--border);}
.profile-dropdown-signout{width:100%;padding:12px 16px;background:none;border:none;display:flex;align-items:center;gap:10px;font-size:13px;color:#dc2626;cursor:pointer;font-family:var(--font-body);font-weight:500;transition:background 0.15s;}
.profile-dropdown-signout:hover{background:#fee2e2;}

/* BODY */
.app-body{display:flex;flex:1;overflow:hidden;}
.sidebar-overlay{display:none;}

/* SIDEBAR */
.sidebar{
  width:240px;background:#0f2417;flex-shrink:0;
  display:flex;flex-direction:column;padding:16px 10px;
  overflow-y:auto;gap:2px;
}
.sidebar-section-label{font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;padding:4px 10px 10px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 10px;border-radius:10px;cursor:pointer;transition:all 0.15s;position:relative;}
.nav-item:hover{background:rgba(255,255,255,0.07);}
.nav-item.active{background:rgba(22,163,74,0.2);}
.nav-item.completed .nav-num{background:#16a34a !important;}
.nav-num{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.12);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s;}
.nav-texts{flex:1;min-width:0;}
.nav-tag{font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:1px;}
.nav-title{font-size:12.5px;color:rgba(255,255,255,0.85);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nav-item.active .nav-title{color:#fff;font-weight:600;}
.nav-done-icon{font-size:11px;color:#86efac;}
.sidebar-divider{height:1px;background:rgba(255,255,255,0.08);margin:12px 6px;}
.sidebar-progress-label{font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;padding:0 10px 6px;}
.sidebar-progress-track{height:4px;background:rgba(255,255,255,0.1);border-radius:99px;margin:0 10px;overflow:hidden;}
.sidebar-progress-fill{height:100%;background:#86efac;border-radius:99px;transition:width 0.4s;}
.sidebar-progress-text{font-size:11px;color:rgba(255,255,255,0.4);padding:6px 10px 0;}

/* CONTENT */
.content-area{flex:1;overflow-y:auto;background:var(--bg);}
.content-inner{max-width:820px;margin:0 auto;padding:32px 32px 64px;}

/* CHAPTER HEADER */
.ch-header{margin-bottom:24px;}
.ch-breadcrumb{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);margin-bottom:14px;}
.ch-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;margin-bottom:12px;letter-spacing:0.3px;}
.ch-title{font-family:var(--font-display);font-size:32px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:10px;}
.ch-subtitle{font-size:15px;color:var(--muted);line-height:1.6;margin-bottom:16px;}
.ch-meta-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.ch-meta-item{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:4px;}
.ch-obj-toggle{font-size:12px;color:var(--accent);cursor:pointer;font-weight:600;display:flex;align-items:center;gap:4px;}
.objectives-box{margin-top:14px;background:var(--accent-light);border:1px solid var(--accent)33;border-radius:var(--radius-lg);padding:16px 20px;}
.obj-title{font-size:12px;font-weight:600;color:var(--accent);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;}
.obj-list{list-style:none;display:flex;flex-direction:column;gap:6px;}
.obj-list li{font-size:13px;color:#14532d;display:flex;gap:8px;line-height:1.5;}
.obj-list li::before{content:'✓';color:var(--accent);font-weight:700;flex-shrink:0;}

/* DIVIDER */
.divider{height:1px;background:var(--border);margin:28px 0;}

/* SECTIONS */
.section{margin-bottom:28px;}
.section-heading{font-family:var(--font-display);font-size:21px;font-weight:700;color:var(--text);margin-bottom:14px;}
.body-text{font-size:15px;color:#1e3a24;line-height:1.75;}
.highlight-box{background:var(--accent-light);border-left:3px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;padding:16px 20px;font-size:14px;color:#14532d;line-height:1.7;}

/* TABS */
.tab-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.tab-btn{padding:7px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:13px;color:var(--muted);cursor:pointer;font-family:var(--font-body);font-weight:500;transition:all 0.15s;}
.tab-btn:hover{border-color:var(--accent);color:var(--accent);}
.tab-btn.active{background:var(--accent);color:#fff;border-color:var(--accent);}
.tab-content{font-size:14px;color:#1e3a24;line-height:1.75;background:var(--surface2);padding:16px 18px;border-radius:var(--radius-lg);border:1px solid var(--border);}

/* STEPS */
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.step-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 16px;text-align:center;box-shadow:var(--shadow);}
.step-icon-wrap{font-size:26px;margin-bottom:8px;}
.step-num-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;}
.step-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px;}
.step-desc{font-size:12px;color:var(--muted);line-height:1.5;}

/* FLASHCARDS */
.flashcard-wrap{height:160px;perspective:800px;cursor:pointer;margin-bottom:14px;}
.flashcard{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.5s;}
.flashcard.flipped{transform:rotateY(180deg);}
.fc-front,.fc-back{position:absolute;inset:0;border-radius:var(--radius-lg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;backface-visibility:hidden;border:1px solid var(--border);box-shadow:var(--shadow-md);}
.fc-front{background:var(--surface);}
.fc-back{background:var(--accent);transform:rotateY(180deg);}
.fc-hint{font-size:11px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;}
.fc-term{font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--text);}
.fc-def{font-size:14px;color:#fff;line-height:1.6;text-align:center;}
.fc-nav{display:flex;align-items:center;gap:12px;justify-content:center;}
.fc-nav-btn{padding:6px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:13px;color:var(--muted);cursor:pointer;font-family:var(--font-body);}
.fc-nav-btn:hover{border-color:var(--accent);color:var(--accent);}
.fc-counter{font-size:12px;color:var(--muted);}

/* BOOLEAN DEMO */
.bool-builder{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;margin-bottom:12px;}
.bool-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;}
.bool-input{height:36px;border:1.5px solid var(--border);border-radius:8px;padding:0 12px;font-size:14px;font-family:var(--font-body);color:var(--text);background:#fff;outline:none;min-width:100px;flex:1;}
.bool-input:focus{border-color:var(--accent);}
.bool-op{padding:6px 12px;border-radius:8px;border:1.5px solid var(--border);background:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font-body);color:var(--muted);transition:all 0.15s;}
.bool-op.active-op{border-color:var(--accent);background:var(--accent);color:#fff;}
.bool-result{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;font-size:14px;color:var(--muted);}
.bool-result span{color:var(--accent);font-weight:700;}

/* CRAAP */
.craap-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px;}
.craap-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:14px 10px;text-align:center;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
.craap-card:hover,.active-craap{transform:translateY(-2px);box-shadow:var(--shadow-md);}
.craap-letter{font-family:var(--font-display);font-size:28px;font-weight:700;margin-bottom:4px;}
.craap-name{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
.craap-detail{background:var(--surface2);border-radius:var(--radius);padding:14px 18px;font-size:14px;color:var(--text);line-height:1.6;}
.craap-hint{font-size:13px;color:var(--muted);text-align:center;padding:12px;}

/* COMPARISON */
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.compare-col{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;box-shadow:var(--shadow);}
.compare-label{font-size:13px;font-weight:700;padding:6px 14px;border-radius:6px;margin-bottom:14px;display:inline-block;}
.compare-list{list-style:none;display:flex;flex-direction:column;gap:8px;}
.compare-list li{font-size:13.5px;color:var(--text);display:flex;gap:8px;line-height:1.5;}
.compare-dot{flex-shrink:0;font-size:8px;margin-top:5px;}

/* SAMPLING */
.sampling-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;}
.sampling-card{background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-lg);padding:16px;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
.sampling-card:hover,.sampling-card.selected{border-color:var(--accent);box-shadow:var(--shadow-md);}
.sampling-card.selected{background:var(--accent-light);}
.sampling-card-type{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;}
.sampling-card-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px;}
.sampling-card-desc{font-size:12px;color:var(--muted);line-height:1.5;}
.sampling-detail{background:#f0fdf4;border:1px solid #86efac;border-radius:var(--radius-lg);padding:14px 18px;font-size:13.5px;color:#14532d;line-height:1.65;margin-top:2px;}

/* CHECKLIST */
.checklist{display:flex;flex-direction:column;gap:8px;}
.check-item{display:flex;align-items:flex-start;gap:12px;padding:13px 16px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-lg);cursor:pointer;transition:all 0.2s;}
.check-item:hover{border-color:var(--accent);}
.check-item.checked{background:var(--accent-light);border-color:var(--accent);}
.check-box{width:22px;height:22px;border-radius:7px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--accent);flex-shrink:0;transition:all 0.2s;}
.check-item.checked .check-box{background:var(--accent);border-color:var(--accent);color:#fff;}
.check-text-title{font-size:13.5px;font-weight:600;color:var(--text);margin-bottom:3px;}
.check-text-desc{font-size:12.5px;color:var(--muted);line-height:1.5;}
.check-progress{font-size:12px;color:var(--accent);font-weight:600;margin-bottom:10px;}

/* STATS */
.calc-zone{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;box-shadow:var(--shadow);}
.calc-label{font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;}
.calc-textarea{width:100%;min-height:52px;border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;font-family:var(--font-body);color:var(--text);background:var(--surface2);resize:vertical;outline:none;}
.calc-textarea:focus{border-color:var(--accent);}
.stats-results{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;}
.stat-box2{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;}
.stat-value2{font-size:22px;font-family:var(--font-display);font-weight:700;color:var(--accent);}
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

/* THESIS */
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
.thesis-ch-body li{font-size:13px;color:#1e3a24;display:flex;gap:8px;line-height:1.5;}
.thesis-ch-body li::before{content:'•';color:var(--muted2);flex-shrink:0;}

/* DEFENSE */
.defense-qa{display:flex;flex-direction:column;gap:10px;margin:14px 0;}
.defense-q{border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}
.defense-q-header{padding:13px 18px;background:var(--surface);cursor:pointer;font-size:14px;font-weight:500;color:var(--text);display:flex;justify-content:space-between;align-items:center;transition:background 0.15s;gap:12px;}
.defense-q-header:hover{background:var(--surface2);}
.defense-q-q{flex:1;}
.defense-q-arr{font-size:12px;color:var(--muted);flex-shrink:0;}
.defense-q-body{padding:13px 18px;background:#f0fdf4;border-top:1px solid var(--border);font-size:13px;color:#14532d;line-height:1.65;}

/* DOWNLOADS */
.downloads-section{margin:28px 0;}
.downloads-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;}
.downloads-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;}
.dl-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
.dl-card:hover{border-color:var(--accent);box-shadow:var(--shadow-md);transform:translateY(-1px);}
.dl-icon{font-size:28px;flex-shrink:0;}
.dl-info{flex:1;min-width:0;}
.dl-name{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.dl-meta{font-size:11px;color:var(--muted);margin-top:2px;}
.dl-btn{font-size:11px;font-weight:600;color:#fff;background:var(--accent);padding:5px 10px;border-radius:6px;flex-shrink:0;white-space:nowrap;}

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
.opt:hover{border-color:var(--accent);background:var(--accent-light);}
.opt.selected{border-color:var(--accent);background:var(--accent-light);font-weight:500;}
.opt.correct{border-color:var(--success);background:rgba(22,163,74,0.07);color:#14532d;}
.opt.wrong{border-color:var(--danger);background:rgba(220,38,38,0.07);color:#7f1d1d;}
.opt.disabled{cursor:default;}
.opt-letter{width:26px;height:26px;border-radius:7px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--muted);flex-shrink:0;transition:all 0.15s;}
.opt.selected .opt-letter{background:var(--accent);color:#fff;}
.opt.correct .opt-letter{background:var(--success);color:#fff;}
.opt.wrong .opt-letter{background:var(--danger);color:#fff;}
.quiz-actions{display:flex;align-items:center;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid var(--border);flex-wrap:wrap;}
.result-banner{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:var(--radius);font-size:13px;font-weight:500;}
.result-banner.pass{background:rgba(22,163,74,0.08);color:#14532d;border:1px solid rgba(22,163,74,0.2);}
.result-banner.partial{background:#fef3c7;color:#92400e;border:1px solid rgba(217,119,6,0.25);}
.result-banner.fail{background:#fee2e2;color:#991b1b;border:1px solid rgba(220,38,38,0.2);}

/* CHAPTER NAV */
.chapter-nav{display:flex;justify-content:space-between;gap:12px;margin-top:40px;padding-top:24px;border-top:1px solid var(--border);}
.cnav-btn{display:flex;align-items:center;gap:10px;padding:12px 18px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--surface);cursor:pointer;font-family:var(--font-body);transition:all 0.15s;box-shadow:var(--shadow);flex:1;max-width:48%;}
.cnav-btn:hover{border-color:var(--accent);}
.cnav-dir{font-size:11px;color:var(--muted);}
.cnav-title{font-size:13px;font-weight:600;color:var(--text);}
.cnav-right{text-align:right;justify-content:flex-end;}

/* BUTTONS */
.btn{padding:9px 20px;border-radius:var(--radius);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font-body);border:none;transition:all 0.15s;}
.btn-primary{background:var(--accent);color:#fff;}
.btn-primary:hover{background:var(--accent2);transform:translateY(-1px);box-shadow:0 4px 12px rgba(22,163,74,0.35);}
.btn-primary:disabled{background:#86efac;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border);}
.btn-ghost:hover{background:var(--surface2);color:var(--text);}
.btn-sm{padding:6px 14px;font-size:12px;}

/* SUMMARY */
.summary{text-align:center;padding:48px 20px;}
.summary-trophy{font-size:72px;display:block;margin-bottom:16px;}
.summary-title{font-family:var(--font-display);font-size:38px;font-weight:700;margin-bottom:8px;}
.summary-sub{font-size:15px;color:var(--muted);margin-bottom:36px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.65;}
.summary-stats{display:flex;gap:16px;justify-content:center;margin-bottom:36px;flex-wrap:wrap;}
.sum-stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:24px 36px;box-shadow:var(--shadow-md);}
.sum-val{font-family:var(--font-display);font-size:36px;font-weight:700;color:var(--accent);}
.sum-label{font-size:12px;color:var(--muted);margin-top:4px;}

/* LOADING */
.loading-screen{display:flex;align-items:center;justify-content:center;height:100vh;background:#0f2417;flex-direction:column;gap:16px;}
.loading-icon{font-size:48px;animation:spin 2s linear infinite;}
.loading-text{font-family:'Lora',Georgia,serif;font-size:18px;color:#86efac;}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

/* RESPONSIVE */
@media(max-width:768px){
  .topbar{padding:0 14px;gap:10px;height:52px;}
  .logo-text{font-size:16px;}
  .topbar-search{max-width:none;flex:1;margin:0 8px;}
  .progress-wrap{display:none;}
  .user-name{display:none;}
  .user-chevron{display:none;}
  .app-body{position:relative;}
  .sidebar{position:fixed;top:52px;left:0;bottom:0;width:260px;z-index:200;transform:translateX(-100%);transition:transform 0.28s cubic-bezier(.4,0,.2,1);}
  .sidebar.open{transform:translateX(0);}
  .sidebar-overlay{display:none;position:fixed;inset:0;top:52px;background:rgba(0,0,0,0.45);z-index:199;}
  .sidebar-overlay.visible{display:block;}
  .hamburger{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:none;background:rgba(255,255,255,0.08);color:#fff;font-size:18px;cursor:pointer;flex-shrink:0;transition:background 0.15s;}
  .hamburger:hover{background:rgba(255,255,255,0.14);}
  .content-inner{padding:22px 16px 56px;}
  .ch-title{font-size:26px;}
  .steps-grid{grid-template-columns:repeat(2,1fr);}
  .craap-grid{grid-template-columns:repeat(3,1fr);}
  .compare-grid{grid-template-columns:1fr;}
  .stats-results{grid-template-columns:repeat(2,1fr);}
  .sampling-grid{grid-template-columns:1fr;}
  .downloads-grid{grid-template-columns:1fr;}
  .quiz-zone{padding:20px 16px;}
  .chapter-nav{flex-direction:column;gap:8px;}
  .cnav-btn{max-width:100%;}
  .summary-title{font-size:28px;}
  .sum-stat{padding:18px 24px;}
}
@media(max-width:480px){
  .topbar{height:50px;padding:0 10px;gap:8px;}
  .content-inner{padding:16px 12px 56px;}
  .ch-title{font-size:22px;}
  .steps-grid{grid-template-columns:1fr;}
  .stats-results{grid-template-columns:repeat(2,1fr);}
  .quiz-zone{padding:16px 12px;}
  .summary{padding:32px 12px;}
  .summary-trophy{font-size:56px;}
  .summary-title{font-size:22px;}
}
@media(min-width:769px){
  .hamburger{display:none;}
  .sidebar-overlay{display:none !important;}
  .sidebar{transform:none !important;position:relative;top:auto;}
}
`;

// ─── UTILS ───────────────────────────────────────────────────────────────────
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ─── INTERACTIVE COMPONENTS ──────────────────────────────────────────────────
function Flashcards({ cards }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  return (
    <div>
      <div className="flashcard-wrap" onClick={() => setFlipped(f => !f)}>
        <div className={`flashcard${flipped ? " flipped" : ""}`}>
          <div className="fc-front"><div className="fc-hint">Click to flip</div><div className="fc-term">{cards[idx].term}</div></div>
          <div className="fc-back"><div className="fc-def">{cards[idx].def}</div></div>
        </div>
      </div>
      <div className="fc-nav">
        <button className="fc-nav-btn" onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }}>← Prev</button>
        <span className="fc-counter">{idx + 1} / {cards.length}</span>
        <button className="fc-nav-btn" onClick={() => { setIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); }}>Next →</button>
      </div>
    </div>
  );
}

function BooleanDemo() {
  const [t1, setT1] = useState("photosynthesis");
  const [t2, setT2] = useState("plants");
  const [op, setOp] = useState("AND");
  const preview = op === "AND" ? `"${t1}" AND "${t2}"` : op === "OR" ? `"${t1}" OR "${t2}"` : `"${t1}" NOT "${t2}"`;
  return (
    <div className="bool-builder">
      <div className="bool-row">
        <input className="bool-input" value={t1} onChange={e => setT1(e.target.value)} placeholder="Term 1" />
        {["AND", "OR", "NOT"].map(o => <button key={o} className={`bool-op${op === o ? " active-op" : ""}`} onClick={() => setOp(o)}>{o}</button>)}
        <input className="bool-input" value={t2} onChange={e => setT2(e.target.value)} placeholder="Term 2" />
      </div>
      <div className="bool-result">Search query: <span>{preview}</span></div>
    </div>
  );
}

const CRAAP_DATA = [
  { key: "C", letter: "C", name: "Currency", color: "#16a34a", desc: "When was the source published or last updated? Is the information current for your topic? Some fields require very recent sources (< 5 years); others accept older foundational works." },
  { key: "R", letter: "R", name: "Relevance", color: "#0d9488", desc: "Does the source directly relate to your research question? Is it written at an appropriate level? Would you feel comfortable using this source in your thesis?" },
  { key: "A", letter: "A", name: "Authority", color: "#2563eb", desc: "Who is the author or publisher? What are their credentials? Is it peer-reviewed? Is the publisher a reputable academic institution or journal?" },
  { key: "AC", letter: "A", name: "Accuracy", color: "#7c3aed", desc: "Is the information supported by evidence? Are sources cited? Can you verify the data elsewhere? Has the source been reviewed by experts in the field?" },
  { key: "P", letter: "P", name: "Purpose", color: "#b45309", desc: "Why was this source created? To inform, persuade, sell, or entertain? Is the author's intent clear? Is there potential bias or conflict of interest?" },
];

function CRAAPTest() {
  const [active, setActive] = useState(null);
  return (
    <div>
      <div className="craap-grid">
        {CRAAP_DATA.map(d => (
          <div key={d.key} className={`craap-card${active === d.key ? " active-craap" : ""}`}
            style={{ borderColor: active === d.key ? d.color : "", borderWidth: active === d.key ? 2 : 1 }}
            onClick={() => setActive(active === d.key ? null : d.key)}>
            <div className="craap-letter" style={{ color: d.color }}>{d.letter}</div>
            <div className="craap-name">{d.name}</div>
          </div>
        ))}
      </div>
      {active
        ? (() => { const d = CRAAP_DATA.find(x => x.key === active); return <div className="craap-detail" style={{ borderLeft: `3px solid ${d.color}` }}><strong style={{ color: d.color }}>{d.name}: </strong>{d.desc}</div>; })()
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
      {sel !== null && <div className="sampling-detail"><strong>When to use {SAMPLING_DATA[sel].name} Sampling: </strong>{SAMPLING_DATA[sel].detail}</div>}
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
  "Species Distribution": [{ l: "Flora A", v: 38 }, { l: "Flora B", v: 27 }, { l: "Flora C", v: 19 }, { l: "Flora D", v: 16 }],
  "Sample by Grade": [{ l: "Grade 7", v: 30 }, { l: "Grade 8", v: 25 }, { l: "Grade 9", v: 22 }, { l: "Grade 10", v: 23 }],
  "Research Methods": [{ l: "Survey", v: 55 }, { l: "Interview", v: 25 }, { l: "Observation", v: 12 }, { l: "Mixed", v: 8 }],
};
const CHART_COLORS = ["#16a34a", "#0d9488", "#2563eb", "#7c3aed", "#b45309"];

function ChartBuilder() {
  const [dataset, setDataset] = useState("Survey Responses");
  const data = CHART_DATASETS[dataset];
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="chart-zone">
      <div className="chart-controls">
        <div><div className="calc-label">Select Dataset</div>
          <select className="chart-select" value={dataset} onChange={e => setDataset(e.target.value)}>
            {Object.keys(CHART_DATASETS).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)", paddingBottom: 2 }}>n = {data.reduce((a, b) => a + b.v, 0)} total</span>
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
  { num: 1, title: "Introduction", color: "#16a34a", items: ["Background of the Study", "Statement of the Problem", "Research Objectives", "Significance of the Study", "Scope and Delimitation", "Definition of Terms"] },
  { num: 2, title: "Review of Related Literature", color: "#0d9488", items: ["Thematically organized RRL", "Theoretical Framework", "Conceptual Framework", "Synthesis of Literature"] },
  { num: 3, title: "Methodology", color: "#2563eb", items: ["Research Design", "Research Locale", "Respondents / Participants", "Sampling Procedure", "Research Instrument", "Data Gathering Procedure", "Statistical Treatment"] },
  { num: 4, title: "Results and Discussion", color: "#7c3aed", items: ["Findings per research question", "Statistical tables and figures", "Discussion in relation to RRL", "Interpretation of results"] },
  { num: 5, title: "Conclusions & Recommendations", color: "#b45309", items: ["Summary of Findings", "Conclusions", "Recommendations", "References", "Appendices"] },
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
          {open === ch.num && <div className="thesis-ch-body"><ul>{ch.items.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
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
        {tabs.map((t, i) => <button key={i} className={`tab-btn${active === i ? " active" : ""}`} onClick={() => setActive(i)}>{t.icon} {t.label}</button>)}
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
            <div><div className="check-text-title">{item.label}</div><div className="check-text-desc">{item.desc}</div></div>
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
    case "steps": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><div className="steps-grid">{sec.steps.map((s, i) => <div key={i} className="step-card"><div className="step-icon-wrap">{s.icon}</div><div className="step-num-label">Step {i + 1}</div><div className="step-name">{s.label}</div><div className="step-desc">{s.desc}</div></div>)}</div></div>;
    case "interactive-boolean": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><BooleanDemo /></div>;
    case "craap": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><CRAAPTest /></div>;
    case "comparison": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><div className="compare-grid">{[sec.left, sec.right].map((col, ci) => <div key={ci} className="compare-col"><div className="compare-label" style={{ color: col.color, background: col.color + "18" }}>{col.label}</div><ul className="compare-list">{col.points.map((p, pi) => <li key={pi}><span className="compare-dot" style={{ color: col.color }}>●</span>{p}</li>)}</ul></div>)}</div></div>;
    case "sampling-explorer": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><SamplingExplorer /></div>;
    case "checklist": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><ChecklistInteractive items={sec.items} /></div>;
    case "stats-calculator": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><StatsCalculator /></div>;
    case "chart-builder": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><ChartBuilder /></div>;
    case "thesis-structure": return <div className="section"><h2 className="section-heading">Standard Thesis Structure</h2><ThesisStructure /></div>;
    case "defense-prep": return <div className="section"><h2 className="section-heading">{sec.heading}</h2><DefensePrep /></div>;
    default: return null;
  }
}

function Quiz({ chapter, answers, submitted, chColor, onSelect, onSubmit, onReset }) {
  const total = chapter.quiz.length;
  const answered = Object.keys(answers).length;
  const LETTERS = ["A", "B", "C", "D"];
  let banner = null;
  if (submitted) {
    const correct = chapter.quiz.filter((q, i) => answers[i] === q.ans).length;
    const pct = Math.round((correct / total) * 100);
    const cls = pct >= 75 ? "pass" : pct >= 50 ? "partial" : "fail";
    banner = <div className={`result-banner ${cls}`}>{pct >= 75 ? "🏆" : pct >= 50 ? "📊" : "🔄"}&nbsp;Score: {correct}/{total} ({pct}%){pct >= 75 ? " — Lesson complete!" : pct >= 50 ? " — Almost there! Try again." : " — Review the lesson and retry."}</div>;
  }
  return (
    <div className="quiz-zone">
      <div className="quiz-hdr">
        <div className="quiz-icon-box" style={{ background: chColor + "22" }}>✏️</div>
        <div><div className="quiz-meta-title">Lesson Quiz</div><div className="quiz-meta-sub">{submitted ? "Submitted — review your results below" : "Answer all questions, then click Submit"}</div></div>
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
                return <div key={oi} className={cls} onClick={() => !submitted && onSelect(qi, oi)}><div className="opt-letter">{LETTERS[oi]}</div>{opt}</div>;
              })}
            </div>
          </div>
        );
      })}
      <div className="quiz-actions">
        {!submitted
          ? <><button className="btn btn-primary" disabled={answered < total} onClick={onSubmit}>Submit Quiz</button><button className="btn btn-ghost" onClick={onReset}>Reset</button>{answered < total && <span style={{ fontSize: 12, color: "var(--muted)" }}>{answered}/{total} answered</span>}</>
          : <button className="btn btn-ghost" onClick={onReset}>Retake Quiz</button>}
        {banner}
      </div>
    </div>
  );
}

function buildIndex() {
  const idx = [];
  CHAPTERS.forEach(ch => {
    ch.sections.forEach(sec => {
      const text = [sec.heading, sec.body, sec.text, sec.tabs?.map(t => t.content).join(" "), sec.steps?.map(s => `${s.label} ${s.desc}`).join(" "), sec.cards?.map(c => `${c.term} ${c.def}`).join(" "), sec.items?.map(i => `${i.label} ${i.desc}`).join(" ")].filter(Boolean).join(" ");
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
      <input className="search-input" placeholder="Search lessons, topics, terms…" value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      {open && query.length >= 2 && (
        <div className="search-results">
          {results.length === 0
            ? <div className="search-empty">No results for "{query}"</div>
            : results.map((r, i) => <div key={i} className="search-result-item" onClick={() => { onNavigate(r.chId); setQuery(""); setOpen(false); }}><div className="sri-lesson">{r.tag} — {r.chTitle}</div><div className="sri-title">{r.heading}</div></div>)}
        </div>
      )}
    </div>
  );
}

function ChapterView({ chapter, answers, submitted, onSelect, onSubmit, onReset, onNavigate, chapters }) {
  const [showObj, setShowObj] = useState(false);
  return (
    <div className="content-inner">
      <div className="ch-header">
        <div className="ch-breadcrumb"><span>🧬 BioResearch Manual</span><span>›</span><span>{chapter.tag}</span></div>
        <div className="ch-tag" style={{ color: chapter.color, background: chapter.colorLight, border: `1px solid ${chapter.color}33` }}>{chapter.icon} {chapter.tag}</div>
        <h1 className="ch-title">{chapter.title}</h1>
        <p className="ch-subtitle">{chapter.subtitle}</p>
        <div className="ch-meta-bar">
          <span className="ch-meta-item">⏱ {chapter.estimatedTime}</span>
          <span className="ch-meta-item">✏️ {chapter.quiz.length} quiz questions</span>
          <span className="ch-meta-item">📥 {chapter.downloads.length} downloads</span>
          <span className="ch-obj-toggle" onClick={() => setShowObj(o => !o)}>🎯 Learning Objectives {showObj ? "▲" : "▼"}</span>
        </div>
        {showObj && <div className="objectives-box"><div className="obj-title">By the end of this lesson, you will be able to:</div><ul className="obj-list">{chapter.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></div>}
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
              <div className="dl-info"><div className="dl-name">{dl.name}</div><div className="dl-meta">{dl.type} · {dl.size}</div></div>
              <div className="dl-btn">↓ Save</div>
            </div>
          ))}
        </div>
      </div>
      <div className="divider" />
      <Quiz chapter={chapter} answers={answers} submitted={submitted} chColor={chapter.color} onSelect={onSelect} onSubmit={onSubmit} onReset={onReset} />
      <div className="chapter-nav">
        {chapter.id > 0 ? <button className="cnav-btn" onClick={() => onNavigate(chapter.id - 1)}><div><div className="cnav-dir">← Previous</div><div className="cnav-title">{chapters[chapter.id - 1].title}</div></div></button> : <div />}
        {chapter.id < chapters.length - 1 ? <button className="cnav-btn cnav-right" onClick={() => onNavigate(chapter.id + 1)}><div><div className="cnav-dir">Next →</div><div className="cnav-title">{chapters[chapter.id + 1].title}</div></div></button> : <div />}
      </div>
    </div>
  );
}

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
// Shared auth state lives here and is passed down via props to route components.

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
  const S = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{height:100%;width:100%;overflow:hidden;}
    .loading-screen{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f2417;gap:16px;}
    .loading-icon{font-size:48px;animation:spin 2s linear infinite;}
    .loading-text{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:700;color:#86efac;letter-spacing:1px;}
    @keyframes spin{0%,100%{transform:rotate(0deg);}50%{transform:rotate(15deg);}25%,75%{transform:rotate(-10deg);}}
  `;
  return (
    <div className="loading-screen">
      <style>{S}</style>
      <div className="loading-icon">🧬</div>
      <div className="loading-text">BioResearch</div>
    </div>
  );
}

// ─── PROTECTED ROUTE ──────────────────────────────────────────────────────────
function ProtectedRoute({ user, role, children }) {
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "teacher" ? "/dashboard" : "/learn"} replace />;
  }
  return <>{children}</>;
}

// ─── LOGIN ROUTE ──────────────────────────────────────────────────────────────
function LoginRoute({ user, onLogin }) {
  const nav = useNavigate();
  const AUTH_RESET = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{height:auto;min-height:100%;width:100%;overflow-x:hidden;overflow-y:auto;font-family:'Plus Jakarta Sans',sans-serif;}#root{min-height:100%;width:100%;}`;

  // Redirect logged-in users — useEffect handles browser back button navigation too
  useEffect(() => {
    if (user) {
      nav(user.role === "teacher" ? "/dashboard" : "/learn", { replace: true });
    }
  }, [user, nav]);

  if (user) return null;

  const handleLogin = async (profile) => {
    await onLogin(profile);
    nav(profile.role === "teacher" ? "/dashboard" : "/learn", { replace: true });
  };

  return (
    <>
      <style>{AUTH_RESET}</style>
      <LoginPage
        onLogin={handleLogin}
        onGoRegister={() => nav("/register")}
      />
    </>
  );
}

// ─── REGISTER ROUTE (teacher) ─────────────────────────────────────────────────
function RegisterRoute({ user }) {
  const nav = useNavigate();
  const AUTH_RESET = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{height:auto;min-height:100%;width:100%;overflow-x:hidden;overflow-y:auto;font-family:'Plus Jakarta Sans',sans-serif;}#root{min-height:100%;width:100%;}`;

  // If already logged in, go straight to the right place
  if (user) return <Navigate to={user.role === "teacher" ? "/dashboard" : "/learn"} replace />;

  // After registration Firebase auto-signs them in → onAuthChange fires → user is set
  // → the Navigate above kicks in. We also navigate by role as a fallback.
  const handleSuccess = (role) => {
    nav(role === "teacher" ? "/dashboard" : "/learn", { replace: true });
  };

  return (
    <>
      <style>{AUTH_RESET}</style>
      <RegisterPage
        onGoLogin={() => nav("/")}
        onRegisterSuccess={handleSuccess}
      />
    </>
  );
}

// ─── JOIN ROUTE (student invite via QR / link) ────────────────────────────────
function JoinRoute({ user, onLogin }) {
  const { classId } = useParams();
  const nav = useNavigate();
  const AUTH_RESET = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{height:auto;min-height:100%;width:100%;overflow-x:hidden;overflow-y:auto;font-family:'Plus Jakarta Sans',sans-serif;}#root{min-height:100%;width:100%;}`;
  const [joining, setJoining] = useState(false);

  // Already logged in as student — just enroll them and go to learn
  useEffect(() => {
    if (user && user.role === "student" && classId) {
      setJoining(true);
      joinClass(classId)
        .catch(() => { })
        .finally(() => nav("/learn", { replace: true }));
    }
  }, [user, classId, nav]);

  if (joining) return <LoadingScreen />;

  // NOTE: Teachers are no longer redirected — they can preview the student
  // registration page. "Sign in" in the form will take them back to dashboard.

  const handleRegisterSuccess = () => nav("/learn", { replace: true });

  return (
    <>
      <style>{AUTH_RESET}</style>
      <RegisterPage
        onGoLogin={() => nav(user?.role === "teacher" ? "/dashboard" : "/")}
        onRegisterSuccess={handleRegisterSuccess}
        classId={classId}
      />
    </>
  );
}

// ─── TEACHER DASHBOARD ROUTE ──────────────────────────────────────────────────
function DashboardRoute({ user, onLogout }) {
  const nav = useNavigate();
  const AUTH_RESET = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{height:auto;min-height:100%;width:100%;overflow-x:hidden;overflow-y:auto;font-family:'Plus Jakarta Sans',sans-serif;}#root{min-height:100%;width:100%;}`;

  const handleLogout = async () => {
    await onLogout();
    nav("/", { replace: true });
  };

  return (
    <>
      <style>{AUTH_RESET}</style>
      <ProtectedRoute user={user} role="teacher">
        <TeacherDashboard user={user} onLogout={handleLogout} />
      </ProtectedRoute>
    </>
  );
}

// ─── STUDENT LEARN ROUTE ──────────────────────────────────────────────────────
function LearnRoute({ user, onLogout }) {
  const nav = useNavigate();
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Load progress on mount
  useEffect(() => {
    if (!user) return;
    getProgress()
      .then(({ progress }) => {
        setCompleted(new Set(progress.completedLessons || []));
        setAnswers(progress.quizAnswers || {});
        setSubmitted(progress.quizSubmitted || {});
        setCurrent(progress.currentLesson || 0);
      })
      .catch(() => { });
  }, [user?.uid]);

  const handleLogout = async () => {
    await onLogout();
    nav("/", { replace: true });
  };

  const navigate = useCallback(async (id) => {
    setCurrent(id); setShowSummary(false); setSidebarOpen(false);
    document.querySelector(".content-area")?.scrollTo(0, 0);
    try { await saveProgress({ lessonId: id }); } catch { }
  }, []);

  const handleSelect = useCallback((qi, oi) => {
    setAnswers(prev => ({ ...prev, [current]: { ...(prev[current] || {}), [qi]: oi } }));
  }, [current]);

  const handleSubmit = useCallback(async () => {
    const quiz = CHAPTERS[current].quiz;
    const ans = answers[current] || {};
    const correct = quiz.filter((q, i) => ans[i] === q.ans).length;
    const pct = Math.round((correct / quiz.length) * 100);
    const passed = pct >= 75;
    setSubmitted(prev => ({ ...prev, [current]: true }));
    if (passed) {
      setCompleted(prev => {
        const n = new Set(prev); n.add(current);
        if (n.size === CHAPTERS.length) setTimeout(() => setShowSummary(true), 300);
        return n;
      });
    }
    try { await saveProgress({ lessonId: current, completed: passed, quizAnswers: { [current]: ans }, submitted: true }); } catch { }
  }, [current, answers]);

  const handleReset = useCallback(() => {
    setAnswers(prev => { const n = { ...prev }; delete n[current]; return n; });
    setSubmitted(prev => { const n = { ...prev }; delete n[current]; return n; });
    setCompleted(prev => { const n = new Set(prev); n.delete(current); return n; });
    setShowSummary(false);
  }, [current]);

  const ch = CHAPTERS[current];
  const chAns = answers[current] || {};
  const chSub = !!submitted[current];
  const pct = Math.round((completed.size / CHAPTERS.length) * 100);
  const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <>
      <style>{S}</style>
      <ProtectedRoute user={user} role="student">
        <div className="app">
          <div className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">☰</button>
            <div className="logo">
              <div className="logo-icon">🧬</div>
              <span className="logo-text">Bio<span>Research</span></span>
            </div>
            <SearchBar onNavigate={navigate} />
            <div className="topbar-right">
              <div className="progress-wrap">
                <span className="progress-label">Progress</span>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                <span className="progress-pct">{pct}%</span>
              </div>
              {user && (
                <div className="profile-wrap">
                  <div className="user-pill" onClick={() => setProfileOpen(o => !o)}>
                    <div className="user-avatar">{initials}</div>
                    <span className="user-name">{user.name.split(" ")[0]}</span>
                    <span className="user-chevron">{profileOpen ? "▲" : "▼"}</span>
                  </div>
                  {profileOpen && (
                    <>
                      <div className="profile-backdrop" onClick={() => setProfileOpen(false)} />
                      <div className="profile-dropdown">
                        <div className="profile-dropdown-header">
                          <div className="profile-dropdown-avatar">{initials}</div>
                          <div>
                            <div className="profile-dropdown-name">{user.name}</div>
                            <div className="profile-dropdown-role">Student</div>
                          </div>
                        </div>
                        <div className="profile-dropdown-divider" />
                        <button className="profile-dropdown-signout" onClick={() => { setProfileOpen(false); handleLogout(); }}>
                          <span>🚪</span> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="app-body">
            <div className={`sidebar-overlay${sidebarOpen ? " visible" : ""}`} onClick={() => setSidebarOpen(false)} />
            <nav className={`sidebar${sidebarOpen ? " open" : ""}`}>
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
                    <span className="summary-trophy">🌿</span>
                    <h1 className="summary-title">Congratulations, {user?.name?.split(" ")[0] || "Scholar"}!</h1>
                    <p className="summary-sub">You have successfully completed all 5 lessons of the BioResearch Manual.</p>
                    <div className="summary-stats">
                      <div className="sum-stat"><div className="sum-val">5</div><div className="sum-label">Lessons Done</div></div>
                      <div className="sum-stat"><div className="sum-val">100%</div><div className="sum-label">Complete</div></div>
                      <div className="sum-stat"><div className="sum-val">20</div><div className="sum-label">Quiz Questions</div></div>
                    </div>
                    <button className="btn btn-primary" onClick={async () => {
                      setCompleted(new Set()); setAnswers({}); setSubmitted({});
                      setCurrent(0); setShowSummary(false);
                      try { await resetProgress(); } catch { }
                    }}>Start Over</button>
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
      </ProtectedRoute>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { user: profile } = await getUserProfile();
          setUser(profile);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const handleLogin = useCallback(async (profile) => {
    setUser(profile);
  }, []);

  const handleLogout = useCallback(async () => {
    try { await logoutUser(); } catch { }
    setUser(null);
  }, []);

  // Still resolving Firebase auth — show loading spinner
  if (user === undefined) return <LoadingScreen />;

  return (
    <HashRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginRoute user={user} onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterRoute user={user} />} />
        <Route path="/join/:classId" element={<JoinRoute user={user} onLogin={handleLogin} />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<DashboardRoute user={user} onLogout={handleLogout} />} />
        <Route path="/learn" element={<LearnRoute user={user} onLogout={handleLogout} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}