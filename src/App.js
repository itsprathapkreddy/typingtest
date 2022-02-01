import { useEffect, useState, useRef } from 'react';
import Timer from './Components/Timer';
import SideBar from './Components/SideBar';
import Header from './Components/Header';
import { Container, Row, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
	const [words, setWords] = useState('');
	const [time, setTime] = useState(0);
	const [textArea, setTextArea] = useState('');
	const [skip, setSkip] = useState(false);
	const [wordsHtml, setWordsHtml] = useState('');
	const [typedWords, setTypedWords] = useState(0);
	const [curWordIndex, setCurWordIndex] = useState(0);
	const [textAreaDisabled, setTextAreaDisabled] = useState(false);

	const [correctWords, setCorrectWords] = useState(0);
	const [accuracy, setAccuracy] = useState(0);

	const [prevWords, setPrevWords] = useState('');
	const [afterWords, setAfterWords] = useState('');
	const [currWordHook, setCurrWordHook] = useState('');
	const scollToRef = useRef();

	const getQuotes = async () => {
		setWords('');
		for (let i = 0; i < time * 2; i++) {
			const response = await fetch(
				'https://api.quotable.io/random?minLength=200'
			);
			const data = await response.json();

			setWords((x) => x.concat(data.content.replaceAll("'", '')));
		}
	};

	const handleKeyPress = (e) => {
		if (
			e.key == 'Backspace' ||
			e.key == 'Delete' ||
			e.key == 'ArrowRight' ||
			e.key == 'ArrowLeft'
		) {
			alert('Bacspace and Delete Keys are not ALLOWED');
			setSkip(true);
		}
	};

	const handleChange = (e) => {
		if (!skip) setTextArea(e.target.value);
		else setSkip((x) => (x = !x));
		let last = e.target.value;
		if (last.charAt(last.length - 1) == ' ') setCurWordIndex(0);
		else setCurWordIndex((x) => x + 1);
	};

	useEffect(() => {
		getQuotes();
	}, [time]);

	useEffect(() => {
		updateCurrentWordHook();
		setCurrWordHook(
			<span style={{ color: '#F2CB05' }}>{words.split(' ')[typedWords]}</span>
		);
		setPrevWords((x) => (
			<span className='prevWords'>
				{x} {words.split(' ')[typedWords - 1]}
			</span>
		));
		setAfterWords(
			<span>
				{words
					.split(' ')
					.slice(typedWords + 1)
					.join(' ')}
			</span>
		);
	}, [typedWords, words]);

	useEffect(() => {
		if (textArea.match(/[' ']/g) === null) {
			setTypedWords(0);
		} else if (textArea.match(/[' ']/g).length > typedWords) {
			setTypedWords(textArea.match(/[' ']/g).length);
			updateResult();
		}
		updateCurrentWordHook();
	}, [textArea]);

	const updateCurrentWordHook = () => {
		const x = words.split(' ')[typedWords];
		const y = textArea.split(' ')[typedWords];
		setCurrWordHook('');
		for (let i = 0; i < x.length; i++) {
			if (i < curWordIndex) {
				if (x.charAt(i) == y.charAt(i))
					setCurrWordHook((cw) => (
						<>
							{cw}
							<span className='correctChar'>{x.charAt(i)}</span>
						</>
					));
				else if (x.charAt(i) != y.charAt(i))
					setCurrWordHook((cw) => (
						<>
							{cw}
							<span className='wrongChar'>{x.charAt(i)}</span>
						</>
					));
			} else
				setCurrWordHook((cw) => (
					<>
						{cw}
						<span style={{ color: '#F2CB05' }}>{x.charAt(i)}</span>
					</>
				));
		}
	};

	const updateResult = () => {
		setCorrectWords(0);
		words.split(' ').forEach((x, i) => {
			if (textArea.split(' ')[i] != undefined) {
				if (x == textArea.split(' ')[i]) {
					setCorrectWords((x) => x + 1);
				}
			}
		});
	};

	useEffect(() => {
		setAccuracy((correctWords / typedWords) * 100);
	}, [correctWords]);

	const endTest = () => {
		setTextAreaDisabled(true);
		console.log('Time has ENDED');
	};
	useEffect(() => {
		if (scollToRef.current != undefined) scollToRef.current.scrollIntoView();
	}, [currWordHook]);

	return (
		<div className='App'>
			<Header />
			<Container>
				<Row>
					<Col sm={8}>
						<Row>
							{!time && (
								<div>
									<button onClick={() => setTime(1)}>1 Min</button>
									<button onClick={() => setTime(2)}>2 Min</button>
									<button onClick={() => setTime(3)}>3 Min</button>
									<button onClick={() => setTime(5)}>5 Min</button>
								</div>
							)}
						</Row>
						{!time == 0 && (
							<>
								<Row>
									<Timer time={time} endTest={endTest} />
								</Row>

								<Row>
									<div className='testing01'>
										{prevWords}{' '}
										<span ref={scollToRef} className='currentwordHook'>
											{currWordHook}
										</span>{' '}
										{afterWords}
									</div>
								</Row>
								<Row>
									<textarea
										className='textArea'
										disabled={textAreaDisabled}
										onKeyDown={handleKeyPress}
										onChange={handleChange}
										value={textArea}></textarea>
								</Row>
							</>
						)}
					</Col>
					<Col sm={4}>
						{!time == 0 && (
							<SideBar
								correctWords={correctWords}
								typedWords={typedWords}
								accuracy={accuracy.toFixed(2)}
								time={time}
								endTest={endTest}
							/>
						)}
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default App;
