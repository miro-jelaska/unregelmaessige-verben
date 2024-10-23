
import { useCallback, useState, useMemo } from "preact/hooks"
import allVerbs from "../data/uregelmassige_verben.yml"
import VerbRow from "./VerbRow"


const IndexPage = () => {
  const [selectedHilfsverbFilter, setSelectedHilfsverbFilter] = useState('haben_and_sein')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderByFilter, setOrderByFilter] = useState('word_desc')
  const [toggledExplanationVerbs, setToggledExplanationVerbs] = useState([])

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
    .filter(_ => 
      !searchQuery 
      || _.verb.includes(searchQuery) 
      || _.praesens.includes(searchQuery) 
      || _.praeteritum.includes(searchQuery) 
      || _.perfekt.includes(searchQuery)
    )
    .filter(_ => selectedHilfsverbFilter.includes(_.hilfsverb))
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
      <div className="filter-row__outer-wrapper">
        <div className='filter-row row'>
          <div className="row">
            <div className='col'>
              <div className="input-group">
                <input 
                  value={searchQuery}
                  onChange={event => setSearchQuery((event.target as HTMLInputElement).value)}
                  onKeyUp={event => setSearchQuery((event.target as HTMLInputElement).value)}
                  type="text" 
                  className="form-control" 
                  placeholder="🔎  Schreib zu suchen..." 
                  aria-label="Schreib zu suchen..."
                  aria-describedby="Suchen"/>
              </div>
            </div>

            <div className='col'>
              <div className="form-group haben-or-sein-filter-container">
                <select
                  className="form-select"
                  onChange={event => onHelperVerbFilterChange((event.target as HTMLInputElement).value)}
                  value={selectedHilfsverbFilter}
                  aria-label="Filtern nach haben oder sein"
                >
                  <option value="haben_and_sein">haben & sein</option>
                  <option value="haben">haben</option>
                  <option value="sein">sein</option> 
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
                } else if(orderByFilter === 'freq_desc'){
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
                } else if(orderByFilter === 'word_desc'){
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
                <button type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => toggleAllRows()}
                >
                  {toggledExplanationVerbs.length === 0 && "Aufklappen"}
                  {toggledExplanationVerbs.length !== 0 && "Einklappen"}
                </button>
              </div>
            </div>
          </div>
          <div className="table-body">
            {
              visibleVerbs
                .map(definition => 
                  <VerbRow 
                    key={`${definition.verb} ${definition.hilfsverb}`}
                    definition={definition} 
                    onToggle={toggleRowFn} 
                    isDescriptionExpanded={toggledExplanationVerbs.includes(definition.verb)}
                    areQuizSectionVisible={true}
                    hasQuizAnswerCell={false}
                    isAnsweredCorrectly={null}
                  />
                )
            }
          </div>
        </div>
      </div>
    </main>
  )
}

export default IndexPage;
