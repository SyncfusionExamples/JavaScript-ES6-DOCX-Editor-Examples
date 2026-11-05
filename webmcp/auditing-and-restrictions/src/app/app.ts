import { DocumentEditorContainer, Toolbar, Ribbon, WebMcpToolExecuteEventArgs, WebMcpDocumentEditor } from '@syncfusion/ej2-documenteditor';

// Inject required modules
DocumentEditorContainer.Inject(Toolbar, Ribbon, WebMcpDocumentEditor);

// Initialize DocumentEditorContainer with WebMCP enabled
let webMcpTools: any[] = [];
let webMcpSettings: any = {
        name: 'container',
    };

let container: DocumentEditorContainer = new DocumentEditorContainer({
    height: '590px',
    enableWebMcp: true,
    webMcpSettings: webMcpSettings, // Enable WebMCP tools
    documentEditorSettings: {
        showRuler: true,
        showBookmarks: true,
    },
    toolbarMode: 'Ribbon',
});

container.beforeWebMcpToolExecute = (args: WebMcpToolExecuteEventArgs): void => {
    const { toolName, toolArgs } = args;

    // Audit all WebMCP tool invocations
    console.log(`[WebMCP] Executing: ${toolName}`, toolArgs);
    const commandName = toolName?.includes('_')
        ? toolName.substring(toolName.indexOf('_') + 1)
        : toolName;

    // Restrict a specific tools
    if (commandName === 'saveDocument') {
        args.cancel = true;
        args.cancellationResponse = "The saveDocument operation has been restricted.";
    }
};

// Set service URL for document operations
container.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

// Append to container element
container.appendTo('#container');

// Update document title
document.title = 'WebMCP Tool Demo - DocumentEditorContainer';