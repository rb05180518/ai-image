"use client";

import { useState } from "react";
import { Input, Upload, Button, Alert } from "antd";
import { PlusOutlined, ArrowUpOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import classNames from "classnames";
import styles from "./styles.module.css";

const { TextArea } = Input;

interface GenerateProps {
  className?: string;
}

type AspectRatio = "square" | "16:9" | "9:16" | "3:4" | "4:3";
type Model = "basic" | "pro";

export default function Generate({ className }: GenerateProps) {
  const [prompt, setPrompt] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model>("pro");
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("4:3");

  const aspectRatios: { value: AspectRatio; label: string; icon: string }[] = [
    { value: "square", label: "Square", icon: "⬜" },
    { value: "16:9", label: "16:9", icon: "▭" },
    { value: "9:16", label: "9:16", icon: "▯" },
    { value: "3:4", label: "3:4", icon: "▯" },
    { value: "4:3", label: "4:3", icon: "▭" },
  ];

  const handleUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  return (
    <div className={classNames("flex gap-6", className)}>
      {/* Left Panel - Form */}
      <div className="flex-1 max-w-128.75 space-y-6">
        {/* Prompt Section */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Prompt
          </label>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={6}
            className="w-full resize-none rounded-lg border-gray-200"
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          />
        </div>

        {/* Reference Images Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-900">
              Reference images
            </label>
            <span className="text-xs text-gray-500">
              Optional · max 5 · 10MB each
            </span>
          </div>

          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            maxCount={5}
            multiple
            accept="image/*"
            className={styles.uploadListInline}
          >
            {fileList.length >= 5 ? null : (
              <div className="flex flex-col items-center justify-center py-4">
                <PlusOutlined className="text-2xl text-gray-400 mb-2" />
                <p className="text-xs text-gray-600">Upload</p>
              </div>
            )}
          </Upload>
        </div>

        {/* Model Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-900">Model</label>
            <a href="#" className="text-sm text-gray-600 hover:underline">
              Choose model
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Basic Model */}
            <button
              onClick={() => setSelectedModel("basic")}
              className={classNames(
                "p-4 rounded-lg border-2 text-left transition-all",
                selectedModel === "basic"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              <div className="font-semibold text-base mb-1 text-gray-900">
                Banana Prompt
              </div>
              <div className="text-xs text-gray-600">
                1 credit · Fast generation
              </div>
            </button>

            {/* Pro Model */}
            <button
              onClick={() => setSelectedModel("pro")}
              className={classNames(
                "p-4 rounded-lg border-2 text-left transition-all",
                selectedModel === "pro"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              <div className="font-semibold text-base mb-1">
                Banana Prompt Pro
              </div>
              <div
                className={classNames(
                  "text-xs",
                  selectedModel === "pro" ? "text-gray-300" : "text-gray-600"
                )}
              >
                2 credits · High quality · Text rendering
              </div>
            </button>
          </div>
        </div>

        {/* Aspect Ratio Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-900">
              Aspect ratio
            </label>
            <span className="text-sm text-gray-500">Optional</span>
          </div>

          <div className="flex gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setSelectedRatio(ratio.value)}
                className={classNames(
                  "flex-1 py-3 px-2 rounded-lg border-2 text-center transition-all",
                  selectedRatio === ratio.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                )}
              >
                <div className="text-2xl mb-1">{ratio.icon}</div>
                <div className="text-xs font-medium">{ratio.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          size="large"
          icon={<ArrowUpOutlined />}
          disabled
          className="w-full h-12 text-base font-medium bg-gray-400 text-white border-0 cursor-not-allowed"
        >
          No credits available
        </Button>

        {/* Warning Message */}
        <Alert
          title="No images available"
          description={
            <div>
              Purchase a subscription to start generating images.
              <br />
              <a
                href="#"
                className="text-orange-600 hover:underline font-medium"
              >
                View pricing →
              </a>
            </div>
          }
          type="warning"
          showIcon={false}
          className="border-orange-200 bg-orange-50 text-orange-900"
        />
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 min-h-[600px]">
        <div className="text-center">
          <PlusOutlined className="text-6xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-base">
            Drop in a prompt to see your next result.
          </p>
          <p className="text-gray-400 text-sm mt-1">Ready when you are.</p>
        </div>
      </div>
    </div>
  );
}
