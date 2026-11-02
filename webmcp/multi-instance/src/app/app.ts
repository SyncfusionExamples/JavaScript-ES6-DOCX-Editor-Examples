import { DocumentEditorContainer, Toolbar, Ribbon, WebMcpToolExecuteEventArgs, WebMcpDocumentEditor } from '@syncfusion/ej2-documenteditor';

// Inject required modules
DocumentEditorContainer.Inject(Toolbar, Ribbon, WebMcpDocumentEditor);

// WebMCP settings for first editor
const webMcpSettings1 = {
    name: 'documentEditor1',
};

// First Document Editor instance
const docEditor1 = new DocumentEditorContainer({
    height: '590px',
    width:'50%',
    enableWebMcp: true,
    webMcpSettings: webMcpSettings1,
    documentEditorSettings: {
        showRuler: true,
        showBookmarks: true
    },
    toolbarMode: 'Ribbon'
});

docEditor1.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';
docEditor1.appendTo('#container1');

// WebMCP settings for second editor
const webMcpSettings2 = {
    name: 'documentEditor2',
};

// Second Document Editor instance
const docEditor2 = new DocumentEditorContainer({
    height: '590px',
    width:'50%',
    enableWebMcp: true,
    webMcpSettings: webMcpSettings2,
    documentEditorSettings: {
        showRuler: true,
        showBookmarks: true
    },
    toolbarMode: 'Ribbon'
});

docEditor2.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';
docEditor2.appendTo('#container2');

document.title = 'WebMCP Multi-Instance Demo - DocumentEditorContainer';