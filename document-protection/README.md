# User-based restrict editing and approval workflow in JavaScript DOCX Editor (Document Editor)

This sample demonstrates the user-based document restrictions and approval workflows of the [Syncfusion&reg; JavaScript DOCX Editor](https://www.syncfusion.com/docx-editor-sdk/javascript-docx-editor?utm_source=github&utm_medium=github&utm_campaign=github-javascript-es6-docx-editor-examples) (Document Editor). The loaded Adventure Works Cycles document (`data-document-protection.json`) contains user-based editable ranges for Nancy's price values, and each user's restrictions are applied on the fly when a user is selected from the dropdown.

## Demo

* **Nancy** (nancy@example.com) – Price Editor: can edit only the price values that are marked as editable ranges for her in the loaded document.
* **Andrew** (andrew@example.com) – Reviewer: all edits are tracked as revisions (`RevisionsOnly` protection), and he cannot accept or reject revisions.
* **Steven** (steven@example.com) – Commenter: can insert comments only (`CommentsOnly` protection) and cannot edit the document content.
* **Michael** (michael@example.com) – Editor: full editing access on the entire document (no protection applied) and reviews the tracked changes.
* **Laura** (laura@example.com) – Viewer: read-only access and can export the document as DOCX and PDF only.

Select a user in the dropdown on the right to switch the document restrictions between the roles, and use the table below the dropdown to see each user's permissions at a glance.

## How it works

1. The sample loads the Adventure Works Cycles SFDT document from `data-document-protection.json`. The attached SFDT already holds the user-based editable ranges (Nancy's price values) along with a ReadOnly protection (hash and salt), so it opens in the protected mode.
2. When a user is selected, the previous document protection is stopped and the protection type of the new user is enforced through `documentEditor.editorModule.enforceProtection`:
   * `RevisionsOnly` – for Andrew, so all his edits are tracked.
   * `CommentsOnly` – for Steven, so he can only add comments.
   * `NoProtection` – for Michael, so he has full editing access.
   * `ReadOnly` – for Nancy (only her editable ranges can be edited) and Laura (no editable ranges, so the document is fully read-only).
3. For Laura, the container is also set to read-only (`documentEditor.isReadOnly = true`), leaving only the custom **Export as DOCX** and **Export as PDF** buttons available for exporting the document.
4. The approval workflow is demonstrated with the `beforeAcceptRejectChanges` event of the Document Editor: Andrew's accept/reject actions are cancelled, so the tracked changes can only be approved by a user with approval rights (Michael).

## Project structure

```
document-protection/
├── e2e/                          # End-to-end test configuration
├── license/                      # License information
├── src/
│   ├── app/
│   │   └── app.ts                # Sample source code
│   ├── resources/
│   │   └── data/
│   │       └── data-document-protection.json   # Adventure Works Cycles SFDT with user-based editable ranges
│   ├── styles/
│   │   └── styles.css            # Sample styles
│   └── index.html                # Sample page
├── gulpfile.js                   # Build and test tasks
├── package.json                  # Project configuration
├── tsconfig.json                 # TypeScript configuration
└── webpack.config.js             # Webpack configuration
```

## How to run this sample

1. Clone the [JavaScript (ES6) DOCX Editor examples](https://github.com/SyncfusionExamples/JavaScript-ES6-DOCX-Editor-Examples) repository.
2. Navigate to the `document-protection` directory and install the dependencies:

   ```
   npm install
   ```

3. Start the sample:

   ```
   npm start
   ```

4. The sample will be available in the browser. Select a user in the dropdown to apply that user's document restrictions:
   * Nancy – try editing a price value (allowed) and any other text (blocked).
   * Andrew – type anywhere; the edits appear as tracked changes, and the accept/reject actions are cancelled.
   * Steven – insert comments from the Review tab; editing the content is blocked.
   * Michael – edit and format anywhere, and accept or reject Andrew's revisions.
   * Laura – the document is read-only; export it as DOCX or PDF using the custom buttons.

> Note: The sample uses the Syncfusion demo web service (`https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/`) only for the PDF export server action. For production, set up your own web service as described in the [web services documentation](https://help.syncfusion.com/document-processing/word/word-processor/javascript-es6/web-services-overview?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples).

# Resources

- **Product page:**   [Syncfusion&reg; JavaScript (ES6) DOCX Editor](https://www.syncfusion.com/docx-editor-sdk/javascript-docx-editor?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples) 

- **Documentation:**   [Syncfusion&reg; JavaScript (ES6) DOCX Editor - Documentation](https://help.syncfusion.com/document-processing/word/word-processor/javascript-es6/overview?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples) 

- **Online demo:**   [Syncfusion&reg; JavaScript (ES6) DOCX Editor - Online demo](https://document.syncfusion.com/demos/docx-editor/javascript/#/material3/document-editor/default.html?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples) 

# Support and feedback

For any other queries, reach our [Syncfusion&reg; support team](https://support.syncfusion.com/?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples) or post the queries through the [community forums](https://www.syncfusion.com/forums?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples). 

Request new feature through [Syncfusion&reg; feedback portal](https://www.syncfusion.com/feedback?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples). 

# License 

This is a commercial product and requires a paid license for possession or use. Syncfusion's licensed software, including this component, is subject to the terms and conditions of [Syncfusion's EULA](https://www.syncfusion.com/license/studio/22.2.5/syncfusion_essential_studio_eula.pdf?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples). You can purchase a license [here](https://www.syncfusion.com/sales/products?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples) or start a free 30\-day trial [here](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples).

# About Syncfusion&reg;

Founded in 2001 and headquartered in Research Triangle Park, N.C., Syncfusion&reg; has more than 29,000 customers and more than 1 million users, including large financial institutions, Fortune 500 companies, and global IT consultancies.

Today, we provide 1700+ components and frameworks for web ([Blazor](https://www.syncfusion.com/blazor-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [ASP.NET WebForms](https://www.syncfusion.com/aspnet-webforms-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [Angular](https://www.syncfusion.com/angular-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [React](https://www.syncfusion.com/react-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [Vue](https://www.syncfusion.com/vue-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), and [Flutter](https://www.syncfusion.com/flutter-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples)), mobile ([Xamarin](https://www.syncfusion.com/xamarin-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [Flutter](https://www.syncfusion.com/flutter-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [UWP](https://www.syncfusion.com/uwp-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), and [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [.NET MAUI](https://www.syncfusion.com/net-maui-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples)) and desktop development ([WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [WPF](https://www.syncfusion.com/wpf-ui-controls?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [WinUI](https://www.syncfusion.com/winui-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [Flutter](https://www.syncfusion.com/flutter-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), [UWP](https://www.syncfusion.com/uwp-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples), and [.NET MAUI](https://www.syncfusion.com/net-maui-components?utm_source=github&utm_medium=listing&utm_campaign=github-javascript-es6-docx-editor-examples)). We provide ready-to-deploy enterprise software for dashboards, reports, data integration, and big data processing. Many customers have saved millions in licensing fees by deploying our software.
