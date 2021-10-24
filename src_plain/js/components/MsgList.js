import React from 'react';

const MsgList = ({msg}) => {
	var i = 0;
	return (
		<div className="limit-height">
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
