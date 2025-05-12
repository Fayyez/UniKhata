import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | number>('');
  const [animateResult, setAnimateResult] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setAnimateIn(true);
    // Focus the calculator for keyboard input
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== containerRef.current) return;
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        handleClick(key, getButtonIdx(key));
      } else if (["+", "-", "*", "/", "."].includes(key)) {
        handleClick(key, getButtonIdx(key));
      } else if (key === 'Enter' || key === '=') {
        handleCalculate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [input]);

  // Helper to get button index for animation
  const getButtonIdx = (val: string) => {
    const flat = buttons.flat();
    return flat.indexOf(val);
  };

  const handleClick = (value: string, idx?: number) => {
    setInput((prev) => prev + value);
    if (typeof idx === 'number' && idx !== -1) {
      setPressedIdx(idx);
      setTimeout(() => setPressedIdx(null), 180);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setPressedIdx(1000); // Arbitrary index for clear
    setTimeout(() => setPressedIdx(null), 180);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
    setPressedIdx(1001); // Arbitrary index for backspace
    setTimeout(() => setPressedIdx(null), 180);
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input);
      setResult(evalResult);
      setAnimateResult(true);
      setTimeout(() => setAnimateResult(false), 500);
    } catch {
      setResult('Error');
      setAnimateResult(true);
      setTimeout(() => setAnimateResult(false), 500);
    }
    setPressedIdx(999); // Arbitrary index for =
    setTimeout(() => setPressedIdx(null), 180);
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  // Theme-aware classes
  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const shadowClass = 'shadow-2xl';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const displayBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const displayBorderClass = theme === 'dark' ? 'border-blue-500' : 'border-blue-200';
  const resultTextClass = theme === 'dark' ? 'text-blue-200' : 'text-blue-800';
  const opBtnClass = theme === 'dark'
    ? 'bg-purple-900 text-white border-purple-700 hover:bg-purple-800'
    : 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200';
  const eqBtnClass = theme === 'dark'
    ? 'bg-blue-800 text-white border-blue-700 hover:bg-blue-900'
    : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
  const numBtnClass = theme === 'dark'
    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200';
  const clearBtnClass = theme === 'dark'
    ? 'bg-red-900 text-white border-red-700 hover:bg-red-800'
    : 'bg-red-500 text-white border-red-600 hover:bg-red-600';
  const backBtnClass = theme === 'dark'
    ? 'bg-yellow-700 text-gray-900 border-yellow-600 hover:bg-yellow-800'
    : 'bg-yellow-400 text-gray-900 border-yellow-500 hover:bg-yellow-500';

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`w-full max-w-xs mx-auto ${bgClass} ${borderClass} ${shadowClass} rounded-2xl p-6 border-2 outline-none transition-all duration-700 ease-in-out
        ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{boxShadow: '0 8px 32px 0 rgba(30, 64, 175, 0.30), 0 3px 12px 0 rgba(0,0,0,0.22)'}}
      aria-label="Calculator"
    >
      <div className={`mb-3 text-right text-2xl ${displayBgClass} ${displayBorderClass} rounded-lg p-3 min-h-[2.5rem] border-2 font-mono tracking-wider ${textClass} select-all transition-all duration-500 ease-in-out`}>
        {input || '0'}
      </div>
      <div className={`mb-4 text-right text-2xl font-bold min-h-[2rem] font-mono ${resultTextClass} transition-all duration-700 ease-in-out ${animateResult ? 'animate-bounce' : ''}`}>
        {result !== '' ? result : '\u00A0'}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn, idx) => (
          <button
            key={idx}
            className={`py-3 rounded-xl text-xl font-semibold shadow transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400
              ${btn === '='
                ? eqBtnClass
                : btn === '+' || btn === '-' || btn === '*' || btn === '/'
                  ? opBtnClass
                  : numBtnClass}
              ${pressedIdx === idx ? 'scale-95 ring-2 ring-blue-300' : 'scale-100'}
            `}
            onClick={() => {
              if (btn === '=') handleCalculate();
              else handleClick(btn, idx);
            }}
            style={{
              textShadow: btn === '=' || btn === '+' || btn === '-' || btn === '*' || btn === '/' ? '0 1px 2px rgba(0,0,0,0.15)' : undefined
            }}
            tabIndex={0}
            aria-label={btn}
          >
            {btn}
          </button>
        ))}
        <button
          className={`col-span-2 py-3 rounded-xl text-xl font-semibold shadow transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 ${clearBtnClass} ${pressedIdx === 1000 ? 'scale-95 ring-2 ring-red-300' : 'scale-100'}`}
          onClick={handleClear}
          style={{textShadow: '0 1px 2px rgba(0,0,0,0.15)'}}
          tabIndex={0}
          aria-label="Clear"
        >
          C
        </button>
        <button
          className={`col-span-2 py-3 rounded-xl text-xl font-semibold shadow transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 ${backBtnClass} ${pressedIdx === 1001 ? 'scale-95 ring-2 ring-yellow-300' : 'scale-100'}`}
          onClick={handleBackspace}
          tabIndex={0}
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Calculator; 