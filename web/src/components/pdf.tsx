"use client";
import React from "react";
import { Viewer } from "@react-pdf-viewer/core";

import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";

import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

type PDFProps = {
  fileUrl: string;
};

const PDF = (props: PDFProps) => {
  const { fileUrl } = props;

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
          fileUrl={fileUrl}
          plugins={[toolbarPluginInstance]}
        />
      </div>
    </Worker>
  );
};
export { PDF };
