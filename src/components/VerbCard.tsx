import classNames from "classnames"
import { useMemo, useState, useCallback, useEffect } from "preact/hooks"
import type { VerbDetails } from "../data/domain"
import VerbCardLinksDropdown from "./VerbRowLinksDropdown"
import { useSpacebarKeyPress } from "../utils"


export type VerbCardProps = {
  definition: VerbDetails
  isDescriptionExpanded: boolean
  onToggle: (verb: string) => void

  isMarked: boolean
  onMarkClick: (verb: string) => void
  showBookmarked: () => void
  goToPreviousCard: () => void
  goToNextCard: () => void
}


const VerbCard = ({definition, isDescriptionExpanded, isMarked, onMarkClick, showBookmarked, goToPreviousCard, goToNextCard }: VerbCardProps) => {
  const [areDetailsVisible, setAreDetailsVisible] = useState(false); 
  const [areExamplesVisible, setAreExamplesVisible] = useState(false); 
  const [revealedPart, setRevealedPart] = useState(-1);
  const spacebarPress = useSpacebarKeyPress();
  
  const revealAnswer = useCallback(
    () =>{ 
      setAreDetailsVisible(true)
    },
    [setAreDetailsVisible]
  )
  useEffect(()=>{
    const val = Math.floor(Math.random()*4);
    console.log(val)
    setRevealedPart(val) 
  },[setRevealedPart])

  const onToggle = useCallback(()=>{
    setAreExamplesVisible(!areExamplesVisible)
  }, [setAreExamplesVisible, areExamplesVisible])

  useEffect(() => {
    if (spacebarPress) {
      revealAnswer()
    }
  }, [spacebarPress]);

  return (
    <div className={classNames('Card', 'verb-card', {"is-active": isDescriptionExpanded })}>
        <div className="Card-top" onClick={_ => onToggle()}>
          <div className="cell is-table-cell-hidden-on-mobile">
            <b>{(areDetailsVisible || revealedPart === 0) ? definition.verb : "?"}</b>
            {
              (areDetailsVisible || revealedPart === 0)
              && definition.is_reflexive 
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
            }
          </div>
          <div className="cell is-table-cell-hidden-on-mobile">
            {(areDetailsVisible || revealedPart === 1) ? definition.praesens : "?"}
            {
              (areDetailsVisible || revealedPart === 1)
              && definition.is_reflexive 
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
            }
          </div>
          <div className="cell is-table-cell-hidden-on-mobile">
            {(areDetailsVisible || revealedPart === 2) ? definition.praeteritum : "?"}
            {
              (areDetailsVisible || revealedPart === 2)
              && definition.is_reflexive
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </>
            }
          </div>
          <div className="cell is-table-cell-hidden-on-mobile">
            {
              (areDetailsVisible || revealedPart === 3)
              && (
                definition.hilfsverb === "haben" 
                ? <span className="badge rounded-pill is-haben">hat</span> 
                : <span className="badge rounded-pill is-sein">ist</span> 
              )
            }
            {
              (areDetailsVisible || revealedPart === 3)
              && definition.is_reflexive
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span></>
            }
            {(areDetailsVisible || revealedPart === 3) ? ` ${definition.perfekt}` : "?"}
          </div>
        </div>
        <div className='Card-bottom'
          /*We do show/hide instead of Reacts &&-way to make content visible to crawlers.*/
          style={{display: (areExamplesVisible ? "flex" : "none")}}
          >
          <div className="Card-bottom__inner card">
            <div  className="card-body p-0">
              {!definition.examples && <p className="is-notice-text">Noch keine Beispiele. (<i>No examples yet.</i>)</p>}
              {definition.examples && definition.examples.map(example => 
                <ul key={example.de} className="example list-unstyled">
                  <li className="de" dangerouslySetInnerHTML={{__html:example.de}}/>
                  <li className="en">{example.en}</li>
                </ul>
              )} 
            </div>
          </div>
        </div>
        <div style={{marginTop: "2rem"}}>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
            <button type="button" className="btn btn-primary m-2" onClick={() => goToPreviousCard()}>Prev</button>
            <button type="button" className="btn btn-primary m-2" onClick={() => onMarkClick(definition.verb)}>
              {isMarked ? "✅ Unmark" : "Mark"}
            </button>
            <button type="button" className="btn btn-danger m-2" disabled={areDetailsVisible} onClick={() => revealAnswer()}>Reveal</button>
            <button type="button" className="btn btn-primary m-2" onClick={() => goToNextCard()}>Next</button>
          </div>
          <div className="mt-5" style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: "2rem"}}>
           <button type="button" className="btn btn-primary btn-sm m-2" onClick={() => showBookmarked()}>Bookmarked</button>
            <VerbCardLinksDropdown 
              verb={definition.verb} 
              dudenUrl={definition.duden_url}
              />
          </div>
        </div>
      </div>
  )
}
export default VerbCard;