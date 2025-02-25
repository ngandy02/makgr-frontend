import React from 'react';
import useMasthead from '../../Hooks/useMasthead';

function Masterhead() {
  const {editors, consultingEditors, managingEditors, loading} = useMasthead();
    const loadingSkeleton = Array.from([1,2]).map(i => <div key={i} className='animate-pulse rounded-lg h-2 w-full bg-[var(--background-color)]'></div>);

    return (
      <div className='flex flex-col gap-3'>
        <section className='space-y-2'>
          <h2 className='text-lg font-bold'>Editors</h2>
          <ul className={`${loading && 'space-y-6'}`}>
            {loading ? loadingSkeleton : editors.map((editor, i) => <li key={editor.name + i}>{editor.name}</li>)}
          </ul>
        </section>
        <section className='space-y-2'>
          <h2 className='text-lg font-bold'>Manging Editors</h2>
          <ul className={`${loading && 'space-y-6'}`}>
          {loading ? loadingSkeleton : managingEditors.map((editor, i) => <li key={editor.name + i}>{editor.name}</li>)}
          </ul>
        </section>
        <section className='space-y-2'>
          <h2 className='text-lg font-bold'>Consulting Editors</h2>
          <ul className={`${loading  && 'space-y-6'}`}>
          {loading ? loadingSkeleton : consultingEditors.map((editor, i) => <li key={editor.name + i}>{editor.name}</li>)}
          </ul>
        </section>
      </div>
    );
  }
  
  export default Masterhead;