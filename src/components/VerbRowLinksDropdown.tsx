import classNames from "classnames"
import {useState, useEffect, useRef} from 'preact/hooks'
import LogoLinguee from "../images/external/linguee_logo.webp"
import LogoDuden from "../images/external/duden_logo.webp"
import LogoReverso from "../images/external/reverso_logo.webp"
import LogoYdg from "../images/external/ydg_logo.webp"

export type VerbRowLinksDropdownProps = {
  verb: string,
  dudenUrl: string,
}
const VerbRowLinksDropdown = ({verb, dudenUrl}: VerbRowLinksDropdownProps) => {
  const [areLinksVisible, setAreLinksVisible] = useState(false);
  
  // Source: StackOverflow "Detect click outside React component"
  // https://stackoverflow.com/a/42234988
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains((event.target as HTMLInputElement))) {
        setAreLinksVisible(false);
      }
    }
    // Bind the event listener.
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up.
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="dropdown" ref={wrapperRef}>
      <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
        onClick={() => setAreLinksVisible(!areLinksVisible)}
      >
        Links
      </button>
      <div className={classNames("dropdown-menu", {"show": areLinksVisible})} 
        style={{position: 'absolute', inset: '0px 0px auto auto', transform: 'translate3d(-0.5px, 33px, 0px)'}}
        aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" 
          href={`https://www.linguee.com/german-english/translation/${verb}.html`}
          target="_window"
        >
          <img height={25} width={25} src={LogoLinguee.src}/>&nbsp;
          Linguee
        </a>
        <a className="dropdown-item" 
          href={dudenUrl}
          target="_window"
        >
          <img height={25} width={25} src={LogoDuden.src}/>&nbsp;
          Duden
        </a>
        <a className="dropdown-item" 
          href={`https://conjugator.reverso.net/conjugation-german-verb-${verb}.html`}
          target="_window"
        >
          <img height={25} width={25} src={LogoReverso.src}/>&nbsp;
          Reverso
        </a>
        <a className="dropdown-item" 
          href={`https://yourdailygerman.com/dictionary/?s=${verb}`}
          target="_window"
        >
          <img height={25} width={25} src={LogoYdg.src}/>&nbsp;
          Your Daily German
        </a>
      </div>
    </div>
  )
}
export default VerbRowLinksDropdown