import { useCallback, useEffect, useRef, useState } from "preact/hooks"

export const useKeyPress = function(targetKey) {
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


const isSpacebar = function(e){
  return (
    e.key == " " 
    || e.code == "Space"
    || e.keyCode == 32   
  )
}
export const useSpacebarKeyPress = function() {
  
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e) => {
      if (isSpacebar(e)) {
        setKeyPressed(true);
      }
    }
  
    const upHandler = (e) => {
      if (isSpacebar(e)) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keyPressed;
};