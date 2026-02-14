

# Anonymous Form Builder – UI Interface

## Overview
A Google Forms-style interface where form creators can view all submitted responses, but **responses are completely anonymous** – no names, emails, or identifying information is shown or collected.

## Pages & Features

### 1. Form Page (for respondents)
- Clean, centered layout similar to Google Forms
- A pre-built form with basic question types:
  - **Short text** – single-line text input
  - **Long text** – multi-line textarea
  - **Multiple choice** – radio button selection (pick one)
  - **Checkboxes** – select multiple options
- Each question displays its title and optional description
- Required field indicators (asterisk)
- "Submit" button at the bottom
- Success confirmation screen after submission ("Your response has been recorded")
- **No identity fields collected** – fully anonymous

### 2. Responses Dashboard (for form owner)
- Summary view showing total number of responses
- Per-question breakdown:
  - For text questions: list of all anonymous text answers
  - For multiple choice/checkboxes: bar chart or simple visual summary showing how many people chose each option
- No respondent names, emails, timestamps, or any identifying info displayed
- Clean tabbed layout: "Questions" tab (edit form) and "Responses" tab (view results)

### 3. Form Editor / Preview
- Simple interface to define the form title, description, and questions
- Add/remove/reorder questions
- Set question type (short text, long text, multiple choice, checkbox)
- Add/edit answer options for choice-based questions
- Mark questions as required or optional
- Live preview of how the form looks to respondents

## Design Style
- Minimal, clean design inspired by Google Forms
- White card-based layout on a light background
- Clear typography and spacing
- Color-coded question type indicators
- Mobile-responsive layout

## Data Handling (UI only, no backend)
- Responses stored in local state for demonstration purposes
- Form structure managed via React state
- Ready to be connected to a database later

