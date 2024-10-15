import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle"
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt"
import { FaTimesCircle } from "@react-icons/all-files/fa/FaTimesCircle"
import classNames from "classnames"
import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import allVerbs from "../data/uregelmassige_verben.yaml"
import "../styles/index.scss"

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

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

const IndexPage: React.FC<PageProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [incorrectAnswers, setInorrectAnswers] = useState([])
  const [allEntries, setAllEntries] = useState([])
  const [quizStep, setQuizStep] = useState("ask")
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
      if(quizStep === "ask"){
        iDontKnow()
      }
      if(quizStep === "confirm"){
        iWasWrong()
      }
    }
  }, [leftPress]);
  useEffect(() => {
    if (rightPress) {
      if(quizStep === "ask"){
        iKnow()
      }
      if(quizStep === "confirm"){
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
      setInorrectAnswers([...incorrectAnswers, currentIndex])
      setQuizStep("ask")
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    }, 
    [incorrectAnswers, currentIndex]
  )
  const iKnow = useCallback(
    () => {
      setQuizStep("confirm")
      scrollToBottom()
    }, 
    []
  )
  const iWasWrong = useCallback(
    () => {
      setInorrectAnswers([...incorrectAnswers, currentIndex])
      setQuizStep("ask")
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    }, 
    [incorrectAnswers, currentIndex]
  )
  const iWasRight = useCallback(
    () => {
      setCorrectAnswers([...correctAnswers, currentIndex])
      setQuizStep("ask")
      setCurrentIndex(currentIndex + 1)
      scrollToBottom()
    },
    [correctAnswers, currentIndex]
  )
  useEffect(() => {
    window.addEventListener("keydown", scrollToBottom);

    return () => {
        window.removeEventListener("keydown", scrollToBottom);
    };
  });

  return (
    <main>
        <Navbar activeRoute="/quiz"/>
        <div className='table-wrapper'>
          <div className="table">
            <div className="table-head">
              <div className="cell cell__validity">

              </div>
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
                  .map((x, index) => {
                    const showEverything = index !== currentIndex || quizStep === "confirm";
                  return(
                  <div key={`${x.verb} ${x.hilfsverb}`}
                    className={classNames('row', {"is-active":toggledExplanationVerbs.includes(x.verb)})}
                  >
                    <div className="row-top" >
                      <div className={classNames("cell cell__validity", {
                        "is-correct": correctAnswers.includes(index), 
                        "is-incorrect": incorrectAnswers.includes(index)
                        })}>
                        {incorrectAnswers.includes(index) && <FaTimesCircle className="icon"/>}
                        {correctAnswers.includes(index) && <FaCheckCircle className="icon"/>}
                      </div>
                      <div className="cell cell__freq">
                        {x.duden_word_frequency === 1 &&
                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3z"></path></svg>}
                        {x.duden_word_frequency === 2 &&
                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7z"></path></svg>}
                        {x.duden_word_frequency === 3 &&
                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7zm4-3h2v11h-2z"></path></svg>}
                        {x.duden_word_frequency === 4 &&
                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7zm4-3h2v11h-2zm4-3h2v14h-2z"></path></svg>}
                        {x.duden_word_frequency === 5 &&
                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7zm4-3h2v11h-2zm4-3h2v14h-2zm4-3h2v17h-2z"></path></svg>}
                      </div>
                      <div className="cell"
                       onClick={_ => toggleRowFn(x.verb)}>
                        <span style={{fontWeight:600}}>
                          {x.verb}
                          {
                            x.is_reflexive &&
                            <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
                          }
                        </span>
                      </div>
                      <div className="cell is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
                        {showEverything && x.praesens}
                        {
                          showEverything && x.is_reflexive &&
                          <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
                        }
                      </div>
                      <div className="cell is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
                        {showEverything && x.praeteritum}
                        {
                          showEverything && x.is_reflexive &&
                          <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </>
                        }
                      </div>
                      <div className="cell is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
                        {
                          showEverything && x.hilfsverb === "haben" && <span className="badge rounded-pill is-haben">hat</span> 
                        }
                        {
                          showEverything && x.hilfsverb === "sein" &&<span className="badge rounded-pill is-sein">ist</span> 
                        }
                        {
                          showEverything && x.is_reflexive &&
                          <>&nbsp;<span className="badge rounded-pill is-sich">sich</span></>
                        }
                        &nbsp; {showEverything && x.perfekt}
                      </div>
                      <div className="cell cell__vowel is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
                        {
                          showEverything && x.vowel_change_from && `${x.vowel_change_from} → ${x.vowel_change_to}` 
                        }
                      </div>
                      <div className="cell cell__external">
                        <div>
                          <DropdownButton size="sm" variant="primary" id="dropdown-basic-button" title={<><FaExternalLinkAlt /> Links </>}>
                            <Dropdown.Item 
                              href={`https://www.linguee.com/german-english/translation/${x.verb}.html`}
                              target="_window">
                              <img height={25} width={25} src="/external/linguee_logo.png"/> Linguee
                            </Dropdown.Item>
                            <Dropdown.Item 
                              href={x.duden_url}
                              target="_window">
                              <img height={25} width={25} src="/external/duden_logo.jpg"/> Duden
                            </Dropdown.Item>
                            <Dropdown.Item 
                              href={`https://conjugator.reverso.net/conjugation-german-verb-${x.verb}.html`}
                              target="_window">
                              <img height={25} width={25} src="/external/reverso_logo.png"/> Reverso
                            </Dropdown.Item>
                            <Dropdown.Item 
                              href={`https://yourdailygerman.com/dictionary/?s=${x.verb}`}
                              target="_window">
                              <img height={25} width={25} src="/external/ydg_logo.png"/> Your Daily German
                            </Dropdown.Item>
                          </DropdownButton>
                          </div>
                      </div>
                    </div>
                    {
                      toggledExplanationVerbs.includes(x.verb) &&
                      <div className='row-bottom '>
                        <div className="row-bottom__explanation card is-table-cell-hidden-on-desktop">
                          <div className="cell is-table-cell-hidden-on-desktop">
                          {x.praesens}
                          {
                            x.is_reflexive &&
                            <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
                          }
                        </div>
                        <div className="cell is-table-cell-hidden-on-desktop">
                          {x.praeteritum}
                          {
                            x.is_reflexive &&
                            <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </>
                          }
                        </div>
                        <div className="cell is-table-cell-hidden-on-desktop">
                          {
                            x.hilfsverb === "haben" 
                            ? <span className="badge rounded-pill is-haben">hat</span> 
                            : <span className="badge rounded-pill is-sein">ist</span> 
                          }
                          {
                            x.is_reflexive &&
                            <>&nbsp;<span className="badge rounded-pill is-sich">sich</span></>
                          }
                          &nbsp; {x.perfekt}
                        </div>
                        <div className="cell cell__vowel is-table-cell-hidden-on-desktop">
                          {
                            x.vowel_change_from && `${x.vowel_change_from} → ${x.vowel_change_to}` 
                          }
                        </div>
                        </div>
                        <div className="row-bottom__inner card">
                          <div  className="card-body p-0">
                          {!x.examples && <p className="is-notice-text">Noch keine Beispiele. (<i>No examples yet.</i>)</p>}
                          {x.examples && x.examples.map(example => 
                              <ul key={example.de} className="example list-unstyled">
                                <li>{example.de}</li>
                                <li className="en">{example.en}</li>
                              </ul>
                          )} 
                          </div>
                        </div>
                      </div>
                    }
                    
                  </div>
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
                  <div className="progress-bar" style={{width: `${currentIndex / allEntries.length * 100}%`}}>{(currentIndex / allEntries.length * 100).toFixed(0)}%</div>
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
        
        <Footer />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <>
    <html lang="de"/>
    <meta charSet="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="List of all irregular German verbs. Test your knowledge with a quiz."/>
    <meta property="og:site_name" content="Unregelmäßige Verben" />
    <meta property="og:title" content="List of all irregular German verbs. Test your knowledge with a quiz." />
    <meta property="og:description" content="Test knowledge of irregular German verbs." />
    <meta property="og:url" content="https://unregelmaessigeverben.com" />
    <meta property="og:image" content="https://unregelmaessigeverben.com/images/opengraph.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <title>Quiz mit Verben</title>
  </>
)
