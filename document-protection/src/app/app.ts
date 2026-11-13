import {
    DocumentEditorContainer,
    Toolbar,
    Ribbon,
    DocumentEditor,
    FormatType,
    ProtectionType
} from '@syncfusion/ej2-documenteditor';
import documentProtectionData from '../resources/data/data-document-protection.json';

DocumentEditorContainer.Inject(Toolbar, Ribbon);

/**
 * User roles and their document permissions.
 * The document-level protection for each user is enforced at runtime from
 * this list, while the Nancy's editable price ranges are already embedded
 * in the loaded SFDT document (data-document-protection.json).
 */
interface UserPermission {
    name: string;
    email: string;
    role: string;
    protectionType: ProtectionType;
    description: string;
}

const users: UserPermission[] = [
    {
        name: 'Nancy',
        email: 'nancy@example.com',
        role: 'Price Editor',
        protectionType: 'ReadOnly',
        description: 'Can edit only the price values (editable ranges marked in the document)'
    },
    {
        name: 'Andrew',
        email: 'andrew@example.com',
        role: 'Reviewer',
        protectionType: 'RevisionsOnly',
        description: 'All edits are tracked as revisions; cannot accept or reject revisions'
    },
    {
        name: 'Steven',
        email: 'steven@example.com',
        role: 'Commenter',
        protectionType: 'CommentsOnly',
        description: 'Can insert comments only; cannot edit document content'
    },
    {
        name: 'Michael',
        email: 'michael@example.com',
        role: 'Editor',
        protectionType: 'NoProtection',
        description: 'Full editing access on the entire document'
    },
    {
        name: 'Laura',
        email: 'laura@example.com',
        role: 'Viewer',
        protectionType: 'ReadOnly',
        description: 'Read-only access; can export the document as DOCX and PDF only'
    }
];

const container: DocumentEditorContainer = new DocumentEditorContainer({
    enableToolbar: true,
    toolbarMode: 'Ribbon',
    height: '590px',
    // Use the following service URL only for demo purposes
    serviceUrl: 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/'
});
container.appendTo('#DocumentEditor');

const documentEditor: DocumentEditor = container.documentEditor;
let currentUser: UserPermission = users[0];

documentEditor.open(JSON.stringify((<any>documentProtectionData)));
applyUserPermissions(currentUser);

const userSelect: HTMLSelectElement = document.getElementById('userSelect') as HTMLSelectElement;
users.forEach(function (user: UserPermission): void {
    const option: HTMLOptionElement = document.createElement('option');
    option.value = user.email;
    option.text = user.name;
    userSelect.appendChild(option);
});

userSelect.addEventListener('change', function (): void {
    const selected: UserPermission | undefined = users.find(function (user: UserPermission): boolean {
        return user.email === userSelect.value;
    });
    if (selected) {
        currentUser = selected;
        applyUserPermissions(currentUser);
    }
});

/**
 * Enforces the document protection for the selected user.
 * The Document Editor checks `documentHelper.isDocumentProtected` along with
 * the editable ranges of `currentUser`, so switching the user re-applies the
 * restrictions of the loaded document instantly.
 */
function applyUserPermissions(user: UserPermission): void {
    // Clear the previous protection before applying the new user's rights
    if (documentEditor.documentHelper.isDocumentProtected) {
        documentEditor.editorModule.unProtectDocument();
    }
    // Reset read-only restriction of the container (used for Laura)
    documentEditor.isReadOnly = false;
    documentEditor.currentUser = user.email;
    if (user.protectionType !== 'NoProtection') {
        // Enforces ReadOnly, RevisionsOnly or CommentsOnly without a password
        documentEditor.editorModule.enforceProtection('', user.protectionType);
    }
    if (user.email === 'laura@example.com') {
        // Laura: read-only access, only DOCX and PDF export from custom buttons
        documentEditor.isReadOnly = true;
    }
    // Close the built-in restrict editing pane; the sample shows the effective
    // permissions in its own panel on the right
    documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(false);
    updatePermissionBanner(user);
}

/**
 * Andrew works in `RevisionsOnly` protection: every edit is tracked, but the
 * built-in accept/reject actions are blocked, so a reviewer with approval
 * rights (e.g. Michael, the full editor) reviews and approves the changes.
 */
documentEditor.beforeAcceptRejectChanges = function (args: any): void {
    if (currentUser.email === 'andrew@example.com') {
        // Cancel the accept/reject action for Andrew
        args.cancel = true;
    }
};

/**
 * Exports the current document content as PDF through the online demo web
 * service `Export` action.
 */
function formatSave(format: string): void {
    const http: XMLHttpRequest = new XMLHttpRequest();
    http.open('POST', documentEditor.serviceUrl + 'Export');
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    http.responseType = 'blob';

    const sfdt: object = {
        Content: documentEditor.serialize(),
        Filename: 'Adventure Works Cycles',
        Format: '.' + format
    };

    http.onload = function (): void {
        if (http.status === 200) {
            const blobUrl: string = URL.createObjectURL(http.response);
            const downloadLink: HTMLAnchorElement = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = 'Adventure Works Cycles.' + format.toLowerCase();
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
        } else {
            console.error('Export request failed with status: ' + http.status);
        }
    };

    http.send(JSON.stringify(sfdt));
}

const exportDocxButton: HTMLButtonElement = document.getElementById('exportDocx') as HTMLButtonElement;
exportDocxButton.addEventListener('click', function (): void {
    documentEditor.save('Adventure Works Cycles', 'Docx' as FormatType);
});

const exportPdfButton: HTMLButtonElement = document.getElementById('exportPdf') as HTMLButtonElement;
exportPdfButton.addEventListener('click', function (): void {
    formatSave('Pdf');
});

function updatePermissionBanner(user: UserPermission): void {
    const banner: HTMLElement | null = document.getElementById('permissionBanner');
    if (banner) {
        banner.textContent = 'Signed in as ' + user.name + ' (' + user.email + ') - ' + user.role;
    }
}