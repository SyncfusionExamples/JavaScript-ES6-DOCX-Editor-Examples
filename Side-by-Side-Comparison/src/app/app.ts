import { DocumentEditorContainer, Toolbar } from '@syncfusion/ej2-documenteditor';

// Inject the required modules into DocumentEditorContainer.
DocumentEditorContainer.Inject(Toolbar);

// Online Syncfusion Document Editor web service hosting Import and CompareDocuments APIs.
// If you run the service locally, replace with your own URL (for example, 'http://localhost:62870/api/DocumentEditor/').
const serviceUrl: string =
  'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

// Layout shell first so the editor targets exist in the DOM before appendTo() runs.
interface AppState {
  originalFile: File | null;
  revisedFile: File | null;
  compareClicked: boolean;
  showResult: boolean;
  showRevisions: boolean;
}

const state: AppState = {
  originalFile: null,
  revisedFile: null,
  compareClicked: false,
  showResult: true,
  showRevisions: false
};

const buildShell = (): void => {
  const root = document.getElementById('ui-root');
  if (!root) {
    return;
  }
  root.innerHTML = `
    <div class="control-pane">
      <div class="control-section compare-shell">
        <div class="upload-row">
          <div class="upload-card">
            <div class="upload-top">
              <span>Original document</span>
              <label class="upload-btn">
                Choose file
                <input id="original-input" type="file" accept=".docx,.sfdt" hidden />
              </label>
            </div>
            <div class="upload-meta">
              <span id="original-input-name">Supported formats: SFDT, DOCX</span>
              <span id="original-input-trash" class="e-icons e-trash" title="Remove file" hidden></span>
            </div>
          </div>

          <div class="upload-card">
            <div class="upload-top">
              <span>Revised document</span>
              <label class="upload-btn">
                Choose file
                <input id="revised-input" type="file" accept=".docx,.sfdt" hidden />
              </label>
            </div>
            <div class="upload-meta">
              <span id="revised-input-name">Supported formats: SFDT, DOCX</span>
              <span id="revised-input-trash" class="e-icons e-trash" title="Remove file" hidden></span>
            </div>
          </div>
        </div>

        <div class="controls-row">
          <label class="checkbox-row">
            <input id="show-result" type="checkbox" checked />
            <span>Show comparison results with tracked changes</span>
          </label>
          <div class="action-buttons">
            <button id="btn-compare" class="e-btn e-primary" disabled>Compare</button>
            <button id="btn-download" class="e-btn e-outline e-flat e-primary" disabled>
              <span class="e-icons e-download"></span>
              Download Result Document
            </button>
          </div>
        </div>

        <div class="editors">
          <div class="editor-card">
            <div class="editor-title">Original Document</div>
            <div id="DocumentEditor1" class="editor-host"></div>
          </div>
          <div class="editor-card">
            <div class="editor-title editor-title-flex">
              <span id="right-title">Result Document (with tracked changes)</span>
              <button id="btn-revisions" class="revision-toggle" type="button">
                <span class="e-icons e-eye"></span>
                <span id="revision-toggle-label"> Show Review Pane</span>
              </button>
            </div>
            <div id="DocumentEditor2" class="editor-host"></div>
          </div>
        </div>

        <div id="popup-overlay" class="overlay"></div>
        <div id="waiting-popup">
          <svg class="circular" height="40" width="40">
            <circle class="circle-path" cx="20" cy="20" r="16" fill="none" stroke-width="6" strokeMiterlimit="10"></circle>
          </svg>
        </div>
      </div>
    </div>
  `;
};

buildShell();

// Left (original) and right (result / revised) Document Editor containers.
const editor1: DocumentEditorContainer = new DocumentEditorContainer({
  enableToolbar: false,
  showPropertiesPane: false,
  height: '100%',
  width: '100%',
  serviceUrl
});

const editor2: DocumentEditorContainer = new DocumentEditorContainer({
  enableToolbar: false,
  showPropertiesPane: false,
  height: '100%',
  width: '100%',
  serviceUrl
});

editor1.appendTo('#DocumentEditor1');
editor2.appendTo('#DocumentEditor2');

// Show / hide the spinner overlay while a service call is in flight.
const showHideWaitingIndicator = (show: boolean): void => {
  const waitingPopUp: HTMLElement | null = document.getElementById('waiting-popup');
  const overlay: HTMLElement | null = document.getElementById('popup-overlay');
  if (waitingPopUp && overlay) {
    overlay.style.display = show ? 'block' : 'none';
    waitingPopUp.style.display = show ? 'block' : 'none';
  }
};

// Imports a DOCX/SFDT file into the supplied editor using the Document Editor web service.
const openFileInEditor = async (
  file: File,
  target: DocumentEditorContainer
): Promise<void> => {
  const inner = target.documentEditor;
  if (!inner) {
    return;
  }

  if (file.name.toLowerCase().endsWith('.sfdt')) {
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const docData = ev.target ? (ev.target.result as string) : undefined;
      if (docData) {
        inner.showRevisions = false;
        inner.open(docData);
      }
    };
    reader.readAsText(file);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(serviceUrl + 'Import', {
      method: 'POST',
      body: formData
    });
    const sfdtString = await response.text();
    let sfdtObject: object | null = null;
    try {
      sfdtObject = JSON.parse(sfdtString);
    } catch {
      alert(
        'Failed to process the document due to invalid JSON. Please try again.'
      );
    }
    if (sfdtObject) {
      inner.showRevisions = false;
      inner.open(sfdtObject as unknown as string);
    } else {
      alert('Unable to display the document. Please try again.');
    }
  } catch {
    alert(
      'This Compare Documents sample supports only DOCX and SFDT file formats. Please select a valid DOCX or SFDT document and try again.'
    );
  }
};

// Calls the CompareDocuments web API and opens the tracked-changes result in the right editor.
const loadComparedDocumentAndOpen = async (
  originalFile: File,
  revisedFile: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('originalFile', originalFile);
  formData.append('revisedFile', revisedFile);
  formData.append('author', 'Author');
  formData.append('dateTime', new Date().toISOString());

  const response = await fetch(serviceUrl + 'CompareDocuments', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    alert('Failed to compare the selected documents. Please try again.');
    return;
  }

  const sfdtString = await response.text();
  let sfdtObject: object | null = null;
  try {
    sfdtObject = JSON.parse(sfdtString);
  } catch {
    alert('The comparison could not be completed due to invalid JSON. Please try again.');
    return;
  }

  const inner = editor2.documentEditor;
  if (sfdtObject && inner) {
    inner.showRevisions = false;
    inner.open(sfdtObject as unknown as string);
  } else {
    alert('Unable to display the comparison result. Please try again.');
  }
};

// Reads the user-selected files and renders the result / revised document in the right editor.
const onCompare = async (): Promise<void> => {
  state.compareClicked = false;
  state.showRevisions = false;
  const revisionLabel = document.getElementById('revision-toggle-label');
  if (revisionLabel) {
    revisionLabel.textContent = ' Show Review Pane';
  }

  const original = state.originalFile;
  const revised = state.revisedFile;
  if (!original || !revised) {
    return;
  }

  const isOriginalSupported =
    original.name.toLowerCase().endsWith('.sfdt') ||
    original.name.toLowerCase().endsWith('.docx');
  const isRevisedSupported =
    revised.name.toLowerCase().endsWith('.sfdt') ||
    revised.name.toLowerCase().endsWith('.docx');

  if (!isOriginalSupported || !isRevisedSupported) {
    alert(
      'This Compare Documents sample supports only DOCX and SFDT file formats. Please select a valid DOCX or SFDT document and try again.'
    );
    return;
  }

  state.compareClicked = true;
  showHideWaitingIndicator(true);
  try {
    await openFileInEditor(original, editor1);
    if (state.showResult) {
      await loadComparedDocumentAndOpen(original, revised);
    } else {
      await openFileInEditor(revised, editor2);
    }
  } finally {
    showHideWaitingIndicator(false);
  }
};

// Downloads the right-side editor's current contents as a DOCX file.
const onDownload = (): void => {
  const inner = editor2.documentEditor;
  if (inner) {
    inner.save('Result', 'Docx');
  }
};

// Toggles the revision pane and the showRevisions flag on the right editor.
const toggleRevisionPane = (): void => {
  state.showRevisions = !state.showRevisions;
  const inner = editor2.documentEditor;
  if (inner) {
    inner.showRevisions = state.showRevisions;
  }
  const label = document.getElementById('revision-toggle-label');
  if (label) {
    label.textContent = state.showRevisions
      ? ' Hide Review Pane'
      : ' Show Review Pane';
  }
};

// Updates the file name label beneath each "Choose file" picker.
const updateFileLabel = (inputId: string, file: File | null): void => {
  const label = document.getElementById(inputId + '-name');
  if (!label) {
    return;
  }
  if (file) {
    label.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
  } else {
    label.textContent = 'Supported formats: SFDT, DOCX';
  }
  const trash = document.getElementById(inputId + '-trash');
  if (trash) {
    trash.style.display = file ? 'inline-block' : 'none';
  }
};

const wireUi = (): void => {
  const originalInput = document.getElementById('original-input') as HTMLInputElement | null;
  const revisedInput = document.getElementById('revised-input') as HTMLInputElement | null;
  const originalTrash = document.getElementById('original-input-trash') as HTMLElement | null;
  const revisedTrash = document.getElementById('revised-input-trash') as HTMLElement | null;
  const compareBtn = document.getElementById('btn-compare') as HTMLButtonElement | null;
  const downloadBtn = document.getElementById('btn-download') as HTMLButtonElement | null;
  const revisionsBtn = document.getElementById('btn-revisions') as HTMLButtonElement | null;
  const showResultInput = document.getElementById('show-result') as HTMLInputElement | null;
  const rightTitle = document.getElementById('right-title');

  if (
    !originalInput ||
    !revisedInput ||
    !originalTrash ||
    !revisedTrash ||
    !compareBtn ||
    !downloadBtn ||
    !revisionsBtn ||
    !showResultInput
  ) {
    return;
  }

  const refreshCompareEnabled = (): void => {
    compareBtn.disabled = !(state.originalFile && state.revisedFile);
  };

  originalInput.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files && target.files[0] ? target.files[0] : null;
    state.originalFile = file;
    state.compareClicked = false;
    updateFileLabel('original-input', file);
    refreshCompareEnabled();
  });

  revisedInput.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files && target.files[0] ? target.files[0] : null;
    state.revisedFile = file;
    state.compareClicked = false;
    updateFileLabel('revised-input', file);
    refreshCompareEnabled();
  });

  originalTrash.addEventListener('click', () => {
    state.originalFile = null;
    state.compareClicked = false;
    originalInput.value = '';
    updateFileLabel('original-input', null);
    downloadBtn.disabled = true;
    refreshCompareEnabled();
  });

  revisedTrash.addEventListener('click', () => {
    state.revisedFile = null;
    state.compareClicked = false;
    revisedInput.value = '';
    updateFileLabel('revised-input', null);
    downloadBtn.disabled = true;
    refreshCompareEnabled();
  });

  compareBtn.addEventListener('click', async () => {
    await onCompare();
    downloadBtn.disabled = !state.compareClicked;
  });

  downloadBtn.addEventListener('click', onDownload);
  revisionsBtn.addEventListener('click', toggleRevisionPane);

  showResultInput.addEventListener('change', () => {
    state.showResult = showResultInput.checked;
    if (rightTitle) {
      rightTitle.textContent = state.showResult
        ? 'Result Document (with tracked changes)'
        : 'Revised Document';
    }
  });
};

// Keep the two editors in sync as the user scrolls through either document.
const wireUpSyncedScrolling = (): void => {
  const e1 = editor1.documentEditor;
  const e2 = editor2.documentEditor;
  if (!e1 || !e2) {
    return;
  }

  e1.viewChange = (): void => {
    const pos = e1.selection.getScrollPosition();
    e2.selection.setScrollPosition(pos);
  };
  e2.viewChange = (): void => {
    const pos = e2.selection.getScrollPosition();
    e1.selection.setScrollPosition(pos);
  };
};

editor1.created = (): void => {
  wireUi();
  wireUpSyncedScrolling();
};

editor2.created = (): void => {
  const inner = editor2.documentEditor;
  if (inner) {
    inner.showRevisions = false;
  }
};