import { DocumentEditorContainer, Toolbar, Ribbon, WebMcpDocumentEditor } from '@syncfusion/ej2-documenteditor';

// Inject required modules
DocumentEditorContainer.Inject(Toolbar, Ribbon, WebMcpDocumentEditor);

// Initialize DocumentEditorContainer with WebMCP enabled
let webMcpSettings: any = {
        name: 'container',
        tools: [ 'getDocumentBookmarks', 'getSelectionText', 'find', 'findAll', 'goToPage' ] //Register only with needed tools
    };

let container: DocumentEditorContainer = new DocumentEditorContainer({
    height: '590px',
    enableWebMcp: true,
    webMcpSettings: webMcpSettings, // Enable WebMCP tools
    toolbarMode: 'Ribbon'
});

// Set service URL for document operations
container.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

// Append to container element
container.appendTo('#container');

// Update document title
document.title = 'WebMCP Tool Demo - DocumentEditorContainer';
