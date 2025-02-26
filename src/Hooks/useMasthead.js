import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";

const MASTHEAD_ENDPOINT = `${BACKEND_URL}/people/masthead`;

export default function useMasthead() {
  const [editors, setEditors] = useState();
  const [managingEditors, setManagingEditors] = useState();
  const [consultingEditors, setConsultingEditors] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMasthead = async () => {
      const res = await axios.get(MASTHEAD_ENDPOINT);
      const data = res.data.Masthead;
      setEditors(data["Editor"]);
      setConsultingEditors(data["Consulting Editor"]);
      setManagingEditors(data["Managing Editor"]);
    };
    getMasthead();
  }, []);

  useEffect(() => {
    if (
      typeof editors === "object" &&
      typeof managingEditors === "object" &&
      typeof consultingEditors === "object"
    )
      setLoading(false);
  }, [editors, managingEditors, consultingEditors]);

  return { editors, managingEditors, consultingEditors, loading };
}
