"use client";
import React from "react";
import { Viewer } from "@react-pdf-viewer/core";

import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";

import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

import packageJson from "../../../package.json";
import Loading from "@/components/loading";
const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

type PDFProps = {
  fileUrl: string;
};

const PDF = (props: PDFProps) => {
  const { fileUrl } = props;

  const toolbarPluginInstance = toolbarPlugin({});
  const { Toolbar } = toolbarPluginInstance;

  return (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
    >
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
          renderLoader={() => <Loading />}
          plugins={[toolbarPluginInstance]}
        />
      </div>
    </Worker>
  );
};
export { PDF };
