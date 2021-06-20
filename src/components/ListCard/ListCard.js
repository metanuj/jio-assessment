import React from 'react';
import starIcon from '../../images/star.png';
import starFilledIcon from '../../images/star_filled.png';
import deleteIcon from '../../images/delete.png';
 
const ListCard = ({friend, removeHandler, favHandler}) => {
    return (
        <div className="list-item">
            <div className="info-box">
                <h4>{friend?.name}</h4>
                <p>is your friend</p>
            </div>
            <div className="action-buttons">
                <span onClick={favHandler}>
                    <img src={friend?.hasFav ? starFilledIcon :  starIcon} alt="Favourite" />
                </span>
                <span className="delete-icon" onClick={removeHandler}>
                    <img src={deleteIcon} alt="Remove" />
                </span>
            </div>
        </div>
    );
}

export default ListCard;