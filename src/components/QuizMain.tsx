import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import allVerbs from "../data/uregelmassige_verben.yml"
import "../styles/index.scss"
import VerbRow from "./VerbRow"
import VerbCard from "./VerbCard";
import { useKeyPress, useSpacebarKeyPress } from "../utils";

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



enum QuizState {
  ask = "ask",
  confirm = "confirm",
}

const QuizMain = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentView, setCurrentView] = useState("quiz")
  const [answers, setAnswers] = useState<{[Key: string]: boolean | null}>(
    allVerbs.reduce(
      (accumulated, current) => ({ ...accumulated, [current.id]: current.name }),
      {}
    )
  )
  const [allEntries, setAllEntries] = useState([])
  const [quizStep, setQuizStep] = useState(QuizState.ask)
  const leftPress = useKeyPress("ArrowLeft");
  const onePress = useKeyPress("1");
  const twoPress = useKeyPress("2");
  const rightPress = useKeyPress("ArrowRight");
  const threePress = useKeyPress("3");
  const pageEndRef = useRef(null)
  const [toggledExplanationVerbs, setToggledExplanationVerbs] = useState([])
  const [markedVerbs, setMarkedVerbs] = useState([])
  const spacebarPress = useSpacebarKeyPress();

  useEffect(() => {
    if (spacebarPress) {
      if(currentView === 'quiz'){
        setCurrentView("bookmark")
      }
      else {
        setCurrentView("quiz")
      }
    }
  }, [spacebarPress]);

  useEffect(() => {
    setAllEntries(
      shuffle(allVerbs.filter(_ => !_.is_burried))
    )
  }, [])

  useEffect(() => {
    if (leftPress || twoPress) {
      setCurrentIndex(
        Math.max(0, Math.min(currentIndex - 1, allVerbs.length - 1))
      )
    }
  }, [leftPress, twoPress]);
  useEffect(() => {
    if (rightPress || threePress) {
      setCurrentIndex(
        Math.max(0, Math.min(currentIndex + 1, allVerbs.length - 1))
      )
    }
  }, [rightPress, threePress]);
  useEffect(() => {
    if (onePress) {
      toggleMark(allEntries[currentIndex].verb)
    }
  }, [onePress]);


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

  const toggleMark = useCallback(
    (verb) => {
      if(markedVerbs.includes(verb)){
        setMarkedVerbs(markedVerbs.filter(_ => _ != verb))
      } else {
        setMarkedVerbs([...markedVerbs, verb])
      }
    },
    [markedVerbs, setMarkedVerbs]
  )
  

  const iThinkIKnow = useCallback(
    () => {
      setQuizStep(QuizState.confirm)
      scrollToBottom()
      setToggledExplanationVerbs([...toggledExplanationVerbs, allEntries[currentIndex].verb])
    }, 
    [allEntries, toggledExplanationVerbs, currentIndex]
  )
  const showNextQuestion = useCallback(
    () => {
      setAnswers(
        {
          ...answers,
          [allEntries[currentIndex].verb]: false
        }
      )
      setQuizStep(QuizState.ask)
      setToggledExplanationVerbs([allEntries[currentIndex].verb])
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    }, 
    [allEntries, answers, currentIndex]
  )
  const markVerb = useCallback(
    () => {
      setAnswers(
        {
          ...answers,
          [allEntries[currentIndex].verb]: true
        }
      )
      setQuizStep(QuizState.ask)
      setToggledExplanationVerbs([])
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
    <main id="page--quiz-main">
        {
          currentView === 'quiz' &&
          <div class="quiz-card-container">
            <div style={{margin: '2rem'}}>
              <div >
                <div className="progress-wrapper">
                  <div className="progress-count my-2">
                    {currentIndex} / {allEntries.length}
                  </div>
                </div>
              </div>

              {
                allEntries.slice(currentIndex, currentIndex + 1)
                .map((definition, index) => {
                    return(
                      <VerbCard 
                        key={`${definition.verb} ${definition.hilfsverb}`}
                        definition={definition} 
                        onToggle={toggleRowFn} 
                        isDescriptionExpanded={toggledExplanationVerbs.includes(definition.verb)}
                        isMarked={markedVerbs.includes(definition.verb)}
                        onMarkClick={toggleMark}
                        showBookmarked={() => setCurrentView('bookmark')}
                        goToPreviousCard={() => setCurrentIndex(Math.max(0, Math.min(currentIndex - 1, allEntries.length - 1)))}
                        goToNextCard={() => setCurrentIndex(Math.max(0, Math.min(currentIndex + 1, allEntries.length - 1)))}
                      />
                    )
                  })
              }
              <div>
              </div>
            </div>
          </div>
        }
        {
          currentView === 'bookmark' &&
          <div class="quiz-bookmark-container">
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
                    allVerbs
                      .filter(x => markedVerbs.includes(x.verb))
                      .map((definition, index) => {
                        return(
                          <VerbRow 
                            key={`${definition.verb} ${definition.hilfsverb}`}
                            definition={definition} 
                            onToggle={toggleRowFn} 
                            isDescriptionExpanded={toggledExplanationVerbs.includes(definition.verb)}
                            areQuizSectionVisible={true}
                            hasQuizAnswerCell={false}
                            isAnsweredCorrectly={true}
                          />
                        )
                      })
                  }
                </div>
              </div>
            </div>
          </div>
        }
        <div className="container quiz-controls-container">
          {
            currentView === 'bookmark' && 
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: "2rem"}}> 
              <button class="btn btn-primary" onClick={() => setCurrentView('quiz')}>
                Continue Quiz
              </button>
            </div>
          }
        </div>
        <div ref={pageEndRef} />
    </main>
  )
}
export default QuizMain