import React from "react";
import "./Joke.css";

/** Presentational joke component with voting buttons */

function Joke({ vote, votes, text, id }) {
  function upVote(evt) { vote(id, +1); }
  function downVote(evt) { vote(id, -1); }

  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={upVote}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={downVote}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}

export default Joke;
