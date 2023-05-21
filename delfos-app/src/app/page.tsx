"use client";

import { FormEvent, useRef, useState } from "react";

function UploadFile() {
  const [status, setStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [queryStatus, setQueryStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });
  const fileInput = useRef<HTMLInputElement | null>(null);

  async function handleFileUpload(e: FormEvent) {
    if (!fileInput.current || !fileInput.current.files) {
      return;
    }
    setStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
    });
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", fileInput.current.files[0]);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });
    setStatus({
      isLoading: false,
      isSuccess: response.ok,
      isError: !response.ok,
    });
  }

  async function handleQuery(e: FormEvent) {
    if (!query) {
      return;
    }
    setQueryStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
    });
    e.preventDefault();
    const response = await fetch("http://localhost:3001/execute", {
      method: "POST",
      body: JSON.stringify({ query: query }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      setQueryStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      return;
    }
    const json = await response.json();
    setAnswer(json.answer);
    setQueryStatus({
      isLoading: false,
      isSuccess: true,
      isError: false,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleFileUpload}
        className="flex flex-col space-y-4 mb-4"
      >
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          ref={fileInput}
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded"
          disabled={status.isLoading}
        >
          {status.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      {status.isSuccess && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> File uploaded
          successfullyagain.
        </div>
      )}
      {status.isError && (
        <div
          className=" p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Error</span> Error while uploading
          fileagain.
        </div>
      )}
      <form className="flex flex-col space-y-4 mb-4" onSubmit={handleQuery}>
        <div className="w-full">
          <label
            htmlFor="query"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Query
          </label>
          <input
            type="text"
            id="query"
            onChange={(ev) => setQuery(ev.target.value)}
            value={query}
            className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="your query"
            required
          />
        </div>
        <button
          disabled={queryStatus.isLoading}
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded"
        >
          {queryStatus.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>

      {answer && (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Answer
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadFile;
