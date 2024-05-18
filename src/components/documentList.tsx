import React, { useState } from 'react';
// import PDFViewer from './pdfViewer';
import { PDF } from './pdf';

const documents = [
  { name: 'First.pdf', url: './test.pdf' },
];

const DocumentList = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  return (
    <div className="flex  h-screen">

    </div>
  );
};

export default DocumentList;