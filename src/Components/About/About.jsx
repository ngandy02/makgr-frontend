import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useAuth } from "../../Contexts/AuthContext";

const TEXT_ENDPOINT = `${BACKEND_URL}/text`;
const ABOUT_KEY = "AboutKey";
const ABOUT_TITLE = "About Page";
const UPDATED_KEY = "Updated Entry";

function About() {
  const [aboutText, setAboutText] = useState("");
  const [error, setError] = useState("");
  const [editClicked, setEditClicked] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  const { userEmail } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const fetchAboutText = () => {
      axios
        .get(TEXT_ENDPOINT)
        .then((response) => {
          if (response.data[ABOUT_KEY]) {
            setAboutText(response.data[ABOUT_KEY].text);
            setTextAreaValue(response.data[ABOUT_KEY].text);
            setError("");
          } else {
            setError("No about page content to load.");
          }
        })
        .catch((err) => setError(`Error fetching about page: ${err.message}`));
    };

    fetchAboutText();
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
          setHasPermission(res.data.permitted);
        })
        .catch((err) => {
          console.error("Permission check failed:", err);
          setHasPermission(false);
        });
    }
  }, [userEmail]);

  const handleEditClick = () => {
    setEditClicked(!editClicked);
    setTextAreaValue(aboutText);
  };

  const updateAboutText = () => {
    axios
      .put(`${TEXT_ENDPOINT}/${ABOUT_KEY}`, {
        title: ABOUT_TITLE,
        text: textAreaValue,
      })
      .then((response) => {
        const updatedObject = response.data[UPDATED_KEY];
        if (updatedObject.key === ABOUT_KEY) {
          setAboutText(updatedObject.text);
          setError("");
          setEditClicked(false);
        } else {
          setError("No about page content to load.");
        }
      })
      .catch((err) => setError(`Error updating about page: ${err.message}`));
  };

  useEffect(() => {
    const textarea = document.getElementById("aboutText");
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
              name="aboutText"
              id="aboutText"
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-3">
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
                onClick={updateAboutText}
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
          aboutText.split("\n").map((paragraph, index) => {
            // If there is an \n, use <br>
            if (paragraph === "") {
              return <br key={index} />;
            }
            return <p key={index}>{paragraph}</p>;
          })
        )}
        {!editClicked && hasPermission && (
          <button
            onClick={handleEditClick}
            className="mt-3 px-5 py-1 text-md"
            style={{
              transition: "0.3s ease",
            }}
          >
            Edit
          </button>
        )}
      </div>
    );
  }
}

export default About;
