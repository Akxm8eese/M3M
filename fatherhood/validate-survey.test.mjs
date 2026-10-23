import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('./Create_Fatherhood_Form.gs', import.meta.url), 'utf8');

const survey = new Function(`${source}
return {
  FRAMEWORK,
  THEME_CODES,
  assertFramework,
  columnName,
  quoteSheetName,
  questionLabel,
  metricFormula,
  totalFormsFormula,
  summaryFormulas,
  sectionPlan,
  urlsMatchForm
};
`)();

test('framework is 8 sessions of 6 optional questions', () => {
  assert.doesNotThrow(() => survey.assertFramework());
  assert.equal(survey.FRAMEWORK.length, 8);
  assert.equal(survey.FRAMEWORK[7].title, 'I Am the Voice of Legacy');
  assert.equal(survey.FRAMEWORK[7].dimension, 'Purpose, Generational Change & Future');
  const questions = survey.FRAMEWORK.flatMap((session) => session.questions);
  assert.equal(questions.length, 48);
  assert.equal(new Set(questions).size, 48);
  assert.equal(questions[0], 'Who, if anyone, filled the role of a father in your childhood?');
  assert.equal(
    questions[37],
    'How familiar are you with family-related initiatives introduced under the Trump administration, such as changes to family tax benefits or Trump Accounts?'
  );
  assert.equal(
    questions[47],
    'What is one specific step you can take within the next seven days toward the legacy you want to build?'
  );
});

test('session 1 is a section header and the other sessions are page breaks', () => {
  const plan = survey.sectionPlan();
  assert.deepEqual(plan.map((section) => section.kind), [
    'sectionHeader',
    'pageBreak',
    'pageBreak',
    'pageBreak',
    'pageBreak',
    'pageBreak',
    'pageBreak',
    'pageBreak'
  ]);
  assert.equal(plan[0].title, 'Session 1 — The Boy Before the Man');
  assert.equal(plan[7].title, 'Session 8 — I Am the Voice of Legacy');
  const numbers = plan.flatMap((section) => section.questions.map((q) => q.number));
  assert.deepEqual(numbers, Array.from({length: 48}, (_, i) => i + 1));
  assert.equal(plan[0].questions[0].label, 'Q01');
  assert.equal(plan[7].questions[5].label, 'Q48');
  assert.match(plan[0].help, /All answers are optional/);
});

test('question columns start after the timestamp column', () => {
  assert.equal(survey.columnName(1), 'A');
  assert.equal(survey.columnName(26), 'Z');
  assert.equal(survey.columnName(27), 'AA');
  assert.equal(survey.columnName(52), 'AZ');
  assert.equal(survey.columnName(53), 'BA');
  assert.equal(survey.metricFormula('Form Responses 1', 1), '=COUNTIF(\'Form Responses 1\'!B2:B,"<>")');
  assert.equal(survey.metricFormula('Form Responses 1', 48), '=COUNTIF(\'Form Responses 1\'!AW2:AW,"<>")');
  assert.equal(survey.metricFormula("Dad's Responses", 2), '=COUNTIF(\'Dad\'\'s Responses\'!C2:C,"<>")');
  assert.equal(survey.totalFormsFormula('Form Responses 1'), '=IFERROR(COUNTA(\'Form Responses 1\'!A2:A),0)');
});

test('dashboard rates cover six questions per session', () => {
  assert.deepEqual(survey.summaryFormulas(0), {
    answered: "=SUM('Question Metrics'!C2:C7)",
    rate: '=IFERROR(C7/($B$4*6),0)'
  });
  assert.deepEqual(survey.summaryFormulas(7), {
    answered: "=SUM('Question Metrics'!C44:C49)",
    rate: '=IFERROR(C14/($B$4*6),0)'
  });
  const covered = new Set();
  for (let i = 0; i < 8; i++) {
    const match = survey.summaryFormulas(i).answered.match(/C(\d+):C(\d+)/);
    for (let row = Number(match[1]); row <= Number(match[2]); row++) covered.add(row);
  }
  assert.deepEqual([...covered], Array.from({length: 48}, (_, i) => i + 2));
});

test('theme guide has 10 starter codes', () => {
  assert.equal(survey.THEME_CODES.length, 10);
  assert.equal(survey.THEME_CODES[0][0], 'FATHER_PRESENCE');
  assert.equal(survey.THEME_CODES[9][0], 'FUTURE_ACTION');
  assert.equal(new Set(survey.THEME_CODES.map((row) => row[0])).size, 10);
});

test('response sheet matching does not treat an unlinked tab as the destination', () => {
  const form = {
    getId: () => 'form-id-123',
    getPublishedUrl: () => 'https://docs.google.com/forms/d/e/published/viewform',
    getEditUrl: () => 'https://docs.google.com/forms/d/form-id-123/edit'
  };
  assert.equal(survey.urlsMatchForm(null, form), false);
  assert.equal(survey.urlsMatchForm('https://docs.google.com/spreadsheets/d/abc', form), false);
  assert.equal(survey.urlsMatchForm('https://docs.google.com/forms/d/form-id-123/edit', form), true);
  assert.equal(survey.urlsMatchForm(form.getPublishedUrl(), form), true);
});

test('builder keeps privacy settings and does not rename whatever sheet happens to be first', () => {
  assert.match(source, /setCollectEmail\(false\)/);
  assert.match(source, /setLimitOneResponsePerUser\(false\)/);
  assert.match(source, /setPublishingSummary\(false\)/);
  assert.match(source, /setRequired\(false\)/);
  assert.doesNotMatch(source, /setRequired\(true\)/);
  assert.doesNotMatch(source, /getSheets\(\)\[0\]/);
  assert.match(source, /setPublished\(true\)/);
  assert.match(source, /supportsAdvancedResponderPermissions/);
});
