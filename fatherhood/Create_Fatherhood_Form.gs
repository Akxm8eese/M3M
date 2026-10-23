/** WHAT MAKES A FATHER? — 48-question Google Forms + Google Sheets builder.
 * Run createFatherhoodSurvey() once in script.google.com with your Google account.
 * Forms and Sheets remain in YOUR Google Drive. Never publish the admin sheet.
 *
 * Each run creates a new Form and Spreadsheet. Do not rerun it for the same survey.
 */
var FRAMEWORK = [
  {title:'The Boy Before the Man', dimension:'Origins & Childhood', questions:[
    'Who, if anyone, filled the role of a father in your childhood?',
    'What did that person do that made you recognize them as a father figure?',
    'When you were growing up, what made you feel loved, protected, or supported?',
    'What did you learn about fatherhood by watching the adults around you?',
    'Looking back, what support or guidance did you need more of?',
    'What is one childhood lesson you would like to carry forward or change?']},
  {title:'The Man I Became', dimension:'Masculinity & Identity', questions:[
    'Growing up, what did people around you say it meant to be a man?',
    'Who had the greatest influence on your understanding of manhood?',
    'Which expectations about being a man have helped you?',
    'Which expectations have made life or relationships more difficult?',
    'How has your understanding of strength changed with age or experience?',
    'What does becoming the man you want to be look like today?']},
  {title:'The Code I Live By', dimension:'Values, Ethics & Character', questions:[
    'What three values should guide a father in raising a child?',
    'Where did you learn those values, and who modeled them for you?',
    'What does accountability mean to you within a family?',
    'How do you decide what is fair when you and your child disagree?',
    'What does a meaningful apology from a father look like?',
    'What is one value you want your child to recognize through your actions rather than your words?']},
  {title:'The Experiences I Carry', dimension:'Emotional Awareness, Adversity & Healing', questions:[
    'How were difficult emotions handled by the adults around you when you were young?',
    'When you faced challenges growing up, what people or activities helped you cope?',
    'How have past experiences influenced the way you respond to stress today?',
    'What helps you recognize when you need support or time to regroup?',
    'What have you learned about rebuilding trust after conflict or disappointment?',
    'What strength or coping skill do you want to develop for yourself and your family?']},
  {title:'The Father I Am', dimension:'Presence, Parenting & Responsibility', questions:[
    'What does being a present father mean to you beyond living in the same home or providing money?',
    'What is one way you show, or hope to show, your child that they matter?',
    'How do you balance responsibilities such as work, finances, relationships, and parenting?',
    'What makes it easier or harder to communicate with your child or other caregivers?',
    'When parenting does not go as planned, how do you repair the relationship?',
    'What is one aspect of fatherhood you are proud of and one you want to improve?']},
  {title:'The Village Around Me', dimension:'Community, Relationships & Resources', questions:[
    'Who can you rely on when you need advice or help with fatherhood?',
    'What support do you currently have that makes parenting easier?',
    'What resources, if any, do you need but have difficulty obtaining?',
    'What has helped or prevented you from accessing services such as employment, housing, transportation, childcare, or counseling?',
    'How could mentors, family members, organizations, or other fathers better support one another?',
    'If you could create one community resource for fathers, what would it offer and why?']},
  {title:'The Systems We Navigate', dimension:'Public Policy, Institutions & Opportunity', questions:[
    'Which government policies, public services, or institutional rules have affected your responsibilities or opportunities as a father?',
    'How familiar are you with family-related initiatives introduced under the Trump administration, such as changes to family tax benefits or Trump Accounts?',
    'Have you or your family tried to access any of these initiatives or other federal, state, or local family programs, and what happened?',
    'How, if at all, have employment rules, family courts, child support, housing, education, or reentry systems affected your relationship with your child?',
    'What information would help you better understand the eligibility requirements, potential benefits, or limitations of programs available to your family?',
    'Regardless of which political party holds office, what changes to public services or policies would make it easier for fathers to support their children?']},
  {title:'I Am the Voice of Legacy', dimension:'Purpose, Generational Change & Future', questions:[
    'When you think about your childhood, what positive experience do you want the next generation to have?',
    'What family pattern, belief, or behavior would you like to change?',
    'What do you hope your child understands about you as a person and father?',
    'What three words would you hope your child uses to describe you 20 years from now?',
    'What support or personal habit would help you move closer to that vision?',
    'What is one specific step you can take within the next seven days toward the legacy you want to build?']}
];

var THEME_CODES = [
  ['FATHER_PRESENCE','Reported availability and involvement','Time together, reliability, communication'],
  ['POSITIVE_MODEL','Helpful childhood influences','Mentors, loving caregivers, teachers'],
  ['UNMET_CHILDHOOD_NEED','Resources or care missing in childhood','Guidance, safety, attention; never infer diagnoses'],
  ['ACCOUNTABILITY','Responsibility and relationship repair','Apologies, follow-through, taking ownership'],
  ['MENTAL_WELLBEING','Stress or emotional support needs','Avoid recording detailed trauma descriptions'],
  ['FINANCIAL_PRESSURE','Cost or income-related obstacles','Employment, housing, childcare costs'],
  ['ACCESS_BARRIER','Difficulty using services','Transport, eligibility, paperwork'],
  ['REENTRY_FAMILY','Incarceration/reentry family challenges','Reconnection, visitation, support'],
  ['POLICY_EXPERIENCE','Reported government-program experience','Distinguish perception from independently verified facts'],
  ['FUTURE_ACTION','Concrete intended next step','Mentoring, parenting activities, help-seeking']
];

function assertFramework() {
  if (FRAMEWORK.length !== 8) {
    throw new Error('Expected 8 sessions, found ' + FRAMEWORK.length);
  }
  var n = 0;
  FRAMEWORK.forEach(function (session, i) {
    if (!session.title || !session.dimension) {
      throw new Error('Session ' + (i + 1) + ' is missing a title or dimension');
    }
    if (!session.questions || session.questions.length !== 6) {
      throw new Error('Session ' + (i + 1) + ' must have 6 questions');
    }
    session.questions.forEach(function (q) {
      n++;
      if (!q || !String(q).trim()) throw new Error('Empty question at Q' + n);
    });
  });
  if (n !== 48) throw new Error('Expected 48 questions, found ' + n);
  if (FRAMEWORK[7].title !== 'I Am the Voice of Legacy') {
    throw new Error('Session 8 title must be exactly "I Am the Voice of Legacy"');
  }
}

/** 1-based column index to A1 letters. Column 1 is the timestamp, so question q is column q+1. */
function columnName(n) {
  var s = '';
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

function quoteSheetName(name) {
  return "'" + String(name).replace(/'/g, "''") + "'";
}

function questionLabel(qnum) {
  return 'Q' + String(qnum).padStart(2, '0');
}

function metricFormula(sheetName, qnum) {
  var col = columnName(qnum + 1);
  return '=COUNTIF(' + quoteSheetName(sheetName) + '!' + col + '2:' + col + ',"<>")';
}

function totalFormsFormula(sheetName) {
  return '=IFERROR(COUNTA(' + quoteSheetName(sheetName) + '!A2:A),0)';
}

function summaryFormulas(sessionIndex) {
  var first = 2 + sessionIndex * 6;
  var last = first + 5;
  var row = 7 + sessionIndex;
  return {
    answered: "=SUM('Question Metrics'!C" + first + ':C' + last + ')',
    rate: '=IFERROR(C' + row + '/($B$4*6),0)'
  };
}

/** Session 1 stays on page 1. A leading page break would add a blank ninth section. */
function sectionPlan() {
  return FRAMEWORK.map(function (session, i) {
    return {
      index: i + 1,
      title: 'Session ' + (i + 1) + ' — ' + session.title,
      dimension: session.dimension,
      kind: i === 0 ? 'sectionHeader' : 'pageBreak',
      help: 'Dimension: ' + session.dimension + ' · All answers are optional.',
      questions: session.questions.map(function (q, qi) {
        var number = i * 6 + qi + 1;
        return {number: number, label: questionLabel(number), text: q};
      })
    };
  });
}

function addSurveySections(form) {
  sectionPlan().forEach(function (section) {
    var item = section.kind === 'sectionHeader'
      ? form.addSectionHeaderItem()
      : form.addPageBreakItem();
    item.setTitle(section.title).setHelpText(section.help);
    section.questions.forEach(function (q) {
      form.addParagraphTextItem()
        .setTitle(q.label + ' — ' + q.text)
        .setRequired(false);
    });
  });
}

function publishForm(form) {
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  form.setPublishingSummary(false);
  if (typeof form.supportsAdvancedResponderPermissions === 'function' &&
      form.supportsAdvancedResponderPermissions()) {
    form.setPublished(true);
  }
}

function sheetNames(spreadsheet) {
  var names = {};
  spreadsheet.getSheets().forEach(function (sh) { names[sh.getName()] = true; });
  return names;
}

function urlsMatchForm(sheetUrl, form) {
  if (!sheetUrl) return false;
  var id = form.getId();
  if (sheetUrl.indexOf(id) !== -1) return true;
  if (sheetUrl === form.getPublishedUrl() || sheetUrl === form.getEditUrl()) return true;
  var sheetId = String(sheetUrl).match(/\/d\/([^/]+)/);
  var editId = String(form.getEditUrl()).match(/\/d\/([^/]+)/);
  return !!(sheetId && editId && sheetId[1] === editId[1]);
}

function findResponseSheet(spreadsheet, form, namesBefore) {
  for (var attempt = 0; attempt < 5; attempt++) {
    SpreadsheetApp.flush();
    var sheets = spreadsheet.getSheets();
    var added = null;
    for (var i = 0; i < sheets.length; i++) {
      if (urlsMatchForm(sheets[i].getFormUrl(), form)) return sheets[i];
      if (!namesBefore[sheets[i].getName()] && !added) added = sheets[i];
    }
    if (added) return added;
    if (attempt < 4) Utilities.sleep(1000);
  }
  return null;
}

function dashboardSheet(spreadsheet, responseSheet) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() !== responseSheet.getSheetId()) return sheets[i];
  }
  return spreadsheet.insertSheet('Dashboard');
}

function buildDashboard(spreadsheet, form, responseSheet) {
  var responseName = responseSheet.getName();
  var dash = dashboardSheet(spreadsheet, responseSheet);
  dash.setName('Dashboard');
  dash.clear();
  try { dash.getCharts().forEach(function (chart) { dash.removeChart(chart); }); } catch (ignore) {}

  dash.getRange('A1').setValue('WHAT MAKES A FATHER? | COMMUNITY DASHBOARD');
  dash.getRange('A2').setValue('8 sessions • 48 open-ended questions • Anonymous aggregate reporting');
  dash.getRange('A4').setValue('Total submitted forms');
  dash.getRange('B4').setFormula(totalFormsFormula(responseName));
  dash.getRange('A6:D6').setValues([['Session','Dimension','Answered question fields','Field response rate']]);

  var summary = FRAMEWORK.map(function (session, i) {
    var formulas = summaryFormulas(i);
    return [i + 1, session.dimension, formulas.answered, formulas.rate];
  });
  dash.getRange(7, 1, 8, 2).setValues(summary.map(function (row) { return row.slice(0, 2); }));
  dash.getRange(7, 3, 8, 2).setFormulas(summary.map(function (row) { return row.slice(2); }));
  dash.getRange('D7:D14').setNumberFormat('0.0%');
  dash.getRange('A17').setValue('HOW TO READ THE DASHBOARD');
  dash.getRange('A18').setValue('Field response rate = answered questions in a session ÷ (6 × submitted forms). This is NOT a fatherhood quality score.');
  dash.getRange('A19').setValue('Analyze open-ended answers with an agreed theme codebook. Avoid sharing identifying quotations or small subgroup results.');
  dash.getRange('A21').setValue('PARTICIPANT FORM LINK');
  dash.getRange('B21').setValue(form.getPublishedUrl());
  dash.getRange('A22').setValue('FORM EDITOR LINK');
  dash.getRange('B22').setValue(form.getEditUrl());
  dash.getRange('A23').setValue('ADMINISTRATOR SHEET LINK');
  dash.getRange('B23').setValue(spreadsheet.getUrl());

  var metrics = spreadsheet.insertSheet('Question Metrics', spreadsheet.getSheets().length);
  metrics.getRange(1, 1, 1, 5).setValues([['Question','Session','Answered forms','Question text','Dimension']]);
  var labels = [];
  var formulas = [];
  var qnum = 0;
  FRAMEWORK.forEach(function (session, i) {
    session.questions.forEach(function (q) {
      qnum++;
      labels.push([questionLabel(qnum), i + 1, q, session.dimension]);
      formulas.push([metricFormula(responseName, qnum)]);
    });
  });
  metrics.getRange(2, 1, 48, 2).setValues(labels.map(function (row) { return [row[0], row[1]]; }));
  metrics.getRange(2, 3, 48, 1).setFormulas(formulas);
  metrics.getRange(2, 4, 48, 2).setValues(labels.map(function (row) { return [row[2], row[3]]; }));

  var codes = spreadsheet.insertSheet('Theme Coding Guide', spreadsheet.getSheets().length);
  codes.getRange('A1:C1').setValues([['Theme code','Definition','Examples / coding note']]);
  codes.getRange(2, 1, THEME_CODES.length, 3).setValues(THEME_CODES);

  var intro = spreadsheet.insertSheet('READ ME', spreadsheet.getSheets().length);
  intro.getRange('A1:B9').setValues([
    ['Purpose','Voluntary fatherhood listening and needs-assessment project'],
    ['Confidentiality','No names/emails are requested; open-ended answers can still identify a person.'],
    ['Access','Do not share the administrator spreadsheet link publicly.'],
    ['Response sheet','Responses land on "' + responseName + '". Do not rename that tab or reorder its columns. Column A is the submission timestamp.'],
    ['Dashboard','Counts responses and answered-field rates, not positive/negative sentiment. Links are in Dashboard rows 21–23.'],
    ['Analysis','Use Theme Coding Guide for manual de-identified coding.'],
    ['Policy neutrality','Record specific experiences separately from political opinions or verified policy facts.'],
    ['Safety','Explain privacy and safeguarding limits before collecting responses.'],
    ['Rerun','Do not run createFatherhoodSurvey again for this survey. Each run creates another Form and Spreadsheet.']
  ]);

  [dash, metrics, codes, intro].forEach(function (sh) {
    sh.setFrozenRows(sh === dash ? 0 : 1);
    sh.getDataRange().setWrap(true).setVerticalAlignment('middle');
    sh.setColumnWidth(1, 215);
    sh.setColumnWidth(2, 270);
    sh.setColumnWidth(3, 170);
    sh.setColumnWidth(4, 550);
    sh.setColumnWidth(5, 280);
  });
  dash.getRange('A1:D1').setBackground('#16181c').setFontColor('#efeae0').setFontWeight('bold').setFontSize(14);
  dash.getRange('A6:D6').setBackground('#5e7c6c').setFontColor('#ffffff').setFontWeight('bold');
  metrics.getRange('A1:E1').setBackground('#16181c').setFontColor('#ffffff').setFontWeight('bold');
  codes.getRange('A1:C1').setBackground('#16181c').setFontColor('#ffffff').setFontWeight('bold');
  intro.getRange('A1:A9').setBackground('#16181c').setFontColor('#ffffff').setFontWeight('bold');
  dash.getRange('A1:D1').merge();
  dash.getRange('A2:D2').merge();
  dash.getRange('A17:D17').merge();
  dash.getRange('A18:D18').merge();
  dash.getRange('A19:D19').merge();

  var chart = dash.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dash.getRange('B6:B14'))
    .addRange(dash.getRange('D6:D14'))
    .setOption('title', 'Answer completion by dimension')
    .setOption('legend', {position: 'none'})
    .setPosition(25, 1, 0, 0)
    .build();
  dash.insertChart(chart);

  try {
    spreadsheet.setActiveSheet(dash);
    spreadsheet.moveActiveSheet(1);
  } catch (err) {
    Logger.log('Dashboard tab order was left unchanged: ' + err);
  }
  return responseName;
}

function createFatherhoodSurvey() {
  assertFramework();
  var title = 'What Makes a Father? | The Man. The Father. The Legacy.';
  var form = FormApp.create(title);
  form.setDescription('A voluntary, trauma-informed community reflection survey. 8 sessions • 48 optional questions. Skip any question. Do not enter names, contact details, or identifying stories. You may exit at any time. Submissions are used for anonymous thematic analysis by the research organizers. Avoid submitting sensitive details you do not wish to share.');
  form.setConfirmationMessage('Thank you for contributing to the What Makes a Father? community project.');
  addSurveySections(form);
  publishForm(form);

  var spreadsheet = SpreadsheetApp.create('What Makes a Father? — Anonymous Responses & Dashboard');
  var namesBefore = sheetNames(spreadsheet);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  var responseSheet = findResponseSheet(spreadsheet, form, namesBefore);
  if (!responseSheet) {
    Logger.log('PARTICIPANT LINK: ' + form.getPublishedUrl());
    Logger.log('ADMIN SHEET: ' + spreadsheet.getUrl());
    Logger.log('EDIT FORM: ' + form.getEditUrl());
    throw new Error('The Form and Spreadsheet were created, but the response tab was not detected. Use the links in the execution log. Do not rerun until you check Drive, or you will create duplicates.');
  }

  var responseName = buildDashboard(spreadsheet, form, responseSheet);
  Logger.log('PARTICIPANT LINK: ' + form.getPublishedUrl());
  Logger.log('ADMIN SHEET: ' + spreadsheet.getUrl());
  Logger.log('EDIT FORM: ' + form.getEditUrl());
  Logger.log('RESPONSE TAB: ' + responseName);
  return {
    participantUrl: form.getPublishedUrl(),
    administratorSpreadsheet: spreadsheet.getUrl(),
    editForm: form.getEditUrl(),
    responseSheet: responseName
  };
}
