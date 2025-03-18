import React from "react";
import useMasthead from "../../Hooks/useMasthead";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

function Masthead() {
  const { editors, consultingEditors, managingEditors, loading } =
    useMasthead();
  const loadingSkeleton = Array.from([1, 2]).map((i) => (
    <div
      key={i}
      className="animate-pulse rounded-lg h-2 w-full bg-[var(--background-color)]"
    ></div>
  ));

  return (
    <div className="flex flex-col gap-3">
      <section className="space-y-2">
        <h2 className="text-lg font-bold">Editors</h2>
        <ul className={`${loading && "space-y-6"}`}>
          {loading
            ? loadingSkeleton
            : editors.map((editor, i) => (
                <NameLink key={editor.name + i} name={editor.name} />
              ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">Managing Editors</h2>
        <ul className={`${loading && "space-y-6"}`}>
          {loading
            ? loadingSkeleton
            : managingEditors.map((editor, i) => (
                <NameLink key={editor.name + i} name={editor.name} />
              ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">Consulting Editors</h2>
        <ul className={`${loading && "space-y-6"}`}>
          {loading
            ? loadingSkeleton
            : consultingEditors.map((editor, i) => (
                <NameLink key={editor.name + i} name={editor.name} />
              ))}
        </ul>
      </section>
    </div>
  );
}

NameLink.propTypes = {
  name: propTypes.string.isRequired,
};

function NameLink({ name }) {
  return (
    <Link
      to={`/people/${name}`}
      className="hover:text-orange-500 transition duration-200"
    >
      <li>{name}</li>
    </Link>
  );
}

export default Masthead;
