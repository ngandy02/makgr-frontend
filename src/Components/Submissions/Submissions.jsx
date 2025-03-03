import React from "react";
function Submissions() {
  return (
    <div className="space-y-3">
      <SubmissionGuidelines />
      <div>submission form placeholder</div>
    </div>
  );
}

export default Submissions;

const guidelines = [
  "Papers should be double-spaced, in 12 point Times New Roman font and not double justified.",
  "Accepted papers are usually about 6,000-8,000 words long.",
  "In addition to the article itself, an abstract and keywords should be submitted. Submissions should be made in Word doc format.",
  "Submissions should be in English: American, UK and Canadian spellings are acceptable as long as they adhere consistently to one pattern.",
  "Citations should be made in author-date format (Author 1974, p. 69). A reference list of all works cited should be placed at the end of the article.",
];

function SubmissionGuidelines() {
  return (
    <div className="space-y-2">
      <h1 className="text-lg font-bold">Submission Guidelines</h1>
      <ol className="tracking-tight text-sm list-decimal">
        {guidelines.map((guideline) => (
          <li key={guideline}>{guideline}</li>
        ))}
      </ol>
    </div>
  );
}
