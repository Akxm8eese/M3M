# What Makes a Father? — Google Forms + Sheets setup

This kit **creates a live Google Form and a linked Google Sheets dashboard in your own Google account**. It is not a hosted form by itself. Running the script requires your Google login at [script.google.com](https://script.google.com). The files in this folder do not contact Google on their own.

## Launch (approximately 7 steps)

1. Visit https://script.google.com and select **New project**.
2. Delete the starter `myFunction()` code in `Code.gs`.
3. Open `fatherhood/Create_Fatherhood_Form.gs` from this kit, copy all its text, and paste it into `Code.gs`.
4. Save the project (for example, `Fatherhood Survey Builder`).
5. At the top, select function `createFatherhoodSurvey`, then click **Run**.
6. Approve Google's permission request after verifying it refers to Forms and Sheets in your Google account. The script creates new files; it does not send survey data to an external server.
7. Open **Execution log**. Copy the **PARTICIPANT LINK** for fathers, and keep the **ADMIN SHEET** link private. The sheet also lists these links in Dashboard rows 21–23.

## What gets created

- A Google Form: **8 sections**, 48 paragraph-answer items. Session 1 is the first page (a section header plus its six questions). Sessions 2–8 each start with a page break. All questions are optional. No form field requests a name or email. Email collection is turned off. The respondent summary chart link is turned off. A progress bar is on. When the account supports form publishing, the script publishes the form.
- A Google Spreadsheet linked to that form with these tabs:
  - The response tab Google creates when the form is linked (often **Form Responses 1**; the script uses whatever name Google assigned and records it on the **READ ME** tab)
  - **Dashboard**: total forms and field completion rate by each of 8 dimensions
  - **Question Metrics**: how many participants answered each question
  - **Theme Coding Guide**: 10 starter categories for manually identifying recurring themes
  - **READ ME**: internal guidance for administrators

## Test before sharing

- Open the participant link, submit a **fictional** sample answer, and check the response appears in the Sheet.
- Confirm the Dashboard total becomes 1 and question answer counts update.
- Delete test responses before inviting real participants, or clearly mark those tests and exclude them from reporting.
- Open the participant link from a private/incognito browser window to check whether Google requires sign-in in your configuration.
- In Google Forms Settings, make sure **Collect email addresses** is set to *Do not collect*, **Limit to 1 response** is *Off*, and **Restrict to users in an organization** is *Off*, if visible.
- Check whether Google Forms shows a 'Respondents can see summary charts' option and ensure it is Off. The script sets this off; confirm it in the form settings.
- **Do not share the dashboard spreadsheet or editor link with respondents.**

## Privacy and ethical handling

Google Forms typically records a **submission timestamp** in the linked sheet. 'Anonymous' here means the form does not directly ask for names, addresses or email addresses, and email collection is disabled. Open-ended answers may still include identifying details. Google may process technical metadata under its own policies; this is not a guarantee of total anonymity.

Before distribution, add your organization's approved privacy/contact notice, data retention period, uses of responses, any mandatory-reporting limits, and a way to decline participation without consequences. Keep support or referral contact requests in a **separate form** so identities cannot be matched to anonymous responses. Set spreadsheet sharing to restricted and enable account multi-factor authentication for editors.

The dashboard measures **question field completion**, not parenting quality or psychological healing. Policy experiences and opinions are not proof of policy causation. Review small-group privacy before quoting responses.

## Customization

- The code contains all 48 editable questions in `FRAMEWORK`.
- Session 8 has the exact title **I Am the Voice of Legacy**.
- All six questions per session are open-ended paragraphs to support authentic responses.
- You can change item types manually in the Google Form editor after generating it.
- **Do not rerun the setup function for the same survey:** every run creates another Form and Spreadsheet.
- If the execution log prints the participant and admin links and then reports that the response tab was not detected, use those links and check Drive before running the function again.
- Do not rename the response tab or reorder its columns. Dashboard formulas point at the tab name from the run that created them.
- Google Forms is not a week-by-week multi-session save/resume system. Participants submit this form **once** after completing the sections. To run eight separately-submitted weekly forms, create distinct forms and a different analysis structure.

## Local check

From the repository root:

```bash
node --test fatherhood/validate-survey.test.mjs
```

That check confirms the 8×6 question bank, section paging, column letters, and dashboard formulas. It does not create a Google Form.
