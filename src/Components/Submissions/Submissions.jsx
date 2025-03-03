import React from 'react';
import useManuscripts from '../../Hooks/useManuscripts';

function Submissions() {
  const {loading, manuscripts} = useManuscripts();
  console.log(loading, manuscripts)
  return <h1>Submissions</h1>;
}

export default Submissions;
