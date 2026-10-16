import { DocumentEditorContainer, Toolbar } from '@syncfusion/ej2-documenteditor';
import { originalDocument, revisedDocument } from './data';

DocumentEditorContainer.Inject(Toolbar);

// Utilise the correct Service URL where the Import and CompareDocument Web APIs are hosted.
// If you choose to use localhost, please update the URL below to 'http://localhost:62870/api/DocumentEditor/';
const serviceUrl: string =
    'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

let container1: DocumentEditorContainer;
let container2: DocumentEditorContainer;

let originalFile: File | null = null;
let revisedFile: File | null = null;
let compareClicked: boolean = false;
let showResult: boolean = true;
let showRevisions: boolean = false;

const editor1TitleText: HTMLElement | null = document.getElementById('right-editor-title-text');
const originalInfoText: HTMLElement | null = document.getElementById('original-info-text');
const revisedInfoText: HTMLElement | null = document.getElementById('revised-info-text');
const originalClear: HTMLElement | null = document.getElementById('original-clear');
const revisedClear: HTMLElement | null = document.getElementById('revised-clear');
const originalInput: HTMLInputElement | null = document.getElementById('original-input') as HTMLInputElement;
const revisedInput: HTMLInputElement | null = document.getElementById('revised-input') as HTMLInputElement;
const showResultInput: HTMLInputElement | null = document.getElementById('show-result') as HTMLInputElement;
const compareBtn: HTMLButtonElement | null = document.getElementById('compare-btn') as HTMLButtonElement;
const downloadBtn: HTMLButtonElement | null = document.getElementById('download-btn') as HTMLButtonElement;
const revisionPaneBtn: HTMLButtonElement | null = document.getElementById('revision-pane-btn') as HTMLButtonElement;
const revisionPaneLabel: HTMLElement | null = document.getElementById('revision-pane-label');
const waitingPopup: HTMLElement | null = document.getElementById('waiting-popup');
const popupOverlay: HTMLElement | null = document.getElementById('popup-overlay');

function showHideWaitingIndicator(show: boolean): void {
    if (waitingPopup && popupOverlay) {
        popupOverlay.style.display = show ? 'block' : 'none';
        waitingPopup.style.display = show ? 'block' : 'none';
    }
}

function updateButtons(): void {
    if (compareBtn) {
        compareBtn.disabled = !(originalFile && revisedFile);
    }
    if (downloadBtn) {
        downloadBtn.disabled = !compareClicked;
    }
}

function updateRightEditorTitle(): void {
    if (editor1TitleText) {
        editor1TitleText.textContent = showResult
            ? 'Result Document (with tracked changes)'
            : 'Revised Document';
    }
    if (revisionPaneBtn) {
        revisionPaneBtn.style.display = showResult ? '' : 'none';
    }
}

function updateOriginalInfo(): void {
    if (originalInfoText && originalClear) {
        if (originalFile) {
            originalInfoText.textContent = `${originalFile.name} (${Math.round(originalFile.size / 1024)} KB)`;
            originalClear.style.display = '';
        } else {
            originalInfoText.textContent = 'Supported formats: SFDT, DOCX';
            originalClear.style.display = 'none';
        }
    }
}

function updateRevisedInfo(): void {
    if (revisedInfoText && revisedClear) {
        if (revisedFile) {
            revisedInfoText.textContent = `${revisedFile.name} (${Math.round(revisedFile.size / 1024)} KB)`;
            revisedClear.style.display = '';
        } else {
            revisedInfoText.textContent = 'Supported formats: SFDT, DOCX';
            revisedClear.style.display = 'none';
        }
    }
}

function openFileInEditor(
    file: File,
    container: DocumentEditorContainer
): Promise<void> {
    return new Promise<void>((resolve) => {
        if (file.name.endsWith('.sfdt')) {
            const reader: FileReader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const docData: string | undefined = e.target?.result as string | undefined;
                if (docData && container.documentEditor) {
                    container.documentEditor.showRevisions = false;
                    container.documentEditor.open(docData);
                }
                resolve();
            };
            reader.readAsText(file);
        } else {
            const formData: FormData = new FormData();
            formData.append('file', file);
            fetch(serviceUrl + 'Import', {
                method: 'POST',
                body: formData
            })
                .then((response) => response.text())
                .then((sfdtString: string) => {
                    let sfdtObject: any = null;
                    try {
                        sfdtObject = JSON.parse(sfdtString);
                    } catch (e) {
                        alert('Failed to process the compared document due to no valid JSON. Please try again.');
                    }
                    if (sfdtObject && container.documentEditor) {
                        container.documentEditor.showRevisions = false;
                        container.documentEditor.open(sfdtObject);
                    } else {
                        alert('Unable to display the compared document. Please try again.');
                    }
                    resolve();
                })
                .catch(() => {
                    alert(
                        'This Compare Documents demo supports only DOCX and SFDT file formats. Please select a valid DOCX or SFDT document and try again.'
                    );
                    resolve();
                });
        }
    });
}

function loadComparedDocumentAndOpen(
    container: DocumentEditorContainer,
    original: File,
    revised: File
): Promise<void> {
    const formData: FormData = new FormData();
    formData.append('originalFile', original);
    formData.append('revisedFile', revised);
    formData.append('author', 'Author');
    formData.append('dateTime', new Date().toISOString());
    return fetch(serviceUrl + 'CompareDocuments', {
        method: 'POST',
        body: formData
    })
        .then((response) => {
            if (!response.ok) {
                alert('Failed to compare the selected documents. Please try again.');
                throw new Error('compare failed');
            }
            return response.text();
        })
        .then((sfdtString: string) => {
            let sfdtObject: any = null;
            try {
                sfdtObject = JSON.parse(sfdtString);
            } catch {
                alert('The comparison could not be completed due to no valid JSON. Please try again.');
                throw new Error('invalid json');
            }
            if (sfdtObject && container.documentEditor) {
                container.documentEditor.showRevisions = false;
                container.documentEditor.open(sfdtObject);
            } else {
                alert('Unable to display the comparison result. Please try again.');
            }
        });
}

function onCompare(): void {
    compareClicked = false;
    showRevisions = false;
    updateButtons();

    if (originalFile && revisedFile) {
        const isOriginalSupported: boolean =
            originalFile.name.endsWith('.sfdt') || originalFile.name.endsWith('.docx');
        const isRevisedSupported: boolean =
            revisedFile.name.endsWith('.sfdt') || revisedFile.name.endsWith('.docx');

        if (isOriginalSupported && isRevisedSupported) {
            compareClicked = true;
            updateButtons();
            showHideWaitingIndicator(true);

            const onComplete = (): void => {
                showHideWaitingIndicator(false);
            };

            if (showResult) {
                Promise.resolve()
                    .then(() => openFileInEditor(originalFile!, container1))
                    .then(() =>
                        loadComparedDocumentAndOpen(container2, originalFile!, revisedFile!)
                    )
                    .then(onComplete)
                    .catch(onComplete);
            } else {
                Promise.resolve()
                    .then(() => openFileInEditor(originalFile!, container1))
                    .then(() => openFileInEditor(revisedFile!, container2))
                    .then(onComplete)
                    .catch(onComplete);
            }
        } else {
            alert(
                'This Compare Documents demo supports only DOCX and SFDT file formats. Please select a valid DOCX or SFDT document and try again.'
            );
        }
    }
}

function onDownload(): void {
    if (container2 && container2.documentEditor) {
        container2.documentEditor.save('Result', 'Docx');
    }
}

function toggleRevisionPane(): void {
    showRevisions = !showRevisions;
    if (container2 && container2.documentEditor) {
        container2.documentEditor.showRevisions = showRevisions;
    }
    if (revisionPaneLabel) {
        revisionPaneLabel.textContent = showRevisions ? ' Hide Review Pane' : ' Show Review Pane';
    }
}

function attachEditorEvents(): void {
    if (!container1 || !container2) {
        return;
    }
    const editor1 = container1.documentEditor;
    const editor2 = container2.documentEditor;
    if (!editor1 || !editor2) {
        return;
    }

    editor1.open(JSON.stringify(originalDocument));
    editor2.showRevisions = false;
    editor2.open(JSON.stringify(revisedDocument));

    editor1.viewChange = () => {
        const pos = editor1.selection.getScrollPosition();
        editor2.selection.setScrollPosition(pos);
    };
    editor2.viewChange = () => {
        const pos = editor2.selection.getScrollPosition();
        editor1.selection.setScrollPosition(pos);
    };
}

function initEditors(): void {
    container1 = new DocumentEditorContainer({
        enableToolbar: false,
        showPropertiesPane: false,
        serviceUrl: serviceUrl,
        height: '100%',
        width: '100%'
    });
    container1.appendTo('#DocumentEditor1');

    container2 = new DocumentEditorContainer({
        enableToolbar: false,
        showPropertiesPane: false,
        serviceUrl: serviceUrl,
        height: '100%',
        width: '100%'
    });
    container2.appendTo('#DocumentEditor2');

    // Wait for both editors to be created before attaching events and loading defaults.
    setTimeout(attachEditorEvents, 0);
}

function attachUiEvents(): void {
    if (originalInput) {
        originalInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file: File | undefined = target.files ? target.files[0] : undefined;
            if (file) {
                originalFile = file;
                compareClicked = false;
                updateOriginalInfo();
                updateButtons();
            }
        });
    }
    if (revisedInput) {
        revisedInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file: File | undefined = target.files ? target.files[0] : undefined;
            if (file) {
                revisedFile = file;
                compareClicked = false;
                updateRevisedInfo();
                updateButtons();
            }
        });
    }
    if (originalClear) {
        originalClear.addEventListener('click', () => {
            originalFile = null;
            compareClicked = false;
            if (originalInput) {
                originalInput.value = '';
            }
            updateOriginalInfo();
            updateButtons();
        });
    }
    if (revisedClear) {
        revisedClear.addEventListener('click', () => {
            revisedFile = null;
            compareClicked = false;
            if (revisedInput) {
                revisedInput.value = '';
            }
            updateRevisedInfo();
            updateButtons();
        });
    }
    if (showResultInput) {
        showResultInput.addEventListener('change', () => {
            showResult = showResultInput.checked;
            updateRightEditorTitle();
        });
    }
    if (compareBtn) {
        compareBtn.addEventListener('click', onCompare);
    }
    if (downloadBtn) {
        downloadBtn.addEventListener('click', onDownload);
    }
    if (revisionPaneBtn) {
        revisionPaneBtn.addEventListener('click', toggleRevisionPane);
    }

    updateRightEditorTitle();
    updateOriginalInfo();
    updateRevisedInfo();
    updateButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    initEditors();
    attachUiEvents();
});