import { useState } from 'react';
import './modal.css';

function Example(props) {
	return (
		<>
			<div>
				<div className='myModal'></div>
				<div className='modalContainer'>
					<div className='modalHead'>{props.head}</div>

					<div className='modalDes'>{props.des}</div>

					<div className='modalButton' onClick={props.closeModal}>
						{props.btnTxt}
					</div>
				</div>
			</div>
		</>
	);
}

export default Example;
