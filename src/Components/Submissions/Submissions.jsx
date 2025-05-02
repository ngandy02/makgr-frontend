import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TEXT_ENDPOINT = `${BACKEND_URL}/text`;
const MANU_CREATE_ENDPOINT = `${BACKEND_URL}/query/create`;
const SUB_KEY = "SubKey";
const SUB_TITLE = "Submission Page";
const UPDATED_KEY = "Updated Entry";
const SUBMITTED = "SUB";

function Submissions() {
  const [subText, setSubText] = useState("");
  const [error, setError] = useState("");
  const [editClicked, setEditClicked] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [referees, setReferees] = useState([]);
  const [titleAreaValue, setTitleAreaValue] = useState("");
  const [manuAreaValue, setManuAreaValue] = useState("");
  const [abstractAreaValue, setAbstractAreaValue] = useState("");
  const { userEmail } = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(TEXT_ENDPOINT)
      .then((response) => {
        if (response.data[SUB_KEY]) {
          setSubText(response.data[SUB_KEY].text);
          setTextAreaValue(response.data[SUB_KEY].text);
        } else {
          setError("No submission page content to load.");
        }
      })
      .catch((err) =>
        setError(`Error fetching submission page: ${err.message}`)
      );
  }, []);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${BACKEND_URL}/permissions`, {
          params: {
            feature: "text",
            action: "update",
            user_email: userEmail,
          },
        })
        .then((res) => {
          setHasPermission(res.data.permitted === true);
        })
        .catch(() => {
          setHasPermission(false);
        });

      axios
        .get(`${BACKEND_URL}/people/${encodeURIComponent(userEmail)}`)
        .then((res) => {
          setAuthorName(res.data.name);
        })
        .catch((err) => {
          console.error("Failed to fetch author name:", err);
        });
    }
  }, [userEmail]);

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
          setEditClicked(false);
        } else {
          setError("Failed to update submission page.");
        }
      })
      .catch((err) =>
        setError(`Error updating submission page: ${err.message}`)
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail) {
      navigate("/login");
      return;
    }

    const newManu = {
      title: titleAreaValue,
      author: authorName,
      author_email: userEmail,
      referees,
      state: SUBMITTED,
      text: manuAreaValue,
    };

    axios
      .put(MANU_CREATE_ENDPOINT, newManu)
      .then(() => {
        setReferees([]);
        setManuAreaValue("");
        setTitleAreaValue("");
        navigate("/dashboard");
      })
      .catch((error) => {
        setError(
          `There was a problem adding the manuscript. ${
            error.response?.data?.message || ""
          }`
        );
      });
  };

  useEffect(() => {
    const textarea = document.getElementById("subText");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textAreaValue, editClicked]); // Resize textarea to match height of content

  useEffect(() => {
    const textArea = document.getElementById("manuText");
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [manuAreaValue]); // Resize textarea to match height of content

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

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
            >
              Cancel
            </button>
            <button onClick={updateSubText} className="px-5 py-1 text-md">
              Update
            </button>
          </div>
        </div>
      ) : (
        subText
          .split("\n")
          .map((paragraph, index) =>
            paragraph === "" ? (
              <br key={index} />
            ) : (
              <p key={index}>{paragraph}</p>
            )
          )
      )}

      {!editClicked && hasPermission && (
        <button onClick={handleEditClick} className="my-3 px-5 py-1 text-md">
          Edit
        </button>
      )}

      <h2 className="text-lg font-bold mt-5">Submission Form</h2>
      {userEmail && (
        <p className="mb-2 text-gray-600">
          Submitting as <strong>{authorName}</strong> ({userEmail})
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-3">
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={titleAreaValue}
          onChange={(e) => setTitleAreaValue(e.target.value)}
        />

        <div className="mt-4">
          <label htmlFor="manuText" className="block font-medium">
            Manuscript Text
          </label>
          <textarea
            id="manuText"
            name="manuText"
            value={manuAreaValue}
            onChange={(e) => setManuAreaValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="abstract" className="block font-medium">
            Abstract 
          </label>
          <textarea
            id="abstract"
            name="abstract"
            value={abstractAreaValue}
            onChange={(e) => setAbstractAreaValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          className="px-5 py-2 rounded-lg font-semibold mt-5"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Submissions;
