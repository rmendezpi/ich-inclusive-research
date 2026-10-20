# ICH Inclusive Research Repository

A small Quarto website for the ICH Race Equity Group (REG) Action Plan 2026/27, Action 4A. It has two parts:

- **Frameworks and guidance** (`index.qmd`): established resources, filterable by research stage and study type. Data: `data/resources.csv`.
- **ICH examples** (`examples.qmd`): work shared by ICH colleagues through the Microsoft Form, reviewed by REG. Data: `data/ich_examples.csv`.

The site has no R packages and no external JavaScript libraries. All content lives in the two CSV files, so anyone on REG can update it in Excel.

## Before launch

- [ ] Replace `FORM_URL_HERE` in `submit.qmd` with the Microsoft Form link.
- [ ] Add the accessibility statement in `about.qmd` (check wording with ICH communications).
- [ ] Ask ICH communications whether a site hosted outside ucl.ac.uk can be linked from the REG page, and whether UCL branding is required.
- [ ] Decide on the three resources marked `review` in `resources.csv` (UCSF, NCATS toolkit, Medium blog). Change `status` to `published` to show them, or delete the row.
- [ ] Open by hand the links that could not be checked automatically (OSF preprint and supplement, ARU guides, Gendered Innovations, both *Trials* articles).

## Opening the project in RStudio

1. Install Quarto if RStudio does not already include it (recent RStudio versions do).
2. Open `ich-inclusive-research.Rproj`.
3. Click **Render** on any `.qmd` file, or run `quarto render` in the Terminal. The site is built into the `docs/` folder.
4. To preview, use **Render** (RStudio opens a local preview). Opening `docs/index.html` directly from your file browser will not load the lists, because browsers block local data files.

## Updating the frameworks list

Edit `data/resources.csv` in Excel and save as **CSV UTF-8**. Keep the column names exactly as they are.

| Column | What to enter |
| --- | --- |
| `title`, `publisher`, `year`, `url`, `description` | Free text. Keep descriptions to one or two sentences, based on the publisher's own page. |
| `stages` | One or more of the following, separated by semicolons: Funding application; Study design; Co-production and PPIE; Recruitment and retention; Data collection; Analysis; Reporting and dissemination; Ethics; Training and learning |
| `study_types` | `Any` for resources that apply to all research, or one or more of the following, separated by semicolons: Clinical trials and studies; Laboratory and animal research; Population, observational and qualitative research |
| `category` | Funder guidance; Participation and community involvement; EDI tools and data collection; Laboratory research; Methods, reporting and ethics |
| `costing_involvement` | `yes` adds a "Costing involvement" label to the card, for resources with practical guidance on costing or paying for involvement; otherwise `no` |
| `status` | `published` to show on the site, `review` to hide it |
| `checked_against`, `last_checked` | Where the description was checked and the date (YYYY-MM-DD) |

Spelling of stages and study types must match exactly, or the filters will not find the resource.

## Adding ICH examples from the form

1. Open the Microsoft Forms responses in Excel.
2. For each response where Q12 says **Yes, publish it**, check the content (accuracy, no personal data about individuals who have not agreed).
3. Copy the agreed rows into `data/ich_examples.csv` using these columns:

| Column | From form question |
| --- | --- |
| `date_added` | Date REG approved it (YYYY-MM-DD) |
| `title` | Q4 |
| `link` | Q2 (DOI as `https://doi.org/...`, or URL). Do not publish uploaded files without the author's written agreement. |
| `department` | Q5 |
| `what_shared` | Q1 |
| `approaches` | Q6, separated by semicolons |
| `community_partners` | Q8 (organisation names only, unless individuals have agreed) |
| `frameworks_used` | Q9, separated by semicolons |
| `lesson` | Q10 |

Never copy responses where Q12 says **REG team only**.

4. Render the site and publish (below).

## Publishing on GitHub Pages

1. Create the repository under a **REG or ICH GitHub organisation account with at least two admins**, not a personal account, so the site survives staff changes.
2. Push this project, including the `docs/` folder.
3. On GitHub: Settings > Pages > Deploy from a branch > `main` / `docs`.
4. Link to the resulting address from the REG page on the UCL website.

After every update: render, check the preview, then commit and push.

## Annual review

Each October, check every link and description in `resources.csv`, update `last_checked`, and update the review dates in `about.qmd`.

Contact: ich.reg@ucl.ac.uk
