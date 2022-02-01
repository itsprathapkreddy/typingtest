import '../App.css';

import { useState, useEffect } from 'react';
const Timer = (props) => {
	const time = Math.round(props.time) * 60;

	const [minutes, setMinutes] = useState(time);
	const [seconds, setSeconds] = useState(0);
	const [perTime, setPerTime] = useState(100);
	var startTime, countAmt, interval, cnt;
	useEffect(() => {
		setPerTime(((minutes * 60 + seconds) / time) * 100);
	}, [time, minutes, seconds]);
	function now() {
		return new Date().getTime();
	}

	function tick() {
		var elapsed = now() - startTime;
		cnt = countAmt - elapsed;

		if (cnt > 0) {
			setMinutes(Math.floor(cnt / 60000));
			setSeconds(Math.floor((cnt % 60000) / 1000));
		} else {
			setMinutes(0);
			setSeconds(0);
			props.endTest();
			clearInterval(interval);
		}
	}

	useEffect(() => {
		setMinutes(Math.floor(time / 60));
		setSeconds(time % 60);
		countAmt = time * 1000;
		startTime = now();
		let interval = setInterval(tick, 1000);
	}, []);

	return (
		<div
			className={
				perTime > 30 ? 'timerContainer' : 'timerContainer redTimerContainer'
			}>
			<div
				className={perTime > 30 ? 'timerRunner' : 'timerRunner redTimerRunner'}
				style={{
					width: perTime > 100 ? 100 : perTime + '%',
				}}></div>
			<div className='timerText'>
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</div>
		</div>
	);
};
export default Timer;
