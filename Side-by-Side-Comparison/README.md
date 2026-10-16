# TypeScript DOCX Editor – Compare Original and Revised Documents

## Introduction

This repository contains a TypeScript sample that demonstrates how to compare two Word documents side-by-side using the Syncfusion<sup style="font-size:70%">&reg;</sup> [JavaScript (ES6) DOCX Editor](https://www.syncfusion.com/docx-editor-sdk/javascript-docx-editor?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) (Document Editor). The sample lets users upload an original and a revised document, compare them through the Document Editor web service, and review the result with revision tracking – all inside two side-by-side editors.

### Features

- Upload an original Word document.
- Upload a revised Word document.
- Compare both documents.
- View tracked revisions in the comparison result.
- Switch between:
  - Original vs Compared document
  - Original vs Revised document
- Synchronized scrolling between the two editors.
- Download the comparison result as a DOCX file.

---

# How to Run the Application

## Prerequisites

Before running the sample, ensure the following software is installed:

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/)

---

## Configuration

No additional configuration is required.

This sample is already configured to use the online Syncfusion Document Editor service:

```ts
const serviceUrl =
  "https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/"; //only for demo purpose.
```

Since the application consumes the hosted web service, you do **not** need to download, build, or run any ASP.NET Core Web API project.

---

## Install Dependencies

Open the project folder in a terminal and install the required packages.

```bash
npm install
```

---

## Run the Application

Start the TypeScript development server (webpack-dev-server).

```bash
npm start
```

The application will launch in your default browser.

If it does not open automatically, browse to:

```
http://localhost:4000
```

---

## Build the Application

Generate a production build in the `dist/` folder.

```bash
npm run build
```

---

## Verify the Sample

1. Launch the application.
2. Click **Choose file** under **Original document** and select a DOCX (or SFDT) file.
3. Click **Choose file** under **Revised document** and select another version of the same document.
4. Click **Compare**.
5. The application sends both documents to the online Document Editor service.
6. The comparison result is displayed in the right-side editor with tracked revisions.
7. Toggle between:
   - **Show comparison results with tracked changes** (Original vs Compared)
   - Uncheck the option to show **Original vs Revised**
8. Review insertions, deletions, and formatting changes using the Document Editor revision features.
9. Use the **Download Result Document** button to save the right-side editor's contents as a DOCX file.

---

## Demo

<p align="center">
  <img
    src="images/compare-documents-demo-typescript-docx-editor.png"
    alt="TypeScript DOCX Editor Compare Documents Demo"
    width="1000" />
</p>

---

# Project Workflow

The application follows the workflow below:

1. User uploads the original document.
2. User uploads the revised document.
3. Both documents are sent to the Syncfusion online Document Editor service.
4. The service:
   - Imports the DOCX files.
   - Compares both documents.
   - Generates a document with tracked revisions.
5. The comparison result is returned in SFDT format.
6. The TypeScript application loads the original document in the left editor.
7. The compared document (or revised document) is loaded in the right editor for side-by-side review.

```
Original DOCX
        │
        │
        ▼
TypeScript Application
        │
        │
        ▼
Syncfusion Online Document Editor Service
        │
        ├── Import Original
        ├── Import Revised
        └── Compare Documents
                │
                ▼
      Compared SFDT Document
                │
                ▼
TypeScript DOCX Editor
        │
        ├── Left Editor  → Original
        └── Right Editor → Compared / Revised
```

---

# Project Files

| Path | Description |
|------|-------------|
| `src/app/app.ts` | Main TypeScript entry point that wires up the two editors and the compare UI. |
| `src/index.html` | Application HTML host. |
| `src/styles/styles.css` | Styles for the editor toolbar, upload controls, and loading overlay. |
| `src/resources/favicon.ico` | Application favicon. |
| `webpack.config.js` | Webpack 5 configuration used by `npm start` and `npm run build`. |
| `tsconfig.json` | TypeScript compiler options. |
| `package.json` | npm metadata and scripts. |

---

# Resources

- **Product page:**   [Syncfusion® JavaScript (ES6) DOCX Editor](https://www.syncfusion.com/docx-editor-sdk/javascript-docx-editor?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) 

- **Documentation:**   [Syncfusion® JavaScript (ES6) DOCX Editor - Documentation](https://help.syncfusion.com/document-processing/word/word-processor/javascript-es6/overview?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) 

- **Online demo:**   [Syncfusion® JavaScript (ES6) DOCX Editor - Online demo](https://document.syncfusion.com/demos/docx-editor/javascript/#/material3/document-editor/default.html?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) 

# Support and feedback 

For any other queries, reach our [Syncfusion® support team](https://support.syncfusion.com/?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) or post the queries through the [community forums](https://www.syncfusion.com/forums?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples). 

Request new feature through [Syncfusion® feedback portal](https://www.syncfusion.com/feedback?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples). 

# License

This is a commercial product and requires a paid license for possession or use. Syncfusion's licensed software, including this component, is subject to the terms and conditions of [Syncfusion's EULA](https://www.syncfusion.com/license/studio/syncfusion_essential_studio_eula.pdf?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples). You can purchase a license [here](https://www.syncfusion.com/sales/products?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples) or start a free 30-day trial [here](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=github&utm_medium=listing&utm_campaign=github-github-documenteditor-examples).