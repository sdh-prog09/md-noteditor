import React from "react"
import Sidebar from "./component/Sidebar"
import Editor from "./component/Editor"

import Split from "react-split"
import { nanoid } from "nanoid"

/**
     * Challenge:
     * 1. Every time the `notes` array changes, save it 
     *    in localStorage. You'll need to use JSON.stringify()
     *    to turn the array into a string to save in localStorage.
     * 2. When the app first loads, initialize the notes state
     *    with the notes saved in localStorage. You'll need to
     *    use JSON.parse() to turn the stringified array back
     *    into a real JS array.
     */


export default function App() {
  const [notes, setNotes] = React.useState(
    // this is call lazzy initliztion mean while first time page render only that time local storage call
     JSON.parse(localStorage.getItem('notes')) || []
  )
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  )



// side effect process handle by use effect
React.useEffect(function() {
  localStorage.setItem("notes" , JSON.stringify(notes))
}, [notes])




  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }

    setNotes(prevNotes => [newNote, ...prevNotes])
      setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    let newArr =[];
    setNotes(oldNotes => {
      for(let i=0; i<oldNotes.length; i++){
        let noteObj = oldNotes[i];
        if(noteObj.id === currentNoteId){
               newArr.unshift({...noteObj , body : text})
        }else{
         newArr.push(noteObj);
        }
      }
      return newArr;
    })
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  function deleteNote(e , noteId){
    e.stopPropagation();
    setNotes(prevNotes  => prevNotes.filter(note => note.id !== noteId))

  }

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNoteFn={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={findCurrentNote()}
                updateNote={updateNote}
              
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}


