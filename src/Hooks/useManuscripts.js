import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";

const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/query`;

export default function useManuscripts() {
  const [manuscripts, setManuscripts] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getManuscripts = async () => {
      const res = await axios.get(MANUSCRIPTS_ENDPOINT);
      console.log(res);
      const manuscriptsArray = [];
      for (let manuscriptKey in res.data) {
        const manuscript = res.data[manuscriptKey];
        manuscriptsArray.push(manuscript);
      }
      setManuscripts(manuscriptsArray);
    };
    getManuscripts();
  }, []);

  useEffect(() => {
    if (typeof manuscripts === "object") setLoading(false);
  }, [manuscripts]);

  return { manuscripts, loading };
}
