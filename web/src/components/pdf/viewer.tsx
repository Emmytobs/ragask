"use client";
import React, { useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core";

import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";

import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

import packageJson from "../../../package.json";
import Loading from "@/components/loading";
const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

type PDFProps = {
  fileUrl: string;
  currentPage: number;
};

const PDF = (props: PDFProps) => {
  const { fileUrl, currentPage } = props;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const toolbarPluginInstance = toolbarPlugin({});
  const { Toolbar } = toolbarPluginInstance;
  const { jumpToPage} = pageNavigationPluginInstance;

  useEffect(() => {
    jumpToPage(currentPage-1);
  }, [currentPage]);

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
        <Toolbar  />
        <Viewer
          fileUrl={fileUrl}
          renderLoader={() => <Loading />}
          initialPage={currentPage-1}
          plugins={[toolbarPluginInstance, pageNavigationPluginInstance]}
        />
      </div>
    </Worker>
  );
};
export { PDF };
