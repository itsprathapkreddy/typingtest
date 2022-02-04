import { useState } from 'react';
import '../App.css';
import * as Icon from 'react-bootstrap-icons';

const SideBar = (props) => {
	const [reportButton, setReportButton] = useState(true);
	const reportWords = props.reportWords;

	return (
		<div className='sideBar'>
			<div className='sideBarHead'>
				Live Results
				<hr />
			</div>
			<table>
				<tbody>
					<tr>
						<td>
							<Icon.CheckCircleFill color='#6fbf7b' />
							&nbsp;
						</td>
						<td>Correct Words:</td>
						<td>{props.correctWords}</td>
					</tr>
					<tr>
						<td>
							<Icon.KeyboardFill color='#f2b705' />
						</td>
						<td>Total Words: </td>
						<td>{props.typedWords}</td>
					</tr>
					<tr>
						<td>
							<Icon.PatchCheckFill color='#6fbf7b' />
						</td>
						<td>Accuracy: </td>
						<td>{isNaN(props.accuracy) ? 0 : props.accuracy}%</td>
					</tr>
				</tbody>
			</table>
			<hr />
			{props.textAreaDisabled && reportButton && (
				<div className='sideBarFoot' onClick={() => setReportButton(false)}>
					Get Full Report
				</div>
			)}
			{!reportButton && (
				<div>
					<div className='sideBarReportHead'>Full Report</div>
					<Icon.ClockFill color='#f2b705' /> Speed:&nbsp;
					{props.typedWords / props.time} words per Min
					<div className='sideBarReportHead'>
						<hr />
						Corrections
					</div>
					<table width='100%'>
						<tbody>
							{reportWords.map((data, index) => {
								return (
									<tr key={index}>
										<td style={{ color: 'red' }}>{data.wrong}</td>
										<td style={{ color: 'green' }}>{data.correct}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
export default SideBar;
