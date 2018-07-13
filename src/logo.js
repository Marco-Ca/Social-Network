import React from 'react';
import {Link} from 'react-router-dom';

export default function Logo() {
    return (
        <div id="logo">
            <Link to={'/'}><img src="/images/diary.png" /></Link>
            <Link to={'/friends'}><span className="spans">FRIENDS</span></Link>
            <Link to={'/online'}><span className="spans">ONLINE</span></Link>
            <Link to={'/chat'}><span className="spans">DIARY</span></Link>
            <a href="/logout"><span className="spans"> LOGOUT </span></a>
        </div>
    );
}
