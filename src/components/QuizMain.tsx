import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import allVerbs from "../data/uregelmassige_verben.yml"
import "../styles/index.scss"
import VerbRow from "./VerbRow"

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const useKeyPress = function(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
  
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

enum QuizState {
  ask = "ask",
  confirm = "confirm",
}

const QuizMain = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<{[Key: string]: boolean | null}>(
    allVerbs.reduce(
      (accumulated, current) => ({ ...accumulated, [current.id]: current.name }),
      {}
    )
  )
  const [allEntries, setAllEntries] = useState([])
  const [quizStep, setQuizStep] = useState(QuizState.ask)
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const pageEndRef = useRef(null)
  const [toggledExplanationVerbs, setToggledExplanationVerbs] = useState([])


  useEffect(() => {
    setAllEntries(
      shuffle(allVerbs.filter(_ => !_.is_burried))
    )
  }, [])

  useEffect(() => {
    if (leftPress) {
      if(quizStep === QuizState.ask){
        iDontKnow()
      }
      if(quizStep === QuizState.confirm){
        iWasWrong()
      }
    }
  }, [leftPress]);
  useEffect(() => {
    if (rightPress) {
      if(quizStep === QuizState.ask){
        iKnow()
      }
      if(quizStep === QuizState.confirm){
        iWasRight()
      }
    }
  }, [rightPress]);

  const scrollToBottom = useCallback(
    () => {
      pageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    },
    [pageEndRef]
  )

  const toggleRowFn = useCallback(
    (verb) => {
      if(toggledExplanationVerbs.includes(verb)){
        setToggledExplanationVerbs(toggledExplanationVerbs.filter(_ => _ != verb))
      } else {
        setToggledExplanationVerbs([...toggledExplanationVerbs, verb])
      }
    },
    [toggledExplanationVerbs]
  )
  
  const iDontKnow = useCallback(
    () => {
      setAnswers(
        {
          ...answers,
          [allEntries[currentIndex].verb]: false
        }
      )
      setQuizStep(QuizState.ask)
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    }, 
    [allEntries, answers, currentIndex]
  )
  const iKnow = useCallback(
    () => {
      setQuizStep(QuizState.confirm)
      scrollToBottom()
    }, 
    []
  )
  const iWasWrong = useCallback(
    () => {
      setAnswers(
        {
          ...answers,
          [allEntries[currentIndex].verb]: false
        }
      )
      setQuizStep(QuizState.ask)
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    }, 
    [allEntries, answers, currentIndex]
  )
  const iWasRight = useCallback(
    () => {
      setAnswers(
        {
          ...answers,
          [allEntries[currentIndex].verb]: true
        }
      )
      setQuizStep(QuizState.ask)
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    },
    [allEntries, answers, currentIndex]
  )
  useEffect(() => {
    window.addEventListener("keydown", scrollToBottom);

    return () => {
        window.removeEventListener("keydown", scrollToBottom);
    };
  });

  return (
    <main>
        <div className='table-wrapper'>
          <div className="table">
            <div className="table-head">
              <div className="cell cell__validity"></div>
              <div className="cell cell__freq">
                Freq.
              </div>
              <div className="cell is-clickable">
                Verb
              </div>
              <div className="cell is-table-cell-hidden-on-mobile">Präsens</div>
              <div className="cell is-table-cell-hidden-on-mobile">Präteritum</div>
              <div className="cell is-table-cell-hidden-on-mobile">Perfekt</div>
              <div className="cell cell__vowel is-table-cell-hidden-on-mobile"></div>
              <div className="cell cell__external">
                <div style={{padding: 0}}>
                </div>
              </div>
            </div>
            <div className="table-body">
              {
                 allEntries.slice(0, currentIndex + 1)
                  .map((definition, index) => {
                    const areQuizSectionVisible = index !== currentIndex || quizStep === "confirm";
                    return(
                      <VerbRow 
                        key={`${definition.verb} ${definition.hilfsverb}`}
                        definition={definition} 
                        onToggle={toggleRowFn} 
                        isDescriptionExpanded={toggledExplanationVerbs.includes(definition.verb)}
                        areQuizSectionVisible={areQuizSectionVisible}
                        hasQuizAnswerCell={true}
                        isAnsweredCorrectly={answers[definition.verb]}
                      />
                    )
                  })
              }
            </div>
          </div>
        </div>
        <div className="container">
        {
          currentIndex < allEntries.length &&
          <div>
            <div className="my-5">
              {
                quizStep == "ask" &&
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                  <button type="button" className="btn btn-danger m-2" onClick={() => iDontKnow()}>Don&#39;t know</button>
                  <button type="button" className="btn btn-dark m-2" onClick={() => iKnow()}>I think I know</button>
                </div>
              }
              {
                quizStep == "confirm" &&
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                  <button type="button" className="btn btn-danger m-2" onClick={() => iWasWrong()}>I was wrong</button>
                  <button type="button" className="btn btn-success m-2" onClick={() => iWasRight()}>I was right</button>
                </div>
              }
            </div>
            <div>
              <div className="progress-wrapper">
                <div className="progress my-2 " role="progressbar">
                  <div className="progress-bar" style={{width: `${currentIndex / allEntries.length * 100}%`}}>
                    {(currentIndex / allEntries.length * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          currentIndex >= allEntries.length &&
          <div className="my-5 text-center">Done!</div>
        }
        </div>
        <div ref={pageEndRef} />
    </main>
  )
}
export default QuizMain