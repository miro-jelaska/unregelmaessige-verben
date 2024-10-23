import classNames from "classnames"
import { useMemo } from "preact/hooks"
import type { VerbDetails } from "../data/domain"
import VerbRowLinksDropdown from "./VerbRowLinksDropdown"


export type VerbRowProps = {
  definition: VerbDetails
  isDescriptionExpanded: boolean
  onToggle: (verb: string) => void

  areQuizSectionVisible: boolean
  hasQuizAnswerCell: boolean
  isAnsweredCorrectly: boolean | null
}

const getFrequencyIcon = (frequency: number) => {
  if(frequency === 1){
    return <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3z"></path></svg>
  }
  if(frequency === 2){
    return <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7z"></path></svg>
  }
  if(frequency === 3){
    return <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7zm4-3h2v11h-2z"></path></svg>
  }
  if(frequency === 4){
    return <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7zm4-3h2v11h-2zm4-3h2v14h-2z"></path></svg>
  }
  if(frequency === 5){
    return <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M3 16h2v5H3zm4-3h2v8H7zm4-3h2v11h-2zm4-3h2v14h-2zm4-3h2v17h-2z"></path></svg>
  }
  return <></>
}

const VerbRow = ({definition, isDescriptionExpanded, onToggle, areQuizSectionVisible, hasQuizAnswerCell, isAnsweredCorrectly}: VerbRowProps) => {
  const quizAnswerCellElement = useMemo(()=> {
    if(hasQuizAnswerCell === false){
      return <></>
    }
    return (
      <div className={
        classNames(
          "cell cell__validity", 
          {
            "is-correct": isAnsweredCorrectly === true, 
            "is-incorrect": isAnsweredCorrectly === false
          }
        )
        }
      >
        {isAnsweredCorrectly === true && "R"}
        {isAnsweredCorrectly === false && "F"}
      </div>
    )
  }, [hasQuizAnswerCell, isAnsweredCorrectly])
  return (
    <div className={classNames('row', {"is-active": isDescriptionExpanded })}
      >
        <div className="row-top" >
          {quizAnswerCellElement}
          <div className="cell cell__freq"
            onClick={_ => onToggle(definition.verb)}>
            {getFrequencyIcon(definition.duden_word_frequency)}
          </div>
          <div className="cell"
            onClick={_ => onToggle(definition.verb)}>
            <span style={{fontWeight:600}}>
              {definition.verb}
              {
                definition.is_reflexive &&
                <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
              }
            </span>
          </div>
          <div className="cell is-table-cell-hidden-on-mobile"
            onClick={_ => onToggle(definition.verb)}>
            {areQuizSectionVisible && definition.praesens}
            {
              areQuizSectionVisible
              && definition.is_reflexive 
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
            }
          </div>
          <div className="cell is-table-cell-hidden-on-mobile"
          onClick={_ => onToggle(definition.verb)}>
            {definition.praeteritum}
            {
              areQuizSectionVisible
              && definition.is_reflexive
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </>
            }
          </div>
          <div className="cell is-table-cell-hidden-on-mobile"
            onClick={_ => onToggle(definition.verb)}>
            {
              areQuizSectionVisible
              && definition.hilfsverb === "haben" 
              ? <span className="badge rounded-pill is-haben">hat</span> 
              : <span className="badge rounded-pill is-sein">ist</span> 
            }
            {
              areQuizSectionVisible
              && definition.is_reflexive
              && <>&nbsp;<span className="badge rounded-pill is-sich">sich</span></>
            }
            &nbsp; {definition.perfekt}
          </div>
          <div className="cell cell__vowel is-table-cell-hidden-on-mobile"
          onClick={_ => onToggle(definition.verb)}>
            {
              areQuizSectionVisible 
              && definition.vowel_change_from
              && `${definition.vowel_change_from} → ${definition.vowel_change_to}` 
            }
          </div>
          <div className="cell cell__external">
            <VerbRowLinksDropdown 
              verb={definition.verb} 
              dudenUrl={definition.duden_url}
              />
          </div>
        </div>
        {
          isDescriptionExpanded &&
          <div className='row-bottom '>
            <div className="row-bottom__explanation card is-table-cell-hidden-on-desktop">
              <div className="cell is-table-cell-hidden-on-desktop">
              {definition.praesens}
              {
                definition.is_reflexive &&
                <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
              }
            </div>
            <div className="cell is-table-cell-hidden-on-desktop">
              {definition.praeteritum}
              {
                definition.is_reflexive &&
                <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </>
              }
            </div>
            <div className="cell is-table-cell-hidden-on-desktop">
              {
                definition.hilfsverb === "haben" 
                ? <span className="badge rounded-pill is-haben">hat</span> 
                : <span className="badge rounded-pill is-sein">ist</span> 
              }
              {
                definition.is_reflexive &&
                <>&nbsp;<span className="badge rounded-pill is-sich">sich</span></>
              }
              &nbsp; {definition.perfekt}
            </div>
            <div className="cell cell__vowel is-table-cell-hidden-on-desktop">
              {
                definition.vowel_change_from && `${definition.vowel_change_from} → ${definition.vowel_change_to}` 
              }
            </div>
            </div>
            <div className="row-bottom__inner card">
              <div  className="card-body p-0">
                {!definition.examples && <p className="is-notice-text">Noch keine Beispiele. (<i>No examples yet.</i>)</p>}
                {definition.examples && definition.examples.map(example => 
                  <ul key={example.de} className="example list-unstyled">
                    <li className="de">{example.de}</li>
                    <li className="en">{example.en}</li>
                  </ul>
                )} 
              </div>
            </div>
          </div>
        }
      </div>
  )
}
export default VerbRow;