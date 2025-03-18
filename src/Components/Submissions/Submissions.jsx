import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

const TEXT_ENDPOINT = `${BACKEND_URL}/text`;
const SUB_KEY = "SubKey";
const SUB_TITLE = "Submission Page";
const UPDATED_KEY = "Updated Entry";

function Submissions() {
  const [subText, setSubText] = useState("");
  const [error, setError] = useState("");
  const [editClicked, setEditClicked] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  useEffect(() => {
    const fetchSubText = () => {
      axios
        .get(TEXT_ENDPOINT)
        .then((response) => {
          if (response.data[SUB_KEY]) {
            setSubText(response.data[SUB_KEY].text);
            setTextAreaValue(response.data[SUB_KEY].text);
            setError("");
          } else {
            setError("No submission page content to load.");
          }
        })
        .catch((err) =>
          setError(`Error fetching submission page: ${err.message}`),
        );
    };

    fetchSubText();
  }, []);

  const handleEditClick = () => {
    setEditClicked(!editClicked);
    setTextAreaValue(subText);
  };

  const updateSubText = () => {
    axios
      .put(`${TEXT_ENDPOINT}/${SUB_KEY}`, {
        title: SUB_TITLE,
        text: textAreaValue,
      })
      .then((response) => {
        const updatedObject = response.data[UPDATED_KEY];
        if (updatedObject.key === SUB_KEY) {
          setSubText(updatedObject.text);
          setError("");
          setEditClicked(false);
        } else {
          setError("No submission page content to load.");
        }
      })
      .catch((err) =>
        setError(`Error updating submission page: ${err.message}`),
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  useEffect(() => {
    const textarea = document.getElementById("subText");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textAreaValue, editClicked]); // Resize textarea to match height of content

  return (
    <div>
      {error && (
        <div>
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <h2 className="text-lg font-bold">Submission Guidelines</h2>

      {editClicked ? (
        <div>
          <textarea
            name="subText"
            id="subText"
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="my-3">
            <button
              onClick={handleEditClick}
              className="px-5 py-1 text-md mr-3"
              style={{
                transition: "0.3s ease",
              }}
            >
              Cancel
            </button>
            <button
              onClick={updateSubText}
              className="px-5 py-1 text-md"
              style={{
                transition: "0.3s ease",
              }}
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        subText.split("\n").map((paragraph, index) => {
          // If there is an \n, use <br>
          if (paragraph === "") {
            return <br key={index} />;
          }
          return <p key={index}>{paragraph}</p>;
        })
      )}
      {!editClicked && (
        <button
          onClick={handleEditClick}
          className="my-3 px-5 py-1 text-md"
          style={{
            transition: "0.3s ease",
          }}
        >
          Edit
        </button>
      )}
      <h2 className="text-lg font-bold mt-5">Submission Form</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="author" className="block font-medium">
          Author
        </label>
        <input
          type="text"
          id="author"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="email" className="block font-medium">
          Author Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-3 my-3">
          <span className="font-medium">Upload PDF</span>
          <input type="file" className="mt-2" />
        </div>
        <button
          className="px-5 py-2 rounded-lg font-semibold"
          style={{
            transition: "0.3s ease",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Submissions;
