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
            setError("Submission page content not found.");
          }
        })
        .catch((err) => setError(`Error fetching submission page: ${err.message}`));
    };

    fetchSubText();
  }, []);

  const handleEditClick = () => {
    setEditClicked(!editClicked);
    setTextAreaValue(subText);
  };

  const updateSubText = () => {
    axios
      .put(`${TEXT_ENDPOINT}/${SUB_KEY}`, { title: SUB_TITLE, text: textAreaValue })
      .then((response) => {
        const updatedObject = response.data[UPDATED_KEY];
        if (updatedObject.key === SUB_KEY) {
          setSubText(updatedObject.text);
          setError("");
          setEditClicked(false);
        } else {
          setError("Submission page content not found.");
        }
      })
      .catch((err) => setError(`Error updating submission page: ${err.message}`));
  };

  useEffect(() => {
    const textarea = document.getElementById("subText");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textAreaValue, editClicked]); // Resize textarea to match height of content

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
      </div>
    );
  } else {
    return (
      <div>
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
        <div>submission form placeholder</div>
      </div>
    );
  }
}

export default Submissions;
