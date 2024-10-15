import * as React from "react"
import { Link } from "gatsby"
import {useState} from "react"
import { FaMoon } from "@react-icons/all-files/fa/FaMoon";
import { MdBrightness4 } from "@react-icons/all-files/md/MdBrightness4";
import classNames from "classnames";


enum UiTheme {
  light = "light",
  dark = "dark"
}
const UI_THEME_STORAGE_KEY = "ui_theme";
const DEFAULT_UI_THEME = UiTheme.light;

type NavbarProps = {
  activeRoute: string;
}

const Navbar = ({activeRoute}: NavbarProps) => {
  const [selectedTheme, setSelectedTheme] = useState(UiTheme.light);

  React.useEffect(() => {
    const storedThemeChoice = localStorage.getItem(UI_THEME_STORAGE_KEY);
    const theme = (storedThemeChoice || DEFAULT_UI_THEME) as UiTheme;
    if(!!storedThemeChoice){
      localStorage.setItem(UI_THEME_STORAGE_KEY, theme);
    }
    document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', theme);
    setSelectedTheme(theme);
  },[])

  const switchTheme = () => {
    if(selectedTheme === UiTheme.light){
      setSelectedTheme(UiTheme.dark)
      localStorage.setItem(UI_THEME_STORAGE_KEY, UiTheme.dark);
      document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', UiTheme.dark);
    } else {
      setSelectedTheme(UiTheme.light)
      localStorage.setItem(UI_THEME_STORAGE_KEY, UiTheme.light);
      document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', UiTheme.light);
    }
  }

  return (
    <nav className="navbar navbar-expand-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">Unregelmäßige Verben</Link>
        <div className="collapse navbar-collapse navbar-desktop">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={classNames("nav-link", {"active": activeRoute === "/"})} to="/">
                Verben
              </Link>
            </li>
            <li className="nav-item">
              <Link className={classNames("nav-link", {"active": activeRoute === "/quiz"})} to="/quiz">
                Quiz
              </Link>
            </li>
          </ul>
          <div className="d-flex is-clickable" onClick={switchTheme}>
            {selectedTheme === 'light' && <MdBrightness4 className="icon-sun"/>}
            {selectedTheme === 'dark' && <FaMoon className="icon-moon"/>}
          </div>
        </div>

        <div className="navbar-mobile">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={classNames("nav-link", {"active": activeRoute === "/"})} to="/">
                Verben
              </Link>
            </li>
            <li className="nav-item">
              <Link className={classNames("nav-link", {"active": activeRoute === "/quiz"})} to="/quiz">
                Quiz
              </Link>
            </li>
            <li className="nav-item is-clickable"  onClick={switchTheme}>
              {selectedTheme === 'light' && <MdBrightness4 className="icon-sun"/>}
              {selectedTheme === 'dark' && <FaMoon className="icon-moon"/>}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;