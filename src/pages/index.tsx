import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt"
import { FaSearch } from "@react-icons/all-files/fa/FaSearch"
import classNames from "classnames"
import { type HeadFC, type PageProps } from "gatsby"
import * as React from "react"
import { useCallback, useState, useMemo } from "react"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import allVerbs from "../data/uregelmassige_verben.yaml"
import "../styles/index.scss"


const IndexPage: React.FC<PageProps> = () => {
  const [selectedHilfsverbFilter, setSelectedHilfsverbFilter] = useState('haben_and_sein')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderByFilter, setOrderByFilter] = useState('word_desc')
  const [toggledExplanationVerbs, setToggledExplanationVerbs] = useState([])

  const habenVerbsCount = useMemo(() =>
    allVerbs
    .filter(x => 
      !searchQuery 
      || x.verb.includes(searchQuery) 
      || x.praesens.includes(searchQuery) 
      || x.praeteritum.includes(searchQuery) 
      || x.perfekt.includes(searchQuery)
    )
    .filter(x => x.hilfsverb === 'haben')
    .length, 
    []
  )
  const seinVerbsCount = useMemo(() =>
    allVerbs
    .filter(x => 
      !searchQuery 
      || x.verb.includes(searchQuery) 
      || x.praesens.includes(searchQuery) 
      || x.praeteritum.includes(searchQuery) 
      || x.perfekt.includes(searchQuery)
    )
    .filter(x => x.hilfsverb === 'sein')
    .length,
    []
  )

  const onHelperVerbFilterChange = useCallback(
    (helperVerb) => {
      setSelectedHilfsverbFilter(helperVerb)
    }, 
    []
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
  const toggleAllRows = useCallback(
    () => {
      if(toggledExplanationVerbs.length === 0) {
        setToggledExplanationVerbs(allVerbs.map(_ => _.verb))
      } else {
        setToggledExplanationVerbs([])
      }
    },
    [toggledExplanationVerbs]
  )
  

  const visibleVerbs = useMemo(() =>
    [...allVerbs]
    .filter(x => 
      !searchQuery 
      || x.verb.includes(searchQuery) 
      || x.praesens.includes(searchQuery) 
      || x.praeteritum.includes(searchQuery) 
      || x.perfekt.includes(searchQuery)
    )
    .filter(x => selectedHilfsverbFilter.includes(x.hilfsverb))
    .sort(({
      'freq_desc': (a, b) => b.duden_word_frequency - a.duden_word_frequency || a.verb.localeCompare(b.verb),
      'freq_asc': (a, b) => a.duden_word_frequency - b.duden_word_frequency || a.verb.localeCompare(b.verb),
      'word_desc': (a, b) => a.verb.localeCompare(b.verb) || b.duden_word_frequency - a.duden_word_frequency,
      'word_asc': (a, b) => b.verb.localeCompare(a.verb) || b.duden_word_frequency - a.duden_word_frequency,
    })[orderByFilter]),
    [searchQuery, selectedHilfsverbFilter, orderByFilter]
  )

  return (
    <main>
      <Navbar activeRoute="/"/>

      <div className="filter-row__outer-wrapper">
        <div className='filter-row row'>
          <div className="row">
            <div className='col'>
              <div className="input-group input-group-sm">
                <span className="input-group-text"><FaSearch/></span>
                <input 
                  value={searchQuery}
                  onChange={x => setSearchQuery(x.target.value)}
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Schreib zu suchen..." 
                  aria-label="Schreib zu suchen..."
                  aria-describedby="Suchen"/>
              </div>
            </div>

            <div className='col'>
              <div className="form-group haben-or-sein-filter-container">
                <select
                  className="form-select form-select-sm"
                  onChange={e => onHelperVerbFilterChange(e.target.value)}
                  value={selectedHilfsverbFilter}
                  aria-label="Filtern nach haben oder sein"
                >
                  <option value="haben_and_sein">haben & sein ({habenVerbsCount + seinVerbsCount} gesamt)</option>
                  <option value="haben">haben ({habenVerbsCount} gesamt)
                  </option>
                  <option value="sein">sein ({seinVerbsCount} gesamt)</option> 
                </select>
              </div>
            </div>
            <div>
              <div>
              </div>
            </div>           
          </div>
        </div>
      </div>
        <div className='table-wrapper'>
          <div className="table">
            <div className="table-head">
              <div className="cell cell__freq is-clickable"
                onClick={()=> {
                  if(orderByFilter === 'freq_asc'){
                    setOrderByFilter('freq_desc')
                  }else if(orderByFilter === 'freq_desc'){
                    setOrderByFilter('freq_asc')
                  } else {
                    setOrderByFilter('freq_desc')
                  }
                }}
              >
                Freq.
                {orderByFilter === 'freq_asc' && ' ↑'}
                {orderByFilter === 'freq_desc' && ' ↓'}
              </div>
              <div className="cell is-clickable"
                onClick={()=> {
                  if(orderByFilter === 'word_asc'){
                    setOrderByFilter('word_desc')
                  }else if(orderByFilter === 'word_desc'){
                    setOrderByFilter('word_asc')
                  } else {
                    setOrderByFilter('word_desc')
                  }
                }}
              >
                Verb
                {orderByFilter === 'word_asc' && ' ↑'}
                {orderByFilter === 'word_desc' && ' ↓'}
              </div>
              <div className="cell is-table-cell-hidden-on-mobile">Präsens</div>
              <div className="cell is-table-cell-hidden-on-mobile">Präteritum</div>
              <div className="cell is-table-cell-hidden-on-mobile">Perfekt</div>
              <div className="cell cell__vowel is-table-cell-hidden-on-mobile"></div>
              <div className="cell cell__external">
                <div style={{padding: 0}}>
                  <button type="button" className="btn btn-primary btn-sm"
                  onClick={() => toggleAllRows()}>
                    {toggledExplanationVerbs.length === 0 && "Aufklappen"}
                    {toggledExplanationVerbs.length !== 0 && "Einklappen"}
                  </button>
                </div>
              </div>
            </div>
            <div className="table-body">
              {
                visibleVerbs
                  .map(x => 
                  <div key={`${x.verb} ${x.hilfsverb}`}
                    className={classNames('row', {"is-active":toggledExplanationVerbs.includes(x.verb)})}
                  >
                    <div className="row-top" >
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
                        {x.praesens}
                        {
                          x.is_reflexive &&
                          <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </> 
                        }
                      </div>
                      <div className="cell is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
                        {x.praeteritum}
                        {
                          x.is_reflexive &&
                          <>&nbsp;<span className="badge rounded-pill is-sich">sich</span> </>
                        }
                      </div>
                      <div className="cell is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
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
                      <div className="cell cell__vowel is-table-cell-hidden-on-mobile"
                      onClick={_ => toggleRowFn(x.verb)}>
                        {
                          x.vowel_change_from && `${x.vowel_change_from} → ${x.vowel_change_to}` 
                        }
                      </div>
                      <div className="cell cell__external">
                        <div>
                          <DropdownButton size="sm" variant="primary" id="dropdown-basic-button" title={<><FaExternalLinkAlt /> Links </>}>
                            <Dropdown.Item 
                              href={`https://www.linguee.com/german-english/translation/${x.verb}.html`}
                              target="_window">
                              <img height={25} width={25} src="/images/external/linguee_logo.png"/> Linguee
                            </Dropdown.Item>
                            <Dropdown.Item 
                              href={x.duden_url}
                              target="_window">
                              <img height={25} width={25} src="/images/external/duden_logo.jpg"/> Duden
                            </Dropdown.Item>
                            <Dropdown.Item 
                              href={`https://conjugator.reverso.net/conjugation-german-verb-${x.verb}.html`}
                              target="_window">
                              <img height={25} width={25} src="/images/external/reverso_logo.png"/> Reverso
                            </Dropdown.Item>
                            <Dropdown.Item 
                              href={`https://yourdailygerman.com/dictionary/?s=${x.verb}`}
                              target="_window">
                              <img height={25} width={25} src="/images/external/ydg_logo.png"/> Your Daily German
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
            </div>
          </div>
        </div>
        <Footer/>
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
    <meta property="og:title" content="All irregular German verbs" />
    <meta property="og:description" content="List of all irregular German verbs. Test your knowledge with a quiz." />
    <meta property="og:url" content="https://unregelmaessigeverben.com" />
    <meta property="og:image" content="https://unregelmaessigeverben.com/images/opengraph.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <title>Alle Verben</title>
  </>
)
