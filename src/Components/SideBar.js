import '../App.css';

const SideBar = (props) => {
	return (
		<div className='sideBar'>
			<div>Correct Words:{props.correctWords}</div>
			<div>Total Words: {props.typedWords}</div>
			<div>Accuracy: {isNaN(props.accuracy) ? 0 : props.accuracy}%</div>
		</div>
	);
};
export default SideBar;
