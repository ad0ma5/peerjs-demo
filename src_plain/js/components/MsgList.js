import React from 'react';

const MsgList = ({msg}) => {
	var i = 0;
	return (
		<div className="limit-height float-left">
		{
			msg.map( m => {
				i++;
				return (
					<div key={i}>{m}</div>
				);
			})
		}
		</div>
	)
};

export default MsgList;
