import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

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
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [referees, setReferees] = useState([]);
  const [titleAreaValue, setTitleAreaValue] = useState("");
  const [authorAreaValue, setAuthorAreaValue] = useState("");
  const [emailAreaValue, setEmailAreaValue] = useState("");
  const [manuAreaValue, setManuAreaValue] = useState("");
  const [manuClicked, setManuClicked] = useState(false);
  const [manuText, setManuText] = useState("");
<<<<<<< Updated upstream
  const [referee, setReferee] = useState([]);

  // const []
=======
  
  
    // const []
>>>>>>> Stashed changes

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
    console.log(title);
    setState(SUBMITTED);
<<<<<<< Updated upstream
    uploadManu;
=======
    setTitle(titleAreaValue);
    setAuthor(authorAreaValue);
    setEmail(emailAreaValue);
    uploadManu(e);

>>>>>>> Stashed changes
  };

  useEffect(() => {
    const textarea = document.getElementById("subText");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textAreaValue, editClicked]); // Resize textarea to match height of content

  // This effect is for the manuscript textarea
  // It will resize the textarea to match the height of the content
  useEffect(() => {
    const textArea = document.getElementById("manuText");
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [manuAreaValue, editClicked]);

  const uploadManu = (event) => {
    event.preventDefault();
    setState(SUBMITTED);
    const newManu = {
      title: title,
<<<<<<< Updated upstream
      author: author,
      email: email,
      referee: referee,
=======
      author: author, 
      author_email: email,
      referees: referees,
>>>>>>> Stashed changes
      state: state,
      text: manuText,
      // need to add referee input
    };
<<<<<<< Updated upstream
    axios
      .put(MANU_CREATE_ENDPOINT, newManu)
      .then(() => {
        setTitle("");
        setAuthor("");
        setEmail("");
        setState("");
        setReferee([]);
        setManuText("");
        // setSuccess("Manuscript addded successfully!");
      })
      .catch((error) => {
        setError(
          `There was a problem adding the person. ${error.response.data.message}`,
        );
      });
  };
=======
    axios 
    .put(MANU_CREATE_ENDPOINT, newManu)
    .then(() => {
      setTitle("");
      setAuthor("");
      setEmail("");
      setState("");
      setReferees([]);
      setManuText("");
      
      // setSuccess("Manuscript addded successfully!");
    })
    .catch((error) => {
      setError(`There was a problem adding the person. ${error.response.data.message}`);
    })
    };
>>>>>>> Stashed changes

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
          // split creates an array of paragraphs
          // paragraph is the current paragraph being processed (text between \n's)
          // index is the index of the current par in the array
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
          value={titleAreaValue}
          onChange={(e) => setTitleAreaValue(e.target.value)}
          
        />
        <label htmlFor="author" className="block font-medium">
          Author
        </label>
        <input
          type="text"
          id="author"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={authorAreaValue}
          onChange={(e) => setAuthorAreaValue(e.target.value)}
        />
        <label htmlFor="email" className="block font-medium">
          Author Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
<<<<<<< Updated upstream
          onChange={(e) => setEmail(e.target.value)}
=======
          value={emailAreaValue}
          onChange={(e) => setEmailAreaValue(e.target.value)}

          
>>>>>>> Stashed changes
        />

        {manuClicked ? (
          <div>
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
            <button
              className="px-5 py-2 rounded-lg font-semibold"
              style={{
                transition: "0.3s ease",
              }}
              onClick={() => {
                setManuClicked(!manuClicked);
              }}
            >
              Cancel
            </button>

            <button
              className="ml-5 px-5 py-2 rounded-lg font-semibold"
              style={{
                transition: "0.3s ease",
              }}
              onClick={() => setManuText(manuAreaValue)}
            >
              Finish
            </button>
          </div>
        ) : null}

        {!manuClicked ? (
          <div>
            <button
              className="px-5 py-2 rounded-lg font-semibold"
              style={{
                transition: "0.3s ease",
              }}
              onClick={() => setManuClicked(!manuClicked)}
            >
              Add Manuscript Text
            </button>
          </div>
        ) : null}
        <div className="flex flex-col items-center justify-center border-[1.5px] border-gray-300 rounded-md p-3 my-3">
          <span className="font-medium">Upload PDF</span>
          <input type="file" className="mt-2" />
        </div>
        <button
          className="px-5 py-2 rounded-lg font-semibold"
          style={{
            transition: "0.3s ease",
          }}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Submissions;
