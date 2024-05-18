"use client";
import React from "react";
// Create style

// ReactPDF.render(<MyDocument />, `./test.pdf`);
// ReactPDF.renderToStream(<MyDocument />);
// Import the main component
import { Viewer } from "@react-pdf-viewer/core";

import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

import "@react-pdf-viewer/toolbar/lib/styles/index.css";

// Import styles

// Your render function

import { Worker } from "@react-pdf-viewer/core";

const PDF = () => {
  const toolbarPluginInstance = toolbarPlugin({});
  const { Toolbar } = toolbarPluginInstance;

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div
        style={{
          height: "100vh",
          width: "100%",
          paddingBottom: "4rem",
        }}
      >
        <Toolbar />
        <Viewer
          fileUrl="https://aimaasdev.blob.core.windows.net/deepdocuments/2010-toyota-matrix-73.pdf?sp=r&st=2024-05-18T01:12:21Z&se=2024-05-18T09:12:21Z&spr=https&sv=2022-11-02&sr=b&sig=LTsFWygIsiFlIr0P8ItjGnR3vWcs9fuDJdIQe0A08jg%3D"
          plugins={[toolbarPluginInstance]}
          // defaultScale={1}
          // https://portal.azure.com/#view/Microsoft_Azure_Storage/BlobPropertiesBladeV2/storageAccountId/%2Fsubscriptions%2Fd76a23b6-c31e-4ab9-83dc-1b27c3ce71b1%2FresourceGroups%2Faimaas-dev%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Faimaasdev/path/deepdocuments%2F2010-toyota-matrix-73.pdf/isDeleted~/false/tabToload~/0
        />
      </div>
    </Worker>
  );
};
export { PDF };
